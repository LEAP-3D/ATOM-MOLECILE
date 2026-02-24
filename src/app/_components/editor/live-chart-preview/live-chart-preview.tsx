"use client";

import { motion } from "framer-motion";
import type { ChartType } from "../chart-suggestions/chart-types";
import type { UploadedFile } from "../excel-upload";
import { LiveChartLoading } from "./live-chart-loading";
import { LiveChartEmpty } from "./live-chart-empty";
import { LiveChartRenderer } from "./live-chart-renderer/live-chart-renderer";
import type { LatestChartResult } from "@/app/_hooks/useChartGeneration";

type LiveChartPreviewProps = {
  file: UploadedFile | null;
  result: LatestChartResult | null;
  selectedChartType: ChartType | null;
  isLoading?: boolean;
};

export function LiveChartPreview({
  file,
  result,
  selectedChartType,
  isLoading,
}: LiveChartPreviewProps) {
  if (isLoading) return <LiveChartLoading />;

  if (!result || !selectedChartType || result.chartData.length === 0) {
    return <LiveChartEmpty hasFile={!!file || !!result} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      {/* Chart Title */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold">{result.title}</h3>
        {result.insight ? (
          <div className="mt-2">
            <p className="mb-2 text-sm text-muted-foreground">
              {result.insight.insight}
            </p>

            {result.insight.bullets?.length > 0 && (
              <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                {result.insight.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{result.description}</p>
        )}
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <LiveChartRenderer
          chartType={selectedChartType}
          chartData={result.chartData}
          xAxisKey={result.xAxisKey}
          yAxisKey={result.yAxisKey}
        />
      </div>
    </motion.div>
  );
}
