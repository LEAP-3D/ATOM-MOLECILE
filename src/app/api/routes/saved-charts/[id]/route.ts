import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const chart = await prisma.chartHistory.findFirst({
      where: { id, userId },
    });

    if (!chart) {
      return NextResponse.json({ error: "Chart not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      chart: {
        id: chart.id,
        title: chart.title,
        chartType: chart.chartType,
        fileName: chart.fileName,
        source: chart.fileName,
        fileId: chart.fileId,
        description: chart.description ?? "",
        originalQuery: chart.originalQuery,
        normalizedQuery: chart.normalizedQuery,
        sql: chart.sql,
        xAxisKey: chart.xAxisKey,
        yAxisKey: chart.yAxisKey,
        chartData: Array.isArray(chart.data)
          ? (chart.data as Record<string, unknown>[])
          : [],
        insight:
          chart.insight && typeof chart.insight === "object"
            ? (chart.insight as { insight: string; bullets: string[] })
            : null,
        createdAt: chart.createdAt.toISOString(),
        updatedAt: chart.updatedAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch saved chart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const removed = await prisma.chartHistory.deleteMany({
      where: { id, userId },
    });

    if (removed.count === 0) {
      return NextResponse.json({ error: "Chart not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete chart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
