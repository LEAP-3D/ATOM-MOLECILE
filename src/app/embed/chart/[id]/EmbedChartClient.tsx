"use client";

import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#f97316",
  "#14b8a6",
  "#ec4899",
  "#84cc16",
];

type Props = {
  chart: {
    title: string;
    chartType: string;
    chartData: Record<string, unknown>[];
    xAxisKey: string;
    yAxisKey: string;
  };
};

export function EmbedChartClient({ chart }: Props) {
  const { chartType, chartData, xAxisKey, yAxisKey } = chart;

  const params = useSearchParams();
  const bgColor = params.get("bg") ?? "#0a0a0a";
  const width = params.get("w") ? `${params.get("w")}px` : "100vw";
  const height = params.get("h") ? `${params.get("h")}px` : "100vh";

  const isLightBg =
    bgColor === "#ffffff" ||
    bgColor === "#f8fafc" ||
    (bgColor.startsWith("#") && parseInt(bgColor.slice(1), 16) > 0xaaaaaa);
  const textColor = isLightBg ? "#111111" : "#ffffff";

  const commonProps = {
    data: chartData,
    margin: { top: 16, right: 24, left: 0, bottom: 8 },
  };

  const xAxis = (
    <XAxis dataKey={xAxisKey} tick={{ fill: textColor, fontSize: 11 }} />
  );
  const yAxis = <YAxis tick={{ fill: textColor, fontSize: 11 }} />;
  const grid = <CartesianGrid strokeDasharray="3 3" stroke="#632247" />;

  const tip = (
    <Tooltip
      contentStyle={{
        background: "#000000",
        border: "1px solid #333",
        borderRadius: "8px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
      itemStyle={{ color: "#ffffff" }}
      labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
      isAnimationActive={false}
      allowEscapeViewBox={{ x: true, y: true }}
    />
  );

  const leg = (
    <Legend
      iconSize={0}
      formatter={() => <span style={{ color: textColor }}>{chart.title}</span>}
    />
  );

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <LineChart {...commonProps}>
          {grid}
          {xAxis}
          {yAxis}
          {tip}
          {leg}
          {COLORS.slice(0, 3).map((color, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={yAxisKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      );
    }
    if (chartType === "area") {
      return (
        <AreaChart {...commonProps}>
          {grid}
          {xAxis}
          {yAxis}
          {tip}
          {leg}
          <Area
            type="monotone"
            dataKey={yAxisKey}
            stroke={COLORS[0]}
            fill={COLORS[0] + "33"}
          />
        </AreaChart>
      );
    }
    if (chartType === "pie") {
      return (
        <PieChart>
          <Pie
            data={chartData}
            dataKey={yAxisKey}
            nameKey={xAxisKey}
            cx="50%"
            cy="50%"
            outerRadius="60%"
            label
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {tip}
          {leg}
        </PieChart>
      );
    }
    return (
      <BarChart {...commonProps}>
        {grid}
        {xAxis}
        {yAxis}
        {tip}
        {leg}
        <Bar dataKey={yAxisKey} radius={[4, 4, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    );
  };

  return (
    <div
      style={{
        width,
        height,
        background: bgColor,
        display: "flex",
        alignItems: "stretch",
        pointerEvents: "auto",
        position: "relative",
      }}
    >
      <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
