"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartSuggestion } from "../../chart-suggestions";
import type { UploadedFile } from "../../excel-upload";

import { BarChartView } from "./bar-chart-view";
import { LineChartView } from "./line-chart-view";
import { AreaChartView } from "./area-chart-view";
import { PieChartView } from "./pie-chart-view";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function LiveChartRenderer({
  file,
  suggestion,
}: {
  file: UploadedFile;
  suggestion: ChartSuggestion;
}) {
  const chartData = file.data.slice(0, 50).map((row) => ({
    name: String(row[suggestion.xAxis!]),
    value: Number(row[suggestion.yAxis!]) || 0,
  }));

  const margin = { top: 20, right: 30, left: 20, bottom: 60 };

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
  } as const;

  const chart = (() => {
    switch (suggestion.type) {
      case "bar":
        return (
          <BarChartView
            data={chartData}
            colors={COLORS}
            tooltipStyle={tooltipStyle}
            margin={margin}
          />
        );

      case "line":
        return (
          <LineChartView
            data={chartData}
            color={COLORS[1]}
            tooltipStyle={tooltipStyle}
            margin={margin}
          />
        );

      case "area":
        return (
          <AreaChartView
            data={chartData}
            color={COLORS[2]}
            tooltipStyle={tooltipStyle}
            margin={margin}
          />
        );

      case "pie":
        return (
          <PieChartView
            data={chartData}
            colors={COLORS}
            tooltipStyle={tooltipStyle}
          />
        );

      case "scatter":
        // scatter-аа энэ файл дээрээ үлдээнэ
        return (
          <ScatterChart data={chartData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="value"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Scatter name="Data" data={chartData} fill={COLORS[4]} />
          </ScatterChart>
        );

      default:
        return null;
    }
  })();

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chart}
    </ResponsiveContainer>
  );
}
