"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type Props = {
  data: { name: string; value: number }[];
  color: string;
  tooltipStyle: React.CSSProperties;
  margin: { top: number; right: number; left: number; bottom: number };
};

export function LineChartView({ data, color, tooltipStyle, margin }: Props) {
  return (
    <LineChart data={data} margin={margin}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis
        dataKey="name"
        stroke="hsl(var(--muted-foreground))"
        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        angle={-45}
        textAnchor="end"
        height={60}
      />
      <YAxis
        stroke="hsl(var(--muted-foreground))"
        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
      />
      <Tooltip contentStyle={tooltipStyle} />
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={2}
        dot={{ fill: color, strokeWidth: 2 }}
        activeDot={{ r: 6, fill: color }}
      />
    </LineChart>
  );
}
