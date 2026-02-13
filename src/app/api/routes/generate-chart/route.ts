// app/api/routes/generate-chart/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// import { parseChartConfig, validateChartConfig } from "./utils/validate-config";
import { refineChartSqlWithGemini } from "./utils/gemini-refiner";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

type GeminiResponseType = {
  chartType: string;
  sql: string;
  title?: string;
  description?: string;
  xAxisKey: string; // Нэмэх
  yAxisKey: string;
};

type FileData = {
  name: string;
  columns: string[];
  data: Record<string, unknown>[];
};

function assertSafeSelect(
  sql: string,
  tableName: string,
  _fileName: string,
  _userId: string
) {
  const s = sql.trim().toLowerCase();
  if (!s.startsWith("select")) throw new Error("Only SELECT allowed");
  if (
    /(insert|update|delete|drop|alter|create|truncate|grant|revoke)\b/.test(s)
  )
    throw new Error("Unsafe SQL detected");
  if (s.includes(";") || s.includes("--") || s.includes("/*"))
    throw new Error("Multi-statement/comments not allowed");

  const fromRe = new RegExp(`\\bfrom\\s+${tableName}\\b`, "i");
  if (!fromRe.test(sql)) throw new Error(`SQL must query FROM ${tableName}`);

  // ✅ заавал тухайн файл дээр filter хийх
  const fileRe = /where[\s\S]*file_name/i;
  if (!fileRe.test(sql)) throw new Error(`SQL must filter by file_name`);

  // ✅ заавал тухайн user дээр filter хийх (илүү safe)
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

    // // ✅ Gemini-д fileName + userId-г өгч, SQL-д WHERE filter force хийнэ
    const rawGemini = await refineChartSqlWithGemini(
      tableName,
      query,
      columns,
      fileName,
      userId
    );
    console.log("✨ Gemini raw:", rawGemini);

    const geminiResponse = (await JSON.parse(rawGemini)) as GeminiResponseType;

    assertSafeSelect(geminiResponse.sql, tableName, fileName, userId);
    console.log("geminiResponse", geminiResponse.sql);
    // console.log("✅ Gemini SQL", geminiResponse.sql);
    const { data, error } = await supabaseAdmin.rpc("execute_readonly_sql", {
      q: geminiResponse.sql,
    });
    if (error) throw new Error(error.message);
    console.log("📊 Query result:", data);
    return NextResponse.json({
      success: true,
      chartType: geminiResponse.chartType,
      title: geminiResponse.title ?? "",
      description: geminiResponse.description ?? "",
      chartData: data ?? [],
      xAxisKey: geminiResponse.xAxisKey,
      yAxisKey: geminiResponse.yAxisKey,
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
