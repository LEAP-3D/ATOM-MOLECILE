"use client";

import { motion } from "framer-motion";
import type { ChartType } from "../chart-suggestions/chart-types";
import type { UploadedFile } from "../excel-upload";
import { LiveChartLoading } from "./live-chart-loading";
import { LiveChartEmpty } from "./live-chart-empty";
import { LiveChartRenderer } from "./live-chart-renderer/live-chart-renderer";
import type { LatestChartResult } from "@/app/_hooks/useChartGeneration";
import { ChartDownloadWrapper } from "./chart-download-wrapper";

type LiveChartPreviewProps = {
  file: UploadedFile | null;
  result: LatestChartResult | null;
  selectedChartType: ChartType | null;
  isLoading?: boolean;
  savedChartId?: string | null; // ← нэмэгдсэн
};

export function LiveChartPreview({
  file,
  result,
  selectedChartType,
  isLoading,
  savedChartId,
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
      {/* Title + Insight — embed-д ороогүй, зөвхөн UI-д харагдана */}
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

      {/* Зөвхөн chart → PNG татах + embed хоёулд энэ л орно */}
      <div className="flex-1 p-2 w-full overflow-hidden">
        <ChartDownloadWrapper
          title={result.title}
          chartId={savedChartId ?? undefined}
        >
          <div className="h-[530px]">
            <LiveChartRenderer
              chartType={selectedChartType}
              chartData={result.chartData}
              xAxisKey={result.xAxisKey}
              yAxisKey={result.yAxisKey}
            />
          </div>
        </ChartDownloadWrapper>
      </div>
    </motion.div>
  );
}
