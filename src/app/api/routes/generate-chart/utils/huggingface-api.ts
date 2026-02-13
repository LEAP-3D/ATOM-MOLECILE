// app/api/routes/generate-chart/utils/huggingface-api.ts

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

export async function generateChartWithAI(
  prompt: string,
  apiKey: string
): Promise<string> {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        {
          role: "system",
          content:
            "You are a data visualization expert. Respond ONLY with valid JSON. No markdown, no explanations, ONLY the JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 600,
    }),
  });

  console.log("📡 HF response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ HF API error:", errorText);
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const result = await response.json();
  console.log("✅ HF response:", JSON.stringify(result, null, 2));
  console.log("responseeeeeeeeee", response);
  const generatedText = result.choices?.[0]?.message?.content ?? "";
  console.log("📝 Generated text:", generatedText);

  return generatedText;
}
