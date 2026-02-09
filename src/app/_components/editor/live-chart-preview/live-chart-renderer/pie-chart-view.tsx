"use client";

import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";

type Props = {
  data: { name: string; value: number }[];
  colors: string[];
  tooltipStyle: React.CSSProperties;
};

export function PieChartView({ data, colors, tooltipStyle }: Props) {
  const slice = data.slice(0, 8);

  return (
    <PieChart>
      <Pie
        data={slice}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) =>
          `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
        }
        outerRadius={120}
        dataKey="value"
      >
        {slice.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={tooltipStyle} />
      <Legend />
    </PieChart>
  );
}
