// app/api/routes/generate-chart/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prepareDataContext } from "./utils/prepare-context";
import { createChartPrompt } from "./utils/create-prompt";
import { generateChartWithAI } from "./utils/huggingface-api";
import { parseChartConfig, validateChartConfig } from "./utils/validate-config";


export async function POST(req: Request) {
  console.log("🚀 /api/routes/generate-chart POST called");

  try {
    // ================= AUTH =================
    const { userId } = await auth();
    console.log("👤 Auth userId:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Нэвтрээгүй байна" }, { status: 401 });
    }

    // ================= BODY =================
    const { query, filesData } = await req.json();
    console.log("📝 Query:", query);
    console.log("📁 Files count:", filesData?.length);

    if (!query || !filesData || filesData.length === 0) {
      return NextResponse.json(
        { error: "Query болон файлын мэдээлэл шаардлагатай" },
        { status: 400 }
      );
    }

    // ================= ENV =================
    const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
    console.log("🔑 HF API KEY exists:", Boolean(HF_API_KEY));

    if (!HF_API_KEY) {
      return NextResponse.json(
        { error: "HUGGINGFACE_API_KEY тохируулаагүй байна" },
        { status: 500 }
      );
    }

    // ================= PREPARE DATA =================
    const dataContext = prepareDataContext(filesData);

    // ================= CREATE PROMPT =================
    const prompt = createChartPrompt(query, dataContext);

    console.log("🤖 Sending request to Hugging Face...");

    // ================= CALL AI =================
    const generatedText = await generateChartWithAI(prompt, HF_API_KEY);

    // ================= PARSE & VALIDATE =================
    let chartConfig = parseChartConfig(generatedText, filesData);
    console.log("✅ Parsed chart config:", chartConfig);

    chartConfig = validateChartConfig(chartConfig, filesData);
    console.log("✅ Final validated chartConfig:", chartConfig);

    return NextResponse.json({
      success: true,
      chartConfig,
      debug: {
        rawResponse: generatedText,
        filesAnalyzed: filesData.length,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("🔥 Generate chart error:", error);

    return NextResponse.json(
      {
        error: error.message ?? "Chart генерацлахад алдаа гарлаа",
        details: error.stack,
      },
      { status: 500 }
    );
  }
}