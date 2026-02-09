"use client";

import { motion } from "framer-motion";
import { BarChart3, Eye, Trash2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { ChartThumbnail } from "./chart-thumbnail";

export type SavedChart = {
  id: string;
  name: string;
  type: string;
  createdAt: Date;
  thumbnail: string;
};

type Props = {
  charts: SavedChart[];
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function SavedChartsSection({ charts, onView, onDelete }: Props) {
  return (
    <div className="rounded-xl glass neon-border p-6">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        Saved Charts
      </h2>

      {charts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {charts.map((chart, index) => (
            <motion.div
              key={chart.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="h-20 rounded-lg bg-linear-to-br from-primary/10 to-secondary/10 mb-3 flex items-center justify-center">
                <ChartThumbnail type={chart.thumbnail} />
              </div>

              <h3 className="font-medium text-sm truncate">{chart.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {chart.createdAt.toLocaleDateString()}
              </p>

              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => onView?.(chart.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete?.(chart.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No saved charts yet</p>
        </div>
      )}
    </div>
  );
}
