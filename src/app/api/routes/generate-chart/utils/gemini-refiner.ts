import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function refineChartSqlWithGemini(
  tableName: string,
  ImprovedQuery: string,
  columns: string[],
  fileName: string,
  userId: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0,
    },
  });

  const safeFile = fileName.replace(/'/g, "''");
  const safeUser = userId.replace(/'/g, "''");
  console.log("ImprovedQuery from refiner", ImprovedQuery);
  const prompt = `
You are an SQL aggregation assistant for PostgreSQL.

User request: "${ImprovedQuery}"

Database table: ${tableName}

IMPORTANT DATA MODEL (READ CAREFULLY):
- ${tableName} has ONE ROW per uploaded file.
- The JSONB column "content" contains an ARRAY of objects (records) from the Excel file.
- Therefore you MUST expand the array using:
  FROM ${tableName} uf
  CROSS JOIN LATERAL jsonb_array_elements(uf.content) AS elem
- You MUST read fields from elem, not from uf.content:
  elem->>'field'

Available JSON keys inside elem:
${columns.join(", ")}

CRITICAL RULES:
1) Query ONLY from: ${tableName}
2) You MUST include this filter EXACTLY (do not change values):
   AND uf.file_name = '${safeFile}'
   AND uf.user_id = '${safeUser}'
3) You MUST read fields via:
   elem->>'field'
4) Numeric aggregation MUST cast safely:
   NULLIF(elem->>'field','')::numeric
5) Output must be a SINGLE SELECT statement (no semicolons, no comments).
6) Do NOT invent keys, tables, or columns.

OUTPUT SHAPE RULES (chart-ready):
- SQL must return exactly 2 columns.
- The first column should be the grouping category. Use a descriptive name from the available keys (e.g., "gender", "category", "department") AS the column alias.
- The second column should be the numeric value. Use a descriptive name (e.g., "count", "total_sales", "average_age") AS the column alias.
- Example: SELECT elem->>'gender' AS gender, COUNT(*) AS count

- Do NOT use generic "name" and "value" labels if more descriptive keys are available in: ${columns.join(
    ", "
  )}
- GROUP BY expression MUST match the first column expression exactly.
- Add ORDER BY [the first column alias]

Return ONLY valid JSON (no markdown):
{
  "chartType": "bar" | "line" | "area" | "pie" | "scatter",
  "sql": "SELECT ...",
  "title": "string",
  "description": "string",
  "xAxisKey": "the_first_column_alias",
  "yAxisKey": "the_second_column_alias"
}
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
