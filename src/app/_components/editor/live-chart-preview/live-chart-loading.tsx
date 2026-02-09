"use client";

import { motion } from "framer-motion";

export function LiveChartLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="relative w-20 h-20 mx-auto mb-4">
          <motion.div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <p className="text-muted-foreground">Generating chart...</p>
      </motion.div>
    </div>
  );
}
