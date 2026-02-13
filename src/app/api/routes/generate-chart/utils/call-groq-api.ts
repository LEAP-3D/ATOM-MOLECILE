// app/api/routes/generate-chart/utils/call-groq-api.ts

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function callGroqAPI(
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log("🤖 Calling Groq AI for chart generation...");

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a data visualization expert. Respond ONLY with valid JSON. No markdown, no explanations.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API алдаа: ${errorText}`);
  }

  const result = await response.json();
  const generatedText = result.choices?.[0]?.message?.content ?? "";

  console.log("📝 Groq raw response:", generatedText);

  return generatedText;
}