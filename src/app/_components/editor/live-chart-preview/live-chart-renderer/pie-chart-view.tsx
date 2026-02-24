"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { name: string; value: number }[];
  colors: string[];
  tooltipStyle: React.CSSProperties;
  yAxisKey?: string;
};

export function PieChartView({ data, colors,yAxisKey }: Props) {
  const slice = data.slice(0, 8);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={slice}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          outerRadius={200}
          dataKey="value"
        >
          {slice.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1c1c1c",
            border: "1px solid ##dbdbdb",
            borderRadius: "10px",
          }}
          itemStyle={{ color: "#ffffff" }}
          labelStyle={{ color: "#ffffff" }}
          formatter={(value) => [value, yAxisKey ?? "value"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
