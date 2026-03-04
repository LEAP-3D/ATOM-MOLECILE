import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { refineChartSqlWithGemini } from "./utils/gemini-refiner";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { improveUserPromptWithGemini } from "./utils/gemini-prompt";
import { generateInsight } from "./utils/insight";

const CHART_TYPES = ["bar", "line", "area", "pie", "scatter"] as const;
type ChartType = (typeof CHART_TYPES)[number];
type GeminiResponseType = {
  chartType: string;
  sql: string;
  title?: string;
  description?: string;
  xAxisKey: string;
  yAxisKey: string;
  aggregationType?: string;
  analysisHint?: string;
  xField?: string;
  yField?: string;
};
type FileData = {
  name: string;
  columns: string[];
  data: Record<string, unknown>[];
};
type ImprovedChartRecommendation = {
  chartType?: unknown;
  chart_type?: unknown;
  type?: unknown;
  confidence?: unknown;
};

function normalizeChartType(type: unknown): ChartType {
  const raw = String(type ?? "")
    .toLowerCase()
    .replace(/[_\s-]/g, "")
    .trim();
  if (CHART_TYPES.includes(raw as ChartType)) return raw as ChartType;
  if (raw.includes("pie") || raw === "donut" || raw === "doughnut")
    return "pie";
  if (raw.includes("scatter")) return "scatter";
  if (raw.includes("area")) return "area";
  if (raw.includes("line")) return "line";
  return "bar";
}

function normalizeConfidence(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(1, Math.max(0, numeric));
}

