import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_PROMPT!);

type PromptImproverResponse = {
  normalized_query: string;
  description: string;
  recommended_charts: Array<{
    type?: "bar" | "pie" | "line" | "area" | "scatter";
    chart_type?: "bar" | "pie" | "line" | "area" | "scatter";
    chartType?: "bar" | "pie" | "line" | "area" | "scatter";
    confidence: number;
  }>;
};

const DEFAULT_RECOMMENDED_CHARTS: PromptImproverResponse["recommended_charts"] = [
  { type: "bar", confidence: 0.9 },
  { type: "pie", confidence: 0.7 },
  { type: "line", confidence: 0.4 },
  { type: "area", confidence: 0.3 },
  { type: "scatter", confidence: 0.2 },
];

function tryParseJsonObject(text: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(text) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function extractJsonObjectCandidate(input: string): string | null {
  const start = input.indexOf("{");
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < input.length; i += 1) {
    const ch = input[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (ch === "\"") {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return input.slice(start, i + 1);
      }
    }
  }
  return null;
}

function parsePromptImproverJson(text: string): Record<string, unknown> | null {
  const raw = text.trim();
  const attempts: string[] = [raw];

  // ```json ... ```
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenceMatch?.[1]) {
    attempts.push(fenceMatch[1].trim());
  }

  const extracted = extractJsonObjectCandidate(raw);
  if (extracted) {
    attempts.push(extracted);
  }

  for (const candidate of attempts) {
    const direct = tryParseJsonObject(candidate);
    if (direct) return direct;

    const normalizedQuotes = candidate
      .replace(/[\u201C\u201D]/g, "\"")
      .replace(/[\u2018\u2019]/g, "'");
    const cleaned = normalizedQuotes.replace(/,\s*([}\]])/g, "$1");
    const repaired = tryParseJsonObject(cleaned);
    if (repaired) return repaired;
  }

  return null;
}

function normalizeImproverResponse(
  parsed: Record<string, unknown> | null,
  query: string
): PromptImproverResponse {
  const normalizedQuery = String(parsed?.normalized_query ?? query).trim();
  const description = String(parsed?.description ?? "").trim();
  const chartsRaw = parsed?.recommended_charts;

  const recommendedCharts = Array.isArray(chartsRaw)
    ? chartsRaw.map((item) => {
        const entry = (item ?? {}) as {
          type?: unknown;
          chart_type?: unknown;
          chartType?: unknown;
          confidence?: unknown;
        };
        const confidenceRaw =
          typeof entry.confidence === "number"
            ? entry.confidence
            : Number(entry.confidence);
        const confidence = Number.isFinite(confidenceRaw)
          ? Math.max(0, Math.min(1, confidenceRaw))
          : 0;
        return {
          type:
            (entry.type as
              | "bar"
              | "pie"
              | "line"
              | "area"
              | "scatter"
              | undefined) ?? undefined,
          chart_type:
            (entry.chart_type as
              | "bar"
              | "pie"
              | "line"
              | "area"
              | "scatter"
              | undefined) ?? undefined,
          chartType:
            (entry.chartType as
              | "bar"
              | "pie"
              | "line"
              | "area"
              | "scatter"
              | undefined) ?? undefined,
          confidence,
        };
      })
    : DEFAULT_RECOMMENDED_CHARTS;

  return {
    normalized_query: normalizedQuery || query,
    description,
    recommended_charts: recommendedCharts,
  };
}

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
3) description must be in Mongolian, friendly and natural, 1-2 sentences. It should explain what the chart will show and why the top recommended chart types are suitable.
4) recommended_charts must include exactly 5 items in this order: bar, pie, line, area, scatter
5) confidence is a number between 0 and 1.
6) If the request is not time-based, line/area should have low confidence.
7) Never add extra keys. Never add markdown.
`;

  const res = await model.generateContent(improverPrompt);

  const jsonText = res.response.text();
  const parsed = parsePromptImproverJson(jsonText);
  if (!parsed) {
    console.warn("Prompt improver returned non-JSON text; falling back", {
      preview: jsonText.slice(0, 240),
    });
  }
  return normalizeImproverResponse(parsed, query);
}
