import { motion } from "framer-motion";
import {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ScatterChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChartSuggestion } from "./chart-suggestions";

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  area: AreaChart,
  pie: PieChart,
  scatter: ScatterChart,
};

type SuggestionItemProps = {
  suggestion: ChartSuggestion;
  isSelected: boolean;
  onSelect: (suggestion: ChartSuggestion) => void;
};

export function SuggestionItem({
  suggestion,
  isSelected,
  onSelect,
}: SuggestionItemProps) {
  const Icon = chartIcons[suggestion.type as keyof typeof chartIcons] ?? BarChart3;

  return (
    <motion.button
      layout
      onClick={() => onSelect(suggestion)}
      className={cn(
        "w-full text-left p-4 rounded-xl transition-all duration-200 border",
        isSelected
          ? "glass neon-border shadow-lg"
          : "bg-muted/30 hover:bg-muted/50 border-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-primary" />
          <span className="font-semibold">{suggestion.title}</span>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded-md bg-primary/10 text-primary">
          {Math.round(suggestion.confidence * 100)}%
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground pl-9">
        {suggestion.reason}
      </p>
    </motion.button>
  );
}
