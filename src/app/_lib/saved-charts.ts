import type { ChartType } from "@/app/_components/editor/chart-suggestions/chart-types";

export type SavedChartSummary = {
  id: string;
  title: string;
  chartType: ChartType;
  fileName: string;
  createdAt: string;
  updatedAt: string;
};

export type SavedChartDetail = SavedChartSummary & {
  fileId: string | null;
  description: string;
  originalQuery: string;
  normalizedQuery: string;
  sql: string;
  xAxisKey: string;
  yAxisKey: string;
  chartData: Record<string, unknown>[];
  insight: {
    insight: string;
    bullets: string[];
  } | null;
};

export type SavedChartsListResponse = {
  success: true;
  charts: SavedChartSummary[];
};

export type SavedChartGetResponse = {
  success: true;
  chart: SavedChartDetail;
};
