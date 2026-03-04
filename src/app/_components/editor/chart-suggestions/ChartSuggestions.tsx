"use client";

import type { UploadedFile } from "../excel-upload";
import { EmptyState } from "../empty-state";
import { cn } from "@/lib/utils";

import {
  CHART_TYPE_PRIORITY,
  type ChartType,
  type RecommendedChart,
} from "./chart-types";
import { chartMeta } from "./chart-meta";

type ChartSuggestionsProps = {
  file: UploadedFile | null;
  recommendedCharts: RecommendedChart[] | null | undefined;
  selectedChartType: ChartType;
  onSelectChartType: (type: ChartType) => void;
  isLoading?: boolean;
};

export function ChartSuggestions({
  file,
  recommendedCharts,
  selectedChartType,
  onSelectChartType,
  isLoading,
}: ChartSuggestionsProps) {
  const scoreByType = new Map<ChartType, number>();
  for (const item of recommendedCharts ?? []) {
    scoreByType.set(item.chartType, item.confidence);
  }

  const priorityIndexByType = new Map<ChartType, number>(
    CHART_TYPE_PRIORITY.map((type, index) => [type, index])
  );

  const sortedTypes: ChartType[] = CHART_TYPE_PRIORITY.filter(
    (type): type is ChartType => Object.hasOwn(chartMeta, type)
  ).sort((a, b) => {
    const confA = scoreByType.get(a) ?? 0;
    const confB = scoreByType.get(b) ?? 0;

    if (confB !== confA) return confB - confA;

    const indexA = priorityIndexByType.get(a) ?? Number.MAX_SAFE_INTEGER;
    const indexB = priorityIndexByType.get(b) ?? Number.MAX_SAFE_INTEGER;
    return indexA - indexB;
  });

  if (!file) {
    return (
      <EmptyState
        icon="file"
        title="No Data Uploaded"
        message="Upload an Excel file to receive intelligent chart suggestions."
      />
    );
  }

  if (isLoading) {
    return (
      <EmptyState
        icon="loader"
        title="Analyzing Data..."
        message="We are analyzing your data to suggest the best chart types."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="pt-3 pl-3">
        <h3 className="text-lg font-semibold">Chart Suggestions</h3>
        <p className="text-sm text-muted-foreground">
          Based on your data structure
        </p>
      </div>

      <div className="space-y-2 p-2">
        {sortedTypes.map((type) => {
          const meta = chartMeta[type];
          const confidence = scoreByType.get(type) ?? 0;
          const Icon = meta.Icon;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelectChartType(type)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-200 border",
                selectedChartType === type
                  ? "glass border-blue-500 shadow-lg"
                  : "bg-muted/30 hover:bg-muted/50 border-transparent"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <span className="font-semibold">{meta.label}</span>
                </div>
                <span className="text-xs font-mono px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {Math.round(confidence * 100)}%
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground pl-9">
                {meta.reason}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
