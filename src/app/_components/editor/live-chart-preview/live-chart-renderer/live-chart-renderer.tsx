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
import type { ChartType } from "../../chart-suggestions/chart-types";
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
  chartType,
  chartData: sourceChartData,
  xAxisKey,
  yAxisKey,
}: {
  chartType: ChartType;
  chartData: Record<string, unknown>[];
  xAxisKey?: string;
  yAxisKey?: string;
}) {
  const normalizedData = sourceChartData.slice(0, 50).map((row) => {
    const typedRow = row as Record<string, unknown>;
    const fallbackKeys = Object.keys(typedRow);
    const xKey = xAxisKey || fallbackKeys[0] || "name";
    const yKey = yAxisKey || fallbackKeys[1] || "value";
    const xRaw = typedRow[xKey] ?? typedRow[fallbackKeys[0]] ?? "";
    const yRaw = typedRow[yKey] ?? typedRow[fallbackKeys[1]] ?? 0;
    const parsedX = Number(xRaw);
    const parsedY = Number(yRaw);
    const numericX =
      xRaw !== "" &&
      xRaw !== null &&
      xRaw !== undefined &&
      Number.isFinite(parsedX);
    const numericY = Number.isFinite(parsedY) ? parsedY : 0;

    return {
      name: String(xRaw),
      value: numericY,
      x: numericX ? parsedX : String(xRaw),
      y: numericY,
    };
  });
  const simpleChartData = normalizedData.map(({ name, value }) => ({
    name,
    value,
  }));
  const scatterData = normalizedData.map(({ name, x, y }) => ({ name, x, y }));
  const pieData =
    simpleChartData.length > 0 &&
    simpleChartData.every((point) => point.value === 0)
      ? Object.entries(
          simpleChartData.reduce<Record<string, number>>((acc, item) => {
            const key = item.name || "Unknown";
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
          }, {})
        ).map(([name, value]) => ({ name, value }))
      : simpleChartData;
  const hasNumericX =
    scatterData.length > 0 &&
    scatterData.every((point) => typeof point.x === "number");

  const margin = { top: 20, right: 30, left: 20, bottom: 60 };

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
  } as const;

  const chart = (() => {
    switch (chartType) {
      case "bar":
        return (
          <BarChartView
            data={simpleChartData}
            colors={COLORS}
            tooltipStyle={tooltipStyle}
            margin={margin}
            yAxisKey={yAxisKey}
          />
        );

      case "line":
        return (
          <LineChartView
            data={simpleChartData}
            color={COLORS[1]}
            tooltipStyle={tooltipStyle}
            margin={margin}
             yAxisKey={yAxisKey}
          />
        );

      case "area":
        return (
          <AreaChartView
            data={simpleChartData}
            color={COLORS[2]}
            tooltipStyle={tooltipStyle}
            margin={margin}
             yAxisKey={yAxisKey}
          />
        );

      case "pie":
        return (
          <PieChartView
            data={pieData}
            colors={COLORS}
            tooltipStyle={tooltipStyle}
             yAxisKey={yAxisKey}
          />
        );

      case "scatter":
        // scatter-аа энэ файл дээрээ үлдээнэ
        return (
          <ScatterChart data={scatterData} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              type={hasNumericX ? "number" : "category"}
              dataKey={hasNumericX ? "x" : "name"}
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Scatter name="Data" data={scatterData} fill={COLORS[4]} />
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
