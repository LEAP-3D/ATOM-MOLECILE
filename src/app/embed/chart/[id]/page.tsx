import { Suspense } from "react";
import { EmbedChartClient } from "./EmbedChartClient";
import prisma from "@/lib/prisma";

export default async function EmbedChartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chart = await prisma.chartHistory.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      chartType: true,
      data: true,
      xAxisKey: true,
      yAxisKey: true,
    },
  });

  if (!chart) {
    return (
      <div style={{ color: "#888", padding: 24, background: "#0a0a0a", height: "100vh" }}>
        Chart олдсонгүй
      </div>
    );
  }

  return (
    // ── Suspense нэмэгдлээ ──
    <Suspense fallback={
      <div style={{ color: "#888", padding: 24, background: "#0a0a0a", height: "100vh" }}>
        Уншиж байна...
      </div>
    }>
      <EmbedChartClient
        chart={{
          title: chart.title,
          chartType: chart.chartType,
          chartData: Array.isArray(chart.data) ? (chart.data as Record<string, unknown>[]) : [],
          xAxisKey: chart.xAxisKey,
          yAxisKey: chart.yAxisKey,
        }}
      />
    </Suspense>
  );
}