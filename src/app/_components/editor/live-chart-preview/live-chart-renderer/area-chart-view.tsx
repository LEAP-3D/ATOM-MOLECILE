"use client";

import {
  AreaChart,
  Area,
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
  yAxisKey?: string;
};

export function AreaChartView({ data, color, tooltipStyle, margin, yAxisKey }: Props) {
  return (
    <AreaChart data={data} margin={margin}>
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.8} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>

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
      <Tooltip contentStyle={tooltipStyle}  formatter={(value) => [value, yAxisKey ?? "value"]}  />
      <Area
        type="monotone"
        dataKey="value"
        stroke={color}
        fillOpacity={1}
        fill="url(#areaGradient)"
      />
    </AreaChart>
  );
}
