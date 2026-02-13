import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type PromptImproverResponse = {
  normalized_query: string;
  description: string;
  recommended_charts: Array<{
    type: "bar" | "pie" | "line" | "area" | "scatter";
    confidence: number; // 0..1
  }>;
};

export async function improveUserPromptWithGemini(
  query: string
): Promise<PromptImproverResponse> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0,
    },
  });

  const improverPrompt = `
You are a "Prompt Improver" for a PostgreSQL SQL aggregation assistant.

User request: ${JSON.stringify(query)}

Goal:
Rewrite the user's request (Mongolian/English/mixed) into a clear, concise analytics request.
Return ONLY valid JSON with EXACTLY these keys:
- normalized_query
- description
- recommended_charts

Rules:
1) Do NOT output SQL.
2) Keep normalized_query short and clear (prefer English).
3) description must be in English, friendly, 1-2 sentences, explain what chart will show and why top chart types fit.
4) recommended_charts must include exactly 5 items in this order: bar, pie, line, area, scatter
5) confidence is a number between 0 and 1.
6) If the request is not time-based, line/area should have low confidence.
7) Never add extra keys. Never add markdown.
`;

  const res = await model.generateContent(improverPrompt);

  const jsonText = res.response.text();

  return JSON.parse(jsonText) as PromptImproverResponse;
}
