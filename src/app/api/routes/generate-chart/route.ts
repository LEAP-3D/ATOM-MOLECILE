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
function assertSafeSelect(
  sql: string,
  tableName: string,
  _fileName: string,
  _userId: string
) {
  const s = sql.trim().toLowerCase();
  if (!/^(select|with)\b/.test(s))
    throw new Error("Only SELECT/WITH SELECT allowed");
  if (!/\bselect\b/.test(s)) throw new Error("Only SELECT queries allowed");
  if (
    /(insert|update|delete|drop|alter|create|truncate|grant|revoke)\b/.test(s)
  )
    throw new Error("Unsafe SQL detected");
  if (s.includes(";") || s.includes("--") || s.includes("/*"))
    throw new Error("Multi-statement/comments not allowed");
  const fromRe = new RegExp(`\\bfrom\\s+${tableName}\\b`, "i");
  if (!fromRe.test(sql)) throw new Error(`SQL must query FROM ${tableName}`);
  const fileRe = /where[\s\S]*file_name/i;
  if (!fileRe.test(sql)) throw new Error(`SQL must filter by file_name`);
  const userRe = /where[\s\S]*user_id/i;
  if (!userRe.test(sql)) throw new Error(`SQL must filter by user_id`);
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
      ImprovedQuery.normalized_query,
      columns,
      fileName,
      userId
    );
    console.log("✨ Gemini raw:", rawGemini);
    const geminiResponse = (await JSON.parse(rawGemini)) as GeminiResponseType;
    assertSafeSelect(geminiResponse.sql, tableName, fileName, userId);
    const { data, error } = await supabaseAdmin.rpc("execute_readonly_sql", {
      q: geminiResponse.sql,
    });
    if (error) throw new Error(error.message);
    console.log("📊 Query result:", data);
    const insight = generateInsight({
      chartData: (data ?? []) as Record<string, unknown>[],
      xAxisKey: geminiResponse.xAxisKey,
      yAxisKey: geminiResponse.yAxisKey,
      chartType: normalizeChartType(geminiResponse.chartType),
      title: geminiResponse.title ?? "",
    });
    console.log("🧠 Insight:", insight);
    return NextResponse.json({
      success: true,
      chartType: normalizeChartType(geminiResponse.chartType),
      title: geminiResponse.title ?? "",
      description:
        ImprovedQuery.description ?? geminiResponse.description ?? "",
      recommendedCharts: normalizedRecommendedCharts,
      recommended_charts: normalizedRecommendedCharts,
      chartData: data ?? [],
      xAxisKey: geminiResponse.xAxisKey,
      yAxisKey: geminiResponse.yAxisKey,
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
