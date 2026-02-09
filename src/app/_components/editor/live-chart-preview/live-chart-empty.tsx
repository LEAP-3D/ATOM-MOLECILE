"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export function LiveChartEmpty({ hasFile }: { hasFile: boolean }) {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="p-6 rounded-2xl bg-muted/30 inline-block mb-4">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Chart Preview</h3>
        <p className="text-muted-foreground">
          {!hasFile
            ? "Upload an Excel file and select a chart type to see your data visualized here"
            : "Select a chart suggestion and configure axes to preview your chart"}
        </p>
      </motion.div>
    </div>
  );
}