function normalizeRecommendedCharts(
  charts: unknown
): Array<{ chartType: ChartType; confidence: number }> {
  if (!Array.isArray(charts)) return [];
  return charts.map((item) => {
    const rec = (item ?? {}) as ImprovedChartRecommendation;
    return {
      chartType: normalizeChartType(
        rec.chartType ?? rec.chart_type ?? rec.type
      ),
      confidence: normalizeConfidence(rec.confidence),
    };
  });
}

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripMarkdownFence(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function parseGeminiResponse(raw: string): GeminiResponseType {
  return JSON.parse(stripMarkdownFence(raw)) as GeminiResponseType;
}

function assertSafeSqlBase(sql: string, tableName: string) {
  const s = sql.trim().toLowerCase();
  if (!/^(select|with)\b/.test(s))
    throw new Error("Only SELECT/WITH SELECT allowed");
  if (!/\bselect\b/.test(s)) throw new Error("Only SELECT queries allowed");
  if (
    /\b(insert|update|delete|drop|alter|create|truncate|grant|revoke|execute|do|copy|call)\b/.test(
      s
    )
  ) {
    throw new Error("Unsafe SQL detected");
  }
  if (s.includes(";") || s.includes("--") || s.includes("/*"))
    throw new Error("Multi-statement/comments not allowed");

  const cteNames = new Set(
    [...sql.matchAll(/\bwith\s+([a-zA-Z_]\w*)\s+as\b|,\s*([a-zA-Z_]\w*)\s+as\b/gi)]
      .map((m) => (m[1] ?? m[2] ?? "").toLowerCase())
      .filter(Boolean)
  );
  const refs = [...sql.matchAll(/\b(from|join)\s+([a-zA-Z_][\w.]*)\b/gi)]
    .map((m) => m[2].toLowerCase())
    .filter((ref) => ref !== "lateral");
  if (!refs.length) throw new Error("SQL must include FROM/JOIN");
  const allowed = new Set([
    tableName.toLowerCase(),
    `public.${tableName}`,
    ...cteNames,
  ]);
  if (refs.some((ref) => !allowed.has(ref))) {
    throw new Error(`SQL must reference only ${tableName}`);
  }
}

function assertSafeSelect(
  sql: string,
  tableName: string,
  fileName: string,
  userId: string
) {
  assertSafeSqlBase(sql, tableName);
  const safeFile = escapeSqlLiteral(fileName);
  const safeUser = escapeSqlLiteral(userId);
  const file = escapeRegExp(safeFile);
  const user = escapeRegExp(safeUser);
  const fileRe = new RegExp(
    String.raw`\buf\.(?:"file_name"|file_name)\s*=\s*'${file}'`,
    "i"
  );
  const userRe = new RegExp(
    String.raw`\buf\.(?:"user_id"|user_id)\s*=\s*'${user}'`,
    "i"
  );
  if (!fileRe.test(sql)) throw new Error("SQL must filter by uf.file_name");
  if (!userRe.test(sql)) throw new Error("SQL must filter by uf.user_id");
}

if (process.env.NODE_ENV !== "production") {
  const demoFileParen = escapeRegExp(escapeSqlLiteral("report (1).xlsx"));
  const demoFileDot = escapeRegExp(escapeSqlLiteral("v1.0.xlsx"));
  const demoFileRe = new RegExp(
    String.raw`\buf\.(?:"file_name"|file_name)\s*=\s*'${demoFileParen}'`,
    "i"
  );
  const demoFileQuotedRe = new RegExp(
    String.raw`\buf\.(?:"file_name"|file_name)\s*=\s*'${demoFileDot}'`,
    "i"
  );
  if (!demoFileRe.test(`WHERE uf.file_name = 'report (1).xlsx'`)) {
    throw new Error("Dev assert failed: report (1).xlsx should match");
  }
  if (!demoFileQuotedRe.test(`WHERE uf."file_name" = 'v1.0.xlsx'`)) {
    throw new Error('Dev assert failed: v1.0.xlsx should match');
  }
}

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Нэвтрээгүй байна" }, { status: 401 });
    const body = (await req.json()) as {
      query?: string;
      filesData?: FileData[];
    };
    const query = body.query?.trim();
    const filesData = body.filesData;
    if (!query || !filesData?.length) {
      return NextResponse.json(
        { error: "Query болон файлын мэдээлэл шаардлагатай" },
        { status: 400 }
      );
    }

    if (filesData.length !== 1) {
      return NextResponse.json(
        {
          error:
            "Одоогоор нэг удаад зөвхөн 1 файл сонгож график үүсгэнэ. 2+ файл сонгосон байна.",
        },
        { status: 422 }
      );
    }

    const file0 = filesData[0];
    const tableName = "uploaded_files";
    const fileName = file0?.name ?? "Unknown file";
    const columns = file0?.columns ?? [];

    console.log("📝 Query:", query);
    console.log("📁 File name:", fileName);
    console.log("📁 Columns:", columns);

    if (!columns.length) {
      return NextResponse.json(
        { error: "Файлын column мэдээлэл хоосон байна" },
        { status: 400 }
      );
    }

    const ImprovedQuery = await improveUserPromptWithGemini(query);
    const normalizedQuery = String(
      (
        ImprovedQuery as {
          normalized_query?: unknown;
        }
      ).normalized_query ?? ""
    ).trim();
    if (!normalizedQuery) {
      return NextResponse.json(
        { error: "Normalized query is missing from improver output" },
        { status: 422 }
      );
    }
    console.log("✨ Improved query:", ImprovedQuery);

    const normalizedRecommendedCharts = normalizeRecommendedCharts(
      (
        ImprovedQuery as {
          recommended_charts?: unknown;
          recommendedCharts?: unknown;
        }
      ).recommended_charts ??
        (
          ImprovedQuery as {
            recommended_charts?: unknown;
            recommendedCharts?: unknown;
          }
        ).recommendedCharts
    );

    const rawGemini = await refineChartSqlWithGemini(
      tableName,
      normalizedQuery,
      columns,
      fileName,
      userId
    );

    console.log("✨ Gemini raw:", rawGemini);
    const geminiResponse = parseGeminiResponse(rawGemini);
    console.log(
      "🎯 Selected x field:",
      geminiResponse.xField ?? geminiResponse.xAxisKey
    );
    console.log(
      "🎯 Selected y field:",
      geminiResponse.yField ?? geminiResponse.yAxisKey
    );

    assertSafeSelect(geminiResponse.sql, tableName, fileName, userId);

    const { data, error } = await supabaseAdmin.rpc("execute_readonly_sql", {
      q: geminiResponse.sql,
    });
    if (error) throw new Error(error.message);
    console.log("📊 Query result:", data);

    const chartData = (data ?? []) as Record<string, unknown>[];
    const chartType = normalizeChartType(geminiResponse.chartType);
    const xAxisKey = geminiResponse.xAxisKey;
    const yAxisKey = geminiResponse.yAxisKey;

    const insight = generateInsight({
      chartData,
      xAxisKey,
      yAxisKey,
      chartType,
      title: geminiResponse.title ?? "",
    });
    console.log("🧠 Insight:", insight);

    const finalDescription = String(
      ImprovedQuery.description ?? geminiResponse.description ?? ""
    ).trim();
    const recommendedCharts = normalizedRecommendedCharts;

    return NextResponse.json({
      success: true,
      chartType,
      originalQuery: query,
      original_query: query,
      normalizedQuery,
      normalized_query: normalizedQuery,
      sql: geminiResponse.sql,
      title: geminiResponse.title ?? "",
      description: finalDescription,
      recommendedCharts,
      recommended_charts: recommendedCharts,
      chartData,
      xAxisKey,
      yAxisKey,
      insight,
    });
  } catch (error: unknown) {
    console.error("🔥 Generate chart error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Chart генерацлахад алдаа гарлаа",
      },
      { status: 500 }
    );
  }
}
