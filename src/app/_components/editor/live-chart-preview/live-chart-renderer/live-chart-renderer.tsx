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

type ChartData = { name: string; value: number };
type ScatterData = { x: number; y: number; name: string };

export function LiveChartRenderer({
  file,
  suggestion,
}: {
  file: UploadedFile;
  suggestion: ChartSuggestion;
}) {
  if (!suggestion.xAxis || !suggestion.yAxis) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Тэнхлэгийн мэдээлэл дутуу байна
      </div>
    );
  }

  const margin = { top: 20, right: 30, left: 20, bottom: 60 };

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
  } as const;

  // Scatter-д зориулсан тусдаа data
  if (suggestion.type === "scatter") {
    const scatterData: ScatterData[] = file.data
      .slice(0, 50)
      .map((row) => ({
        x: Number(row[suggestion.xAxis!]) || 0,
        y: Number(row[suggestion.yAxis!]) || 0,
        name: String(row[suggestion.xAxis!]),
      }));

    return (
      <div className="w-full h-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              dataKey="x"
              name={suggestion.xAxis}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={suggestion.yAxis}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ strokeDasharray: "3 3" }}
            />
            <Scatter
              name={suggestion.title || "Өгөгдөл"}
              data={scatterData}
              fill={COLORS[4]}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Бусад chart-уудад зориулсан data
  const chartData: ChartData[] = file.data
    .slice(0, 50)
    .map((row) => ({
      name: String(row[suggestion.xAxis!]),
      value: Number(row[suggestion.yAxis!]) || 0,
    }));

  const renderChart = () => {
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

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Дэмжигдээгүй график төрөл: {suggestion.type}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}