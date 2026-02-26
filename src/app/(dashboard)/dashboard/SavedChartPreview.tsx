"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import type { ChartType } from "@/app/_components/editor/chart-suggestions/chart-types";
import { normalizePreviewData, type SavedChartRow } from "./saved-chart-preview-utils";

type SavedChartPreviewProps = {
  type: ChartType;
  data: SavedChartRow[];
  className?: string;
};

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];
const BAR_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function Placeholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-32 w-full items-center justify-center rounded-lg border border-border/70 bg-muted/20 text-xs text-muted-foreground",
        className
      )}
    >
      No preview
    </div>
  );
}

export function SavedChartPreview({ type, data, className }: SavedChartPreviewProps) {
  const points = useMemo(() => normalizePreviewData(data), [data]);
  const isSupportedType =
    type === "bar" ||
    type === "line" ||
    type === "area" ||
    type === "pie" ||
    type === "scatter";

  if (!isSupportedType || points.length === 0) {
    return <Placeholder className={className} />;
  }

  const margin = { top: 8, right: 8, bottom: 8, left: 8 };
  const scatterData = points.map((point) => ({ x: point.index, y: point.value, value: point.value }));

  return (
    <div className={cn("h-32 w-full rounded-lg border border-border/70 bg-muted/20 p-1", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {(() => {
          switch (type) {
            case "bar":
              return (
                <BarChart data={points} margin={margin}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" opacity={0.35} />
                  <XAxis dataKey="label" hide />
                  <YAxis hide />
                  <Bar dataKey="value" radius={[4, 4, 2, 2]}>
                    {points.map((_, index) => (
                      <Cell key={`bar-cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              );
            case "line":
              return (
                <LineChart data={points} margin={margin}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" opacity={0.35} />
                  <XAxis dataKey="label" hide />
                  <YAxis hide />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              );
            case "area":
              return (
                <AreaChart data={points} margin={margin}>
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" opacity={0.35} />
                  <XAxis dataKey="label" hide />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-3))"
                    fill="hsl(var(--chart-3))"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </AreaChart>
              );
            case "pie":
              return (
                <PieChart>
                  <Pie
                    data={points}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={22}
                    outerRadius={44}
                    paddingAngle={2}
                    isAnimationActive={false}
                  >
                    {points.map((_, index) => (
                      <Cell key={`pie-segment-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              );
            case "scatter":
              return (
                <ScatterChart margin={margin}>
                  <CartesianGrid stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" dataKey="x" hide domain={[0, 13]} />
                  <YAxis type="number" dataKey="y" hide />
                  <Scatter data={scatterData} dataKey="value" fill="hsl(var(--chart-4))" />
                </ScatterChart>
              );
            default:
              return null;
          }
        })()}
      </ResponsiveContainer>
    </div>
  );
}

export function SavedChartPreviewSkeleton() {
  return <div className="h-32 w-full animate-pulse rounded-lg border border-border/70 bg-muted/30" />;
}
