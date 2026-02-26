import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

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

  const safeFile = escapeSqlLiteral(fileName);
  const safeUser = escapeSqlLiteral(userId);
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

Additionally return:
- "aggregationType": one of "count" | "sum" | "avg" | "distribution" | "trend"
- "analysisHint": short English phrase describing what kind of insight should be generated

Return ONLY valid JSON (no markdown):
{
  "chartType": "bar" | "line" | "area" | "pie" | "scatter",
  "sql": "SELECT ...",
  "title": "string",
  "description": "string",
  "xAxisKey": "the_first_column_alias",
  "yAxisKey": "the_second_column_alias",
  "aggregationType": "distribution",
  "analysisHint": "Compare distribution balance and dominant category"
}
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function refineChartSqlWithGeminiTwoFiles(
  tableName: string,
  improvedQuery: string,
  files: {
    fileAName: string;
    columnsA: string[];
    fileBName: string;
    columnsB: string[];
  },
  userId: string,
  joinKey: string | null
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0,
    },
  });

  const safeA = escapeSqlLiteral(files.fileAName);
  const safeB = escapeSqlLiteral(files.fileBName);
  const safeUser = escapeSqlLiteral(userId);

  const joinInstruction = joinKey
    ? `You MUST join by key:
  a->>'${joinKey}' = b->>'${joinKey}'`
    : `No shared key exists. Use cross join style pairing only (JOIN ... ON true).
Set description to include a clear warning that correlation may be meaningless.`;

  const prompt = `
You are an SQL assistant for two-file correlation analysis in PostgreSQL.

User request: "${improvedQuery}"

Database table: ${tableName}

CRITICAL DATA MODEL:
- ${tableName} has one row per uploaded file.
- Each file's records live in JSONB array column: content.
- For two files, expand both arrays:
  FROM ${tableName} uf1
  CROSS JOIN LATERAL jsonb_array_elements(uf1.content) AS a
  JOIN ${tableName} uf2 ON true
  CROSS JOIN LATERAL jsonb_array_elements(uf2.content) AS b

File A name: ${files.fileAName}
File A columns: ${files.columnsA.join(", ")}
File B name: ${files.fileBName}
File B columns: ${files.columnsB.join(", ")}

MANDATORY FILTERS (exact values required):
- uf1.file_name = '${safeA}'
- uf2.file_name = '${safeB}'
- uf1.user_id = '${safeUser}'
- uf2.user_id = '${safeUser}'

MANDATORY JOIN RULE:
${joinInstruction}

MANDATORY OUTPUT SQL RULES:
1) Return ONE SELECT/WITH query only. No comments, no semicolons.
2) Use ONLY ${tableName} (self-join allowed).
3) Return exactly TWO numeric columns with exact aliases:
   NULLIF(a->>'<xField>','')::numeric AS x,
   NULLIF(b->>'<yField>','')::numeric AS y
4) Exclude null numeric rows in WHERE (x and y source fields must be non-empty).
5) Prefer numeric columns that best match user intent.

Return ONLY valid JSON with EXACTLY these keys:
{
  "chartType": "scatter",
  "sql": "SELECT ...",
  "title": "string",
  "description": "string",
  "xAxisKey": "x",
  "yAxisKey": "y",
  "aggregationType": "correlation",
  "analysisHint": "short phrase"
}
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
