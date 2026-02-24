// export const CHART_TYPES = ["bar", "line", "area", "pie", "scatter"] as const;
// export type ChartType = (typeof CHART_TYPES)[number];

// export function normalizeChartType(type: unknown): ChartType {
//   const raw = String(type ?? "")
//     .toLowerCase()
//     .replace(/[_\s-]/g, "")
//     .trim();
//   if (CHART_TYPES.includes(raw as ChartType)) return raw as ChartType;
//   if (raw.includes("pie") || raw === "donut" || raw === "doughnut")
//     return "pie";
//   if (raw.includes("scatter")) return "scatter";
//   if (raw.includes("area")) return "area";
//   if (raw.includes("line")) return "line";
//   return "bar";
// }

// export function normalizeRecommendedCharts(charts: unknown) {
//   if (!Array.isArray(charts)) return [];
//   return charts.map((item) => ({
//     chartType: normalizeChartType(
//       item?.chartType ?? item?.chart_type ?? item?.type
//     ),
//     confidence:
//       typeof item?.confidence === "number"
//         ? Math.min(1, Math.max(0, item.confidence))
//         : 0,
//   }));
// }
