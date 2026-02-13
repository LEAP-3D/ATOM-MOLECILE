// app/api/routes/generate-chart/utils/pinecone-search.ts

/* eslint-disable @typescript-eslint/no-explicit-any */

type PineconeMatch = {
  metadata?: {
    fileId?: string;
    [key: string]: any;
  };
  score?: number;
};

type PineconeSearchResult = {
  matches?: PineconeMatch[];
};

export async function searchPinecone(
  queryEmbedding: number[],
  userId: string,
  apiKey: string,
  indexHost: string
): Promise<Set<string>> {
  console.log("🔍 Searching Pinecone for relevant data...");

  const response = await fetch(`https://${indexHost}/query`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vector: queryEmbedding,
      topK: 50,
      includeMetadata: true,
      filter: {
        userId: { $eq: userId },
      },
      namespace: "",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinecone search алдаа: ${errorText}`);
  }

  const result: PineconeSearchResult = await response.json();
  console.log("✅ Pinecone matches:", result.matches?.length || 0);

  if (!result.matches || result.matches.length === 0) {
    throw new Error("Холбоотой өгөгдөл олдсонгүй. Өөр файл upload хийнэ үү.");
  }

  const fileIds = new Set<string>();

  result.matches.forEach((match) => {
    if (match.metadata?.fileId) {
      fileIds.add(match.metadata.fileId);
    }
  });

  console.log("📁 Found file IDs:", Array.from(fileIds));

  if (fileIds.size === 0) {
    throw new Error("Файлын мэдээлэл олдсонгүй");
  }

  return fileIds;
}