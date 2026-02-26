import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  refineChartSqlWithGemini,
  refineChartSqlWithGeminiTwoFiles,
} from "./utils/gemini-refiner";
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

const CORRELATION_HINT_RE =
  /(correlation|correlat|relationship|relation|relate|хамаарал|хамаатай|харьцаа|холбоо)/i;

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

function stripMarkdownFence(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function parseGeminiResponse(raw: string): GeminiResponseType {
  return JSON.parse(stripMarkdownFence(raw)) as GeminiResponseType;
}

function shouldUseCorrelationMode(query: string, filesCount: number): boolean {
  return filesCount >= 2 || CORRELATION_HINT_RE.test(query);
}

export function detectJoinKey(columnsA: string[], columnsB: string[]): string | null {
  const bSet = new Set(columnsB);
  const overlap = columnsA.filter((col) => bSet.has(col));
  if (overlap.length === 0) return null;

  const priorityExact = [
    "id",
    "ID",
    "Id",
    "name",
    "Name",
    "date",
    "Date",
    "code",
    "Code",
    "email",
    "Email",
    "огноо",
    "код",
    "нэр",
    "имэйл",
  ];
  const priorityIndex = new Map(priorityExact.map((key, idx) => [key, idx]));

  const normalized = (v: string) =>
    v.toLowerCase().replace(/[\s_-]/g, "").trim();
  const score = (key: string) => {
    const norm = normalized(key);
    if (priorityIndex.has(key)) return 1000 - (priorityIndex.get(key) ?? 999);
    if (norm === "id" || norm.endsWith("id")) return 900;
    if (
      norm.includes("name") ||
      norm.includes("date") ||
      norm.includes("code") ||
      norm.includes("email") ||
      norm.includes("нэр") ||
      norm.includes("огноо") ||
      norm.includes("код") ||
      norm.includes("имэйл")
    ) {
      return 700;
    }
    return 100;
  };

  const sorted = [...overlap].sort((a, b) => {
    const diff = score(b) - score(a);
    if (diff !== 0) return diff;
    return a.localeCompare(b);
  });
  return sorted[0] ?? null;
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
  const fileRe = new RegExp(`\\buf\\.file_name\\s*=\\s*'${safeFile}'`, "i");
  const userRe = new RegExp(`\\buf\\.user_id\\s*=\\s*'${safeUser}'`, "i");
  if (!fileRe.test(sql)) throw new Error("SQL must filter by uf.file_name");
  if (!userRe.test(sql)) throw new Error("SQL must filter by uf.user_id");
}

export function assertSafeSelectTwoFiles(
  sql: string,
  tableName: string,
  fileAName: string,
  fileBName: string,
  userId: string
) {
  assertSafeSqlBase(sql, tableName);

  const normalizedSql = sql
    .replace(/"/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  const safeA = escapeSqlLiteral(fileAName).toLowerCase();
  const safeB = escapeSqlLiteral(fileBName).toLowerCase();
  const safeUser = escapeSqlLiteral(userId).toLowerCase();

  const hasUf1File =
    normalizedSql.includes(`uf1.file_name = '${safeA}'`) ||
    normalizedSql.includes(`'${safeA}' = uf1.file_name`);
  const hasUf2File =
    normalizedSql.includes(`uf2.file_name = '${safeB}'`) ||
    normalizedSql.includes(`'${safeB}' = uf2.file_name`);
  const hasUf1User =
    normalizedSql.includes(`uf1.user_id = '${safeUser}'`) ||
    normalizedSql.includes(`'${safeUser}' = uf1.user_id`);
  const hasUf2User =
    normalizedSql.includes(`uf2.user_id = '${safeUser}'`) ||
    normalizedSql.includes(`'${safeUser}' = uf2.user_id`);

  const hasArrayUf1 = /\bjsonb_array_elements\s*\(\s*uf1\.content\s*\)/i.test(
    normalizedSql
  );
  const hasArrayUf2 = /\bjsonb_array_elements\s*\(\s*uf2\.content\s*\)/i.test(
    normalizedSql
  );

  const hasDirectAliases =
    /\bas\s+x\b/i.test(normalizedSql) && /\bas\s+y\b/i.test(normalizedSql);
  const hasFinalSelectXY =
    /\bselect\b[\s\S]*\bx\s*,\s*y\b/i.test(normalizedSql) ||
    /\bselect\b[\s\S]*\by\s*,\s*x\b/i.test(normalizedSql);

  if (
    !hasUf1File ||
    !hasUf2File ||
    !hasUf1User ||
    !hasUf2User ||
    !hasArrayUf1 ||
    !hasArrayUf2 ||
    (!hasDirectAliases && !hasFinalSelectXY)
  ) {
    throw new Error(
      "2-file SQL must include uf1/uf2 file_name + user_id filters and x/y aliases"
    );
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

    const correlationMode = shouldUseCorrelationMode(query, filesData.length);
    if (correlationMode && filesData.length < 2) {
      return NextResponse.json(
        {
          error:
            "2-file correlation chart-д 2 файл сонгоно уу (хамаарал/корреляци хүсэлт илэрсэн).",
        },
        { status: 422 }
      );
    }

    const file0 = filesData[0];
    const [fileA, fileB] = filesData;
    const tableName = "uploaded_files";
    const fileName = file0?.name ?? "Unknown file";
    const columns = file0?.columns ?? [];
    const fileAName = fileA?.name ?? "Unknown file A";
    const fileBName = fileB?.name ?? "Unknown file B";
    const columnsA = fileA?.columns ?? [];
    const columnsB = fileB?.columns ?? [];
    const joinKey =
      correlationMode && fileA && fileB
        ? detectJoinKey(columnsA, columnsB)
        : null;

    console.log("📝 Query:", query);
    if (correlationMode) {
      console.log("📁 File A:", fileAName);
      console.log("📁 File B:", fileBName);
      console.log("🔗 Join key:", joinKey ?? "(none, cross join)");
    } else {
      console.log("📁 File name:", fileName);
      console.log("📁 Columns:", columns);
    }

    if (!correlationMode && !columns.length) {
      return NextResponse.json(
        { error: "Файлын column мэдээлэл хоосон байна" },
        { status: 400 }
      );
    }
    if (
      correlationMode &&
      (!columnsA.length || !columnsB.length || !fileA || !fileB)
    ) {
      return NextResponse.json(
        { error: "2-file mode-д хоёр файлын column мэдээлэл шаардлагатай" },
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

    const rawGemini = correlationMode
      ? await refineChartSqlWithGeminiTwoFiles(
          tableName,
          normalizedQuery,
          { fileAName, columnsA, fileBName, columnsB },
          userId,
          joinKey
        )
      : await refineChartSqlWithGemini(
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

    if (correlationMode) {
      assertSafeSelectTwoFiles(
        geminiResponse.sql,
        tableName,
        fileAName,
        fileBName,
        userId
      );
    } else {
      assertSafeSelect(geminiResponse.sql, tableName, fileName, userId);
    }

    const { data, error } = await supabaseAdmin.rpc("execute_readonly_sql", {
      q: geminiResponse.sql,
    });
    if (error) throw new Error(error.message);
    console.log("📊 Query result:", data);

    const chartData = correlationMode
      ? ((data ?? []) as Record<string, unknown>[])
          .map((row) => {
            const x = Number(row.x);
            const y = Number(row.y);
            return { x, y };
          })
          .filter((row) => Number.isFinite(row.x) && Number.isFinite(row.y))
      : ((data ?? []) as Record<string, unknown>[]);

    const chartType = correlationMode
      ? "scatter"
      : normalizeChartType(geminiResponse.chartType);
    const xAxisKey = correlationMode ? "x" : geminiResponse.xAxisKey;
    const yAxisKey = correlationMode ? "y" : geminiResponse.yAxisKey;

    const insight = generateInsight({
      chartData,
      xAxisKey,
      yAxisKey,
      chartType,
      title: geminiResponse.title ?? "",
    });
    console.log("🧠 Insight:", insight);

    const fallbackDescription = correlationMode
      ? "Хоёр файлын тоон багануудын хоорондын хамаарлыг scatter chart-аар харууллаа."
      : "";
    const joinWarning =
      correlationMode && !joinKey
        ? "Анхааруулга: Нийтлэг join key олдоогүй тул cross join ашигласан. Энэ корреляци статистикийн хувьд утгагүй байж болно."
        : "";
    const finalDescription = [
      String(
        ImprovedQuery.description ??
          geminiResponse.description ??
          fallbackDescription
      ).trim(),
      joinWarning,
    ]
      .filter(Boolean)
      .join(" ");

    const recommendedCharts = correlationMode
      ? [{ chartType: "scatter" as const, confidence: 1 }]
      : normalizedRecommendedCharts;

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
