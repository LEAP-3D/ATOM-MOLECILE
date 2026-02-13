// app/api/routes/generate-chart/utils/query-embedding.ts
import { getHashEmbedding } from "@/lib/embeddings.simple";

export async function createQueryEmbedding(query: string): Promise<number[]> {
  console.log("🧠 Generating query embedding...");
  
  // Groq-оор normalize хийх
  const normalizedQuery = await normalizeWithGroq(query);
  const queryEmbedding = getHashEmbedding(normalizedQuery);

  if (!queryEmbedding || queryEmbedding.length !== 384) {
    throw new Error("Query embedding үүсгэхэд алдаа гарлаа");
  }

  return queryEmbedding;
}

async function normalizeWithGroq(query: string): Promise<string> {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    return query;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Normalize query for search. Extract keywords only. Standardize Mongolian spelling. Return 3-7 keywords separated by spaces."
          },
          { role: "user", content: query }
        ],
        temperature: 0.1,
        max_tokens: 30,
      }),
    });

    if (!response.ok) return query;

    const result = await response.json();
    const normalized = result.choices?.[0]?.message?.content?.trim() || query;
    
    console.log("🔄", query, "→", normalized);
    return normalized;

  } catch (error) {
    console.error("❌ Normalization алдаа:", error);
    return query;
  }
}
