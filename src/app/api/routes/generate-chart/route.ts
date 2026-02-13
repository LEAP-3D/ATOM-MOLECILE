// app/api/routes/generate-chart/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createQueryEmbedding } from "./utils/query-embedding";
import { searchPinecone } from "./utils/pinecone-search";
import { fetchFilesFromSupabase } from "./utils/fetch-files";
import { prepareDataContext } from "./utils/prepare-data-context";
import { createGrokPrompt } from "./utils/create-grok-prompt";
import { callGroqAPI } from "./utils/call-groq-api"; // ⭐ ЭНЭ
import { parseAndValidateChartConfig } from "./utils/parse-chart-config";

export async function POST(req: Request) {
  console.log("🚀 /api/routes/generate-chart POST - RAG Flow");

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Нэвтрээгүй байна" },
        { status: 401 }
      );
    }

    const { query } = await req.json();
    console.log("📝 User query:", query);

    if (!query) {
      return NextResponse.json(
        { error: "Query шаардлагатай" },
        { status: 400 }
      );
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY; // ⭐ ЭНЭ
    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
    const PINECONE_INDEX_HOST = process.env.PINECONE_INDEX_HOST;

    if (!GROQ_API_KEY || !PINECONE_API_KEY || !PINECONE_INDEX_HOST) {
      return NextResponse.json(
        { error: "API keys тохируулаагүй байна" },
        { status: 500 }
      );
    }

    const queryEmbedding = await createQueryEmbedding(query);
    const fileIds = await searchPinecone(
      queryEmbedding,
      userId,
      PINECONE_API_KEY,
      PINECONE_INDEX_HOST
    );
    const formattedFiles = await fetchFilesFromSupabase(fileIds, userId);
    const dataContext = prepareDataContext(query, formattedFiles);
    const prompt = createGrokPrompt(dataContext);

    const generatedText = await callGroqAPI(prompt, GROQ_API_KEY); // ⭐ ЭНЭ

    const chartConfig = parseAndValidateChartConfig(
      generatedText,
      formattedFiles
    );

    return NextResponse.json({
      success: true,
      chartConfig,
      filesData: formattedFiles,
      debug: {
        query,
        pineconeMatches: fileIds.size,
        filesFound: formattedFiles.length,
        selectedFile: formattedFiles[chartConfig.fileIndex].name,
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