import type { UploadedFile } from "@/app/_components/editor/excel-upload";
import type { ChartSuggestion } from "../_components/editor/chart-suggestions/chart-types";

export function analyzeData(file: UploadedFile): ChartSuggestion[] {
  const suggestions: ChartSuggestion[] = [];
  const { columns, data } = file;

  if (data.length === 0 || columns.length === 0) return suggestions;

  const columnTypes: Record<string, "numeric" | "categorical" | "date"> = {};

  columns.forEach((col) => {
    const sampleValues = data.slice(0, 10).map((row) => row[col]);
    const numericCount = sampleValues.filter((v) => !isNaN(Number(v))).length;
    const dateCount = sampleValues.filter(
      (v) => !isNaN(Date.parse(String(v)))
    ).length;

    if (numericCount > 7) columnTypes[col] = "numeric";
    else if (dateCount > 7) columnTypes[col] = "date";
    else columnTypes[col] = "categorical";
  });

  const numericCols = columns.filter((c) => columnTypes[c] === "numeric");
  const categoricalCols = columns.filter(
    (c) => columnTypes[c] === "categorical"
  );
  const dateCols = columns.filter((c) => columnTypes[c] === "date");

  if (categoricalCols.length > 0 && numericCols.length > 0) {
    suggestions.push({
      type: "bar",
      title: "Bar Chart",
      reason: `Compare ${numericCols[0]} across different ${categoricalCols[0]} categories`,
      xAxis: categoricalCols[0],
      yAxis: numericCols[0],
      confidence: 0.92,
    });
  }

  if (dateCols.length > 0 && numericCols.length > 0) {
    suggestions.push({
      type: "line",
      title: "Line Chart",
      reason: `Track ${numericCols[0]} trends over time using ${dateCols[0]}`,
      xAxis: dateCols[0],
      yAxis: numericCols[0],
      confidence: 0.88,
    });
  } else if (columns.length >= 2) {
    suggestions.push({
      type: "line",
      title: "Line Chart",
      reason: `Show progression of ${numericCols[0] || columns[1]} over ${
        columns[0]
      }`,
      xAxis: columns[0],
      yAxis: numericCols[0] || columns[1],
      confidence: 0.75,
    });
  }

  if (numericCols.length > 0) {
    suggestions.push({
      type: "area",
      title: "Area Chart",
      reason: `Visualize cumulative ${numericCols[0]} with filled area`,
      xAxis: categoricalCols[0] || columns[0],
      yAxis: numericCols[0],
      confidence: 0.82,
    });
  }

  if (
    categoricalCols.length > 0 &&
    numericCols.length > 0 &&
    data.length <= 10
  ) {
    suggestions.push({
      type: "pie",
      title: "Pie Chart",
      reason: `Show proportion of ${numericCols[0]} by ${categoricalCols[0]}`,
      xAxis: categoricalCols[0],
      yAxis: numericCols[0],
      confidence: 0.85,
    });
  }

  if (numericCols.length >= 2) {
    suggestions.push({
      type: "scatter",
      title: "Scatter Plot",
      reason: `Explore correlation between ${numericCols[0]} and ${numericCols[1]}`,
      xAxis: numericCols[0],
      yAxis: numericCols[1],
      confidence: 0.78,
    });
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}
