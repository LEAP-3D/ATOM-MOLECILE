// src/components/charts/BarRaceChart.tsx
"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts";

type BarRaceDataItem = {
  year: number;
  [key: string]: number;
};

type Props = {
  data: BarRaceDataItem[];
};

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#f97316",
  "#14b8a6",
  "#ec4899",
  "#84cc16",
];

export function BarRaceChart({ data }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const chart = echarts.init(chartRef.current, "dark");
    const categories = Object.keys(data[0]).filter((k) => k !== "year");
    let currentIndex = 0;

    const getOption = (yearData: BarRaceDataItem) => {
      const sorted = categories
        .map((name) => ({ name, value: yearData[name] ?? 0 }))
        .sort((a, b) => a.value - b.value);

      return {
        backgroundColor: "transparent",
        grid: { top: 10, bottom: 30, left: 150, right: 100 },
        xAxis: {
          max: "dataMax",
          axisLabel: {
            color: "hsl(var(--muted-foreground))",
            fontSize: 11,
          },
          splitLine: {
            lineStyle: { color: "hsl(var(--border))" },
          },
        },
        yAxis: {
          type: "category",
          data: sorted.map((d) => d.name),
          axisLabel: {
            color: "hsl(var(--foreground))",
            fontSize: 12,
          },
          animationDuration: 300,
          animationDurationUpdate: 1000,
        },
        series: [
          {
            realtimeSort: true,
            type: "bar",
            data: sorted.map((d, i) => ({
              value: d.value,
              itemStyle: { color: COLORS[i % COLORS.length] },
            })),
            label: {
              show: true,
              position: "right",
              color: "hsl(var(--foreground))",
              fontSize: 11,
              formatter: (p: { value: number }) => p.value.toLocaleString(),
            },
            barMaxWidth: 40,
          },
        ],
        graphic: [
          {
            type: "text",
            right: 80,
            bottom: 60,
            style: {
              text: String(yearData.year),
              font: "bold 56px sans-serif",
              fill: "rgba(255,255,255,0.08)",
            },
          },
        ],
        animationDuration: 0,
        animationDurationUpdate: 1000,
        animationEasing: "linear" as const,
        animationEasingUpdate: "linear" as const,
      };
    };

    chart.setOption(getOption(data[0]));

    const timer = setInterval(() => {
      currentIndex++;
      if (currentIndex >= data.length) {
        clearInterval(timer);
        return;
      }
      chart.setOption(getOption(data[currentIndex]));
    }, 1200);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
}
