"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import type { UploadedFile } from "./excel-upload";

export type ChartSuggestion = {
  type: "bar" | "line" | "area" | "pie" | "scatter";
  title: string;
  reason: string;
  xAxis?: string;
  yAxis?: string;
  confidence: number;
};

type ChartSuggestionsProps = {
  file: UploadedFile | null;
  suggestions: ChartSuggestion[];
  selectedSuggestion: ChartSuggestion | null;
  onSelect: (suggestion: ChartSuggestion) => void;
  onAxisChange: (xAxis: string, yAxis: string) => void;
};

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  area: AreaChart,
  pie: PieChart,
  scatter: ScatterChart,
};

const chartColors = {
  bar: "from-primary to-primary/50",
  line: "from-secondary to-secondary/50",
  area: "from-accent to-accent/50",
  pie: "from-chart-4 to-chart-4/50",
  scatter: "from-chart-5 to-chart-5/50",
};

export function ChartSuggestions({
  file,
  suggestions,
  selectedSuggestion,
  onSelect,
  onAxisChange,
}: ChartSuggestionsProps) {
  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-muted/50 mb-4"
        >
          <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
        </motion.div>
        <h3 className="font-semibold mb-2">No Data Uploaded</h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          Upload an Excel file to receive intelligent chart suggestions based on
          your data
        </p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-4"
        >
          <BarChart3 className="h-10 w-10 text-primary" />
        </motion.div>
        <h3 className="font-semibold mb-2">Analyzing Data...</h3>
        <p className="text-sm text-muted-foreground max-w-[200px]">
          We are analyzing your data structure to suggest the best chart types
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold">Chart Suggestions</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Based on your data structure
        </p>
      </div>

      {/* Suggestions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => {
            const Icon = chartIcons[suggestion.type];
            const isSelected = selectedSuggestion?.type === suggestion.type;

            return (
              <motion.button
                key={`${suggestion.type}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(suggestion)}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all duration-200",
                  isSelected
                    ? "glass neon-border shadow-lg"
                    : "bg-muted/30 hover:bg-muted/50 border border-transparent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-lg bg-gradient-to-br transition-transform",
                      chartColors[suggestion.type],
                      isSelected && "scale-110"
                    )}
                  >
                    <Icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {suggestion.title}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {suggestion.reason}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Axis Selection */}
      {selectedSuggestion && file && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-border/50 space-y-3"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Customize Axes
          </p>

          <div className="space-y-2">
            <div>
              <label className="text-xs text-muted-foreground">X-Axis</label>
              <select
                value={selectedSuggestion.xAxis || ""}
                onChange={(e) =>
                  onAxisChange(e.target.value, selectedSuggestion.yAxis || "")
                }
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select column</option>
                {file.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Y-Axis</label>
              <select
                value={selectedSuggestion.yAxis || ""}
                onChange={(e) =>
                  onAxisChange(selectedSuggestion.xAxis || "", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select column</option>
                {file.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
            disabled={!selectedSuggestion.xAxis || !selectedSuggestion.yAxis}
          >
            Apply Changes
          </Button>
        </motion.div>
      )}
    </div>
  );
}
