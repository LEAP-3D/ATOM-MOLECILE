// app/api/routes/search/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getHashEmbedding } from "@/lib/embeddings.simple";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Нэвтрээгүй байна" }, { status: 401 });
    }

    const { query, fileId, topK = 5 } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Хайлтын текст оруулна уу" },
        { status: 400 }
      );
    }

    const queryEmbedding = getHashEmbedding(query);

    const apiKey = process.env.PINECONE_API_KEY;
    const indexHost = process.env.PINECONE_INDEX_HOST;

    if (!apiKey || !indexHost) {
      throw new Error("Pinecone тохиргоо дутуу байна");
    }

    // Direct HTTP API ашиглан хайлт хийх
    const filterObj = fileId
      ? { fileId: { $eq: fileId } }
      : { userId: { $eq: userId } };

    const response = await fetch(`https://${indexHost}/query`, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        vector: queryEmbedding,
        topK: topK,
        includeMetadata: true,
        filter: filterObj,
        namespace: "",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Pinecone хайлт алдаа: ${response.status} - ${errorText}`
      );
    }

    const searchResults = await response.json();

    const results =
      searchResults.matches?.map(
        (match: { score: number; metadata?: Record<string, unknown> }) => ({
          score: match.score,
          text: match.metadata?.text,
          rowIndex: match.metadata?.rowIndex,
          fileId: match.metadata?.fileId,
          data: match.metadata,
        })
      ) || [];

    return NextResponse.json({
      success: true,
      query,
      results,
    });
  } catch (error) {
    console.error("❌ Хайлт хийх алдаа:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Хайлт хийх үед алдаа гарлаа";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
