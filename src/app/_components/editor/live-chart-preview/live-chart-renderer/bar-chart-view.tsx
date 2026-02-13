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
  
};

export function BarChartView({ data, colors, tooltipStyle, margin }: Props) {
  return (
    <BarChart data={data} margin={margin}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
      <XAxis
        dataKey="name"
        stroke="hsl(var(--muted-foreground))"
        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        angle={-45}
        textAnchor="end"
        height={80}
        interval={0}
      />
      <YAxis
        stroke="hsl(var(--muted-foreground))"
        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
      />
      <Tooltip 
        contentStyle={tooltipStyle}
        cursor={{ fill: "hsl(var(--muted) / 0.1)" }}
      />
      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Bar>
    </BarChart>
  );
}