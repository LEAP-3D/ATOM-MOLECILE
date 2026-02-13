// app/api/routes/generate-chart/utils/validate-config.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseChartConfig(generatedText: string, filesData: any[]) {
  try {
    let cleanedText = generatedText.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, "");
    cleanedText = cleanedText.replace(/```\n?/g, "");
    cleanedText = cleanedText.trim();

    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.warn("⚠️ JSON parse failed:", parseError);
    console.warn("Raw text:", generatedText);

    const firstFile = filesData[0];
    return {
      chartType: "bar",
      xAxis: firstFile.columns[0],
      yAxis: firstFile.columns[1] || firstFile.columns[0],
      title: `${firstFile.columns[0]} vs ${firstFile.columns[1] || firstFile.columns[0]}`,
      description: "Автомат үүсгэсэн chart (AI parse амжилтгүй)",
      fileIndex: 0,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateChartConfig(chartConfig: any, filesData: any[]) {
  const fileIndex = chartConfig.fileIndex ?? 0;
  const selectedFile = filesData[fileIndex];

  if (!selectedFile) {
    console.error("❌ Invalid fileIndex:", fileIndex);
    chartConfig.fileIndex = 0;
  }

  const validFile = filesData[chartConfig.fileIndex];

  if (!validFile.columns.includes(chartConfig.xAxis)) {
    console.warn(`⚠️ xAxis "${chartConfig.xAxis}" not found. Using first column.`);
    chartConfig.xAxis = validFile.columns[0];
  }

  if (!validFile.columns.includes(chartConfig.yAxis)) {
    console.warn(`⚠️ yAxis "${chartConfig.yAxis}" not found. Using second column.`);
    chartConfig.yAxis = validFile.columns[1] || validFile.columns[0];
  }

  const validTypes = ["bar", "line", "pie", "area", "scatter"];
  if (!validTypes.includes(chartConfig.chartType)) {
    console.warn(`⚠️ Invalid chart type: ${chartConfig.chartType}`);
    chartConfig.chartType = "bar";
  }

  return chartConfig;
}