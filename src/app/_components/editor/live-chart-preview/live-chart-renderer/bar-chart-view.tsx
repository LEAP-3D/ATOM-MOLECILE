"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type Props = {
  data: { name: string; value: number }[];
  colors: string[];
  tooltipStyle: React.CSSProperties;
  margin: { top: number; right: number; left: number; bottom: number };
  yAxisKey?: string; // ← нэмсэн
};

export function BarChartView({ data, colors, margin, yAxisKey }: Props) {
  return (
    <BarChart data={data} margin={margin}>
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
      <Tooltip
        contentStyle={{
          backgroundColor: "#1c1c1c",
          border: "1px solid #dbdbdb",
          borderRadius: "10px",
        }}
        itemStyle={{ color: "#ffffff" }}
        labelStyle={{ color: "#ffffff" }}
        formatter={(value) => [value, yAxisKey ?? "value"]} // ← yAxisKey ашиглана
      />
      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Bar>
    </BarChart>
  );
}