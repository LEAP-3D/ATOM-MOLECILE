import {
  AreaChart,
  BarChart3,
  LineChart,
  PieChart,
  ScatterChart,
  TrendingUp,
} from "lucide-react";
import type { ChartType, LucideIconType } from "./chart-types";

export const chartMeta: Record<
  ChartType,
  { label: string; Icon: LucideIconType; reason: string }
> = {
  bar: {
    label: "Bar Chart",
    Icon: BarChart3,
    reason: "Best for comparing values across categories.",
  },
  pie: {
    label: "Pie Chart",
    Icon: PieChart,
    reason: "Best for showing part-to-whole proportions.",
  },
  line: {
    label: "Line Chart",
    Icon: LineChart,
    reason: "Best for trends and changes over sequence/time.",
  },
  area: {
    label: "Area Chart",
    Icon: AreaChart,
    reason: "Best for cumulative trends and magnitude.",
  },
  scatter: {
    label: "Scatter Plot",
    Icon: ScatterChart,
    reason: "Best for correlations between two metrics.",
  },
  "bar-race": {
    label: "Bar Race",
    Icon: TrendingUp,
    reason: "Best for animated ranking changes over time.",
  },
};
