"use client";

import { motion } from "framer-motion";
import type { ChartSuggestion } from "../chart-suggestions";
import type { UploadedFile } from "../excel-upload";
import { LiveChartLoading } from "./live-chart-loading";
import { LiveChartEmpty } from "./live-chart-empty";
import { LiveChartRenderer } from "./live-chart-renderer/live-chart-renderer";

type LiveChartPreviewProps = {
  file: UploadedFile | null;
  suggestion: ChartSuggestion | null;
  isLoading?: boolean;
};

export function LiveChartPreview({
  file,
  suggestion,
  isLoading,
}: LiveChartPreviewProps) {
  if (isLoading) return <LiveChartLoading />;

  if (!file || !suggestion || !suggestion.xAxis || !suggestion.yAxis) {
    return <LiveChartEmpty hasFile={!!file} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      {/* Chart Title */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold">{suggestion.title}</h3>
        <p className="text-sm text-muted-foreground">
          {suggestion.xAxis} vs {suggestion.yAxis}
        </p>
      </div>

      {/* Chart */}
      <div className="flex-1 p-4">
        <LiveChartRenderer file={file} suggestion={suggestion} />
      </div>
    </motion.div>
  );
}
