// app/api/routes/generate-chart/utils/parse-chart-config.ts
import type { FormattedFile } from "./fetch-files";

type ChartConfig = {
  chartType: string;
  xAxis: string;
  yAxis: string;
  title: string;
  description: string;
  fileIndex: number;
};

export function parseAndValidateChartConfig(
  generatedText: string,
  formattedFiles: FormattedFile[]
): ChartConfig {
  // Parse JSON
  const cleanedText = generatedText
    .trim()
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "");

  let chartConfig: ChartConfig;

  try {
    chartConfig = JSON.parse(cleanedText);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (parseError) {
    console.warn("⚠️ JSON parse failed, using fallback");
    chartConfig = {
      chartType: "bar",
      xAxis: formattedFiles[0].columns[0],
      yAxis: formattedFiles[0].columns[1] || formattedFiles[0].columns[0],
      title: `${formattedFiles[0].columns[0]} vs ${formattedFiles[0].columns[1]}`,
      description: "Автомат үүсгэсэн chart",
      fileIndex: 0,
    };
  }

  // Validate file index
  if (
    chartConfig.fileIndex < 0 ||
    chartConfig.fileIndex >= formattedFiles.length
  ) {
    chartConfig.fileIndex = 0;
  }

  const selectedFile = formattedFiles[chartConfig.fileIndex];

  // Validate columns
  if (!selectedFile.columns.includes(chartConfig.xAxis)) {
    console.warn(`⚠️ xAxis "${chartConfig.xAxis}" not found, using fallback`);
    chartConfig.xAxis = selectedFile.columns[0];
  }

  if (!selectedFile.columns.includes(chartConfig.yAxis)) {
    console.warn(`⚠️ yAxis "${chartConfig.yAxis}" not found, using fallback`);
    chartConfig.yAxis = selectedFile.columns[1] || selectedFile.columns[0];
  }

  console.log("✅ Final chart config:", chartConfig);

  return chartConfig;
}