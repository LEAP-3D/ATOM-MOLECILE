// app/_hooks/useChartGeneration.ts
import { useState, useCallback } from "react";
import axios from "axios";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";
import {
  CHART_TYPE_PRIORITY,
  type RecommendedChart,
  type ChartType,
} from "../_components/editor/chart-suggestions/chart-types";
import { pickHighestConfidenceChartType } from "../_components/editor/chart-suggestions/pick-highest-confidence";
// import {
//   CHART_TYPE_PRIORITY,
//   pickHighestConfidenceChartType,
//   type ChartType,
//   type RecommendedChart,
// } from "@/app/_components/editor/chart-suggestions/ChartSuggestions";

function normalizeChartType(type: unknown): ChartType {
  const raw = String(type ?? "")
    .toLowerCase()
    .replace(/[_\s-]/g, "")
    .trim();
  if (CHART_TYPE_PRIORITY.includes(raw as ChartType)) return raw as ChartType;
  if (raw.includes("pie")) return "pie";
  if (raw.includes("scatter")) return "scatter";
  if (raw.includes("area")) return "area";
  if (raw.includes("line")) return "line";
  if (raw.includes("bar") || raw.includes("column")) return "bar";
  if (raw === "column") return "bar";
  if (raw === "donut" || raw === "doughnut") return "pie";
  return "bar";
}

function normalizeConfidence(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(1, Math.max(0, numeric));
}

type ChartGenerationResponse = {
  success?: boolean;
  chartType?: unknown;
  chart_type?: unknown;
  title?: string;
  description?: string;
  normalized_query?: string;
  chartData?: unknown;
  xAxisKey?: string;
  yAxisKey?: string;
  recommendedCharts?: Array<{
    chartType?: unknown;
    chart_type?: unknown;
    confidence?: unknown;
  }>;
  recommended_charts?: Array<{
    chartType?: unknown;
    chart_type?: unknown;
    confidence?: unknown;
  }>;
};

export type LatestChartResult = {
  title: string;
  description: string;
  normalizedQuery: string;
  chartData: Record<string, unknown>[];
  xAxisKey: string;
  yAxisKey: string;
  recommendedCharts: RecommendedChart[];
};

export function useChartGeneration() {
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [latestResult, setLatestResult] = useState<LatestChartResult | null>(
    null
  );
  const [selectedChartType, setSelectedChartType] = useState<ChartType>("bar");

  const generateChart = useCallback(
    async (
      query: string,
      selectedFiles: UploadedFile[]
    ): Promise<{ description: string }> => {
      if (selectedFiles.length === 0) {
        alert("Файл сонгоно уу");
        return { description: "" };
      }

      setIsChatLoading(true);

      try {
        const filesData = selectedFiles.map((file) => ({
          name: file.name,
          columns: file.columns,
          data: file.data,
        }));

        console.log("📤 Sending to HF API:", { query, filesData });

        const response = await axios.post("/api/routes/generate-chart", {
          query,
          filesData: filesData,
        });
        console.log("📥 Received response from HF API:", response.data);
        const data = response.data as ChartGenerationResponse;

        if (data.success) {
          // backend-ээс ирж буй өгөгдлийг шууд response.data-аас авна
          console.log("✅ Received data:", data);
          const chartData: Record<string, unknown>[] = Array.isArray(
            data.chartData
          )
            ? data.chartData
            : [];
          const firstRow =
            chartData.length > 0
              ? (chartData[0] as Record<string, unknown>)
              : null;
          const rowKeys = firstRow ? Object.keys(firstRow) : [];
          const normalizedRecommendedCharts: RecommendedChart[] = (
            data.recommendedCharts ??
            data.recommended_charts ??
            []
          ).map((entry) => ({
            // Accept chartType/chart_type and normalize to app-level chartType.
            chartType: normalizeChartType(
              (entry as { chartType?: unknown; chart_type?: unknown })
                .chartType ??
                (entry as { chartType?: unknown; chart_type?: unknown })
                  .chart_type
            ),
            confidence: normalizeConfidence(entry.confidence),
          }));

          // Compute default chart from highest confidence + priority tie-break.
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const selectedChartType = pickHighestConfidenceChartType(
            normalizedRecommendedCharts
          );
          const normalizedResult: LatestChartResult = {
            title: data.title || "Generated Chart",
            description: data.description || "AI-generated visualization",
            normalizedQuery: String(data.normalized_query ?? ""),
            chartData,
            xAxisKey: data.xAxisKey || rowKeys[0] || "",
            yAxisKey: data.yAxisKey || rowKeys[1] || "",
            recommendedCharts: normalizedRecommendedCharts,
          };

          // Store latest generated payload once; chart switches reuse this data.
          setLatestResult(normalizedResult);
          setSelectedChartType(selectedChartType);
          return { description: data.description ?? "" };
        }
        return { description: "" };
      } catch (error) {
        console.error("❌ Chart генерацлахад алдаа:", error);
        alert("Chart үүсгэхэд алдаа гарлаа");
        return { description: "" };
      } finally {
        setIsChatLoading(false);
      }
    },
    []
  );

  return {
    isChatLoading,
    latestResult,
    selectedChartType,
    setSelectedChartType,
    generateChart,
  };
}
