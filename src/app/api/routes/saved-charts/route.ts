import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { ChartType } from "@/app/_components/editor/chart-suggestions/chart-types";

const chartTypeSchema = z.enum(["bar", "line", "area", "pie", "scatter"]);

const saveChartSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().optional(),
  fileId: z.string().trim().min(1).nullable().optional(),
  fileName: z.string().trim().min(1).max(255),
  originalQuery: z.string().trim().min(1),
  normalizedQuery: z.string().trim().min(1),
  sql: z.string().trim().min(1),
  chartType: chartTypeSchema,
  xAxisKey: z.string().trim().min(1),
  yAxisKey: z.string().trim().min(1),
  chartData: z.array(z.record(z.string(), z.any())),
  insight: z
    .object({
      insight: z.string(),
      bullets: z.array(z.string()),
    })
    .nullable()
    .optional(),
});

type ApiSavedChart = {
  id: string;
  title: string;
  chartType: ChartType;
  fileName: string;
  source: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: Record<string, any>[];
  createdAt: string;
  updatedAt: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toChartData(data: Prisma.JsonValue): Record<string, any>[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (entry): entry is Record<string, any> =>
      typeof entry === "object" && entry !== null && !Array.isArray(entry)
  );
}

function toApiSavedChart(value: {
  id: string;
  title: string;
  chartType: ChartType;
  fileName: string;
  data: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}): ApiSavedChart {
  return {
    id: value.id,
    title: value.title,
    chartType: value.chartType,
    fileName: value.fileName,
    source: value.fileName,
    chartData: toChartData(value.data),
    createdAt: value.createdAt.toISOString(),
    updatedAt: value.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const charts = await prisma.chartHistory.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        chartType: true,
        fileName: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      charts: charts.map((chart) =>
        toApiSavedChart({
          ...chart,
          chartType: chart.chartType as ChartType,
        })
      ),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch saved charts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = saveChartSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "originalQuery, normalizedQuery, and sql are required",
          issues: parsed.error.flatten(),
        },
        { status: 422 }
      );
    }

    const payload = parsed.data;

    const chartDataJson = payload.chartData as unknown as Prisma.InputJsonValue;
    const insightJson = payload.insight
      ? (payload.insight as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull;

    const createData: Prisma.ChartHistoryCreateInput = {
      userId,
      fileId: payload.fileId ?? null,
      fileName: payload.fileName,
      originalQuery: payload.originalQuery,
      normalizedQuery: payload.normalizedQuery,
      sql: payload.sql,
      chartType: payload.chartType,
      title: payload.title ?? "Untitled chart",
      description: payload.description ?? "",
      xAxisKey: payload.xAxisKey,
      yAxisKey: payload.yAxisKey,
      data: chartDataJson,
      insight: insightJson,
    };

    const updateData: Prisma.ChartHistoryUpdateManyMutationInput = {
      fileId: payload.fileId ?? null,
      fileName: payload.fileName,
      originalQuery: payload.originalQuery,
      normalizedQuery: payload.normalizedQuery,
      sql: payload.sql,
      chartType: payload.chartType,
      title: payload.title ?? "Untitled chart",
      description: payload.description ?? "",
      xAxisKey: payload.xAxisKey,
      yAxisKey: payload.yAxisKey,
      data: chartDataJson,
      insight: insightJson,
    };

    console.info("Saving chart history", {
      userId,
      chartId: payload.id ?? null,
      originalQuery: payload.originalQuery,
      normalizedQuery: payload.normalizedQuery,
      sql: payload.sql,
    });

    const saved = payload.id
      ? await prisma.chartHistory.updateMany({
          where: { id: payload.id, userId },
          data: updateData,
        })
      : null;

    let chart = null;
    let updated = false;

    if (saved && saved.count > 0 && payload.id) {
      updated = true;
      chart = await prisma.chartHistory.findFirst({
        where: { id: payload.id, userId },
        select: {
          id: true,
          title: true,
          chartType: true,
          fileName: true,
          data: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      chart = await prisma.chartHistory.create({
        data: createData,
        select: {
          id: true,
          title: true,
          chartType: true,
          fileName: true,
          data: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }
    if (!chart) {
      return NextResponse.json(
        { error: "Failed to save chart" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      action: updated ? "updated" : "created",
      chart: toApiSavedChart({
        ...chart,
        chartType: chart.chartType as ChartType,
      }),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save chart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
