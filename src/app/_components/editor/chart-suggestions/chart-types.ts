import type { BarChart3 } from "lucide-react";

export const CHART_TYPE_PRIORITY = [
  "bar",
  "pie",
  "line",
  "area",
  "scatter",
  "bar-race",
] as const;

export type ChartType = (typeof CHART_TYPE_PRIORITY)[number];

export type ChartSuggestion = {
  type: ChartType;
  title: string;
  reason: string;
  xAxis: string;
  yAxis: string;
  data?: Record<string, unknown>[];
  confidence: number;
};

export type RecommendedChart = {
  chartType: ChartType;
  confidence: number;
};

// optional: icon type helper (if you want to reuse)
export type LucideIconType = typeof BarChart3;
