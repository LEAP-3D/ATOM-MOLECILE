import { AnimatePresence, motion } from "framer-motion";
import type { UploadedFile } from "./excel-upload";
import type { ChartSuggestion } from "./chart-suggestions";

type AxisSelectorProps = {
  file: UploadedFile;
  selectedSuggestion: ChartSuggestion;
  onAxisChange: (xAxis: string, yAxis: string) => void;
};

export function AxisSelector({
  file,
  selectedSuggestion,
  onAxisChange,
}: AxisSelectorProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mt-4 p-4 bg-muted/30 rounded-xl border"
      >
        <h4 className="font-semibold text-sm mb-2">Customize Axes</h4>
        <div className="grid grid-cols-2 gap-4">
          {/* X-Axis Dropdown */}
          <div>
            <label
              htmlFor="x-axis"
              className="block text-xs font-medium text-muted-foreground"
            >
              X-Axis
            </label>
            <select
              id="x-axis"
              value={selectedSuggestion.xAxis || ""}
              onChange={(e) =>
                onAxisChange(e.target.value, selectedSuggestion.yAxis || "")
              }
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select column</option>
              {file.columns.map((col) => (
                <option key={`x-${col}`} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Y-Axis Dropdown */}
          <div>
            <label
              htmlFor="y-axis"
              className="block text-xs font-medium text-muted-foreground"
            >
              Y-Axis
            </label>
            <select
              id="y-axis"
              value={selectedSuggestion.yAxis || ""}
              onChange={(e) =>
                onAxisChange(selectedSuggestion.xAxis || "", e.target.value)
              }
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select column</option>
              {file.columns.map((col) => (
                <option key={`y-${col}`} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
