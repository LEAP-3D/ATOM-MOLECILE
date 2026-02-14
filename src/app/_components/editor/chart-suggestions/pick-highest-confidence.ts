import {
  CHART_TYPE_PRIORITY,
  type ChartType,
  type RecommendedChart,
} from "./chart-types";

export function pickHighestConfidenceChartType(
  recommendedCharts: RecommendedChart[] | null | undefined
): ChartType {
  if (!Array.isArray(recommendedCharts) || recommendedCharts.length === 0) {
    return "bar";
  }

  const scoreByType = new Map<ChartType, number>();

  for (const entry of recommendedCharts) {
    if (!CHART_TYPE_PRIORITY.includes(entry.chartType)) continue;

    const current =
      scoreByType.get(entry.chartType) ?? Number.NEGATIVE_INFINITY;
    if (entry.confidence > current) {
      scoreByType.set(entry.chartType, entry.confidence);
    }
  }

  if (scoreByType.size === 0) return "bar";

  // Tie-break uses fixed chart priority order.
  let bestType: ChartType = "bar";
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const type of CHART_TYPE_PRIORITY) {
    const score = scoreByType.get(type);
    if (score === undefined) continue;

    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  return bestType;
}
