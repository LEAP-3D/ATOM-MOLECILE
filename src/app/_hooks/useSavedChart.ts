"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";
import type { ChartType } from "@/app/_components/editor/chart-suggestions/chart-types";
import type { LatestChartResult } from "@/app/_hooks/useChartGeneration";
import type {
  SavedChartDetail,
  SavedChartGetResponse,
} from "@/app/_lib/saved-charts";

type SaveChartResponse = {
  success: true;
  action: "created" | "updated";
  chart: {
    id: string;
  };
};

type Props = {
  savedChartIdParam: string | null;
  activeFile: UploadedFile | null;
  latestResult: LatestChartResult | null;
  selectedChartType: ChartType | null;
  setLatestResult: Dispatch<SetStateAction<LatestChartResult | null>>;
  setSelectedChartType: Dispatch<SetStateAction<ChartType>>;
};

export function useSavedChart({
  savedChartIdParam,
  activeFile,
  latestResult,
  selectedChartType,
  setLatestResult,
  setSelectedChartType,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loadedSavedChart, setLoadedSavedChart] =
    useState<SavedChartDetail | null>(null);
  const [currentSavedChartId, setCurrentSavedChartId] = useState<string | null>(
    savedChartIdParam
  );
  const [isLoadingSavedChart, setIsLoadingSavedChart] = useState(false);
  const [isSavingChart, setIsSavingChart] = useState(false);

  // LOAD
  useEffect(() => {
    if (!savedChartIdParam) return;

    let mounted = true;

    const load = async () => {
      try {
        setIsLoadingSavedChart(true);
        const res = await axios.get<SavedChartGetResponse>(
          `/api/saved-charts/${savedChartIdParam}`
        );

        if (!mounted) return;

        const chart = res.data.chart;
        setLoadedSavedChart(chart);
        setCurrentSavedChartId(chart.id);
        setSelectedChartType(chart.chartType);

        setLatestResult({
          originalQuery: chart.originalQuery,
          title: chart.title,
          description: chart.description,
          normalizedQuery: chart.normalizedQuery,
          sql: chart.sql,
          chartData: chart.chartData,
          xAxisKey: chart.xAxisKey,
          yAxisKey: chart.yAxisKey,
          recommendedCharts: [],
          insight: chart.insight ?? undefined,
        });
      } catch {
        toast.error("Failed to load saved chart");
      } finally {
        if (mounted) setIsLoadingSavedChart(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [savedChartIdParam, setLatestResult, setSelectedChartType]);

  const canSaveChart = useMemo(
    () =>
      !!latestResult &&
      latestResult.chartData?.length > 0 &&
      !!selectedChartType &&
      !isLoadingSavedChart,
    [latestResult, selectedChartType, isLoadingSavedChart]
  );

  const handleSaveChart = useCallback(async () => {
    if (!canSaveChart || !latestResult) return;

    try {
      setIsSavingChart(true);

      const payload = {
        id: currentSavedChartId ?? undefined,
        title: latestResult.title,
        description: latestResult.description,
        fileId: activeFile?.id ?? loadedSavedChart?.fileId ?? null,
        fileName:
          activeFile?.name ?? loadedSavedChart?.fileName ?? "Unknown file",
        originalQuery: latestResult.originalQuery,
        normalizedQuery: latestResult.normalizedQuery,
        sql: latestResult.sql,
        chartType: selectedChartType,
        xAxisKey: latestResult.xAxisKey,
        yAxisKey: latestResult.yAxisKey,
        chartData: latestResult.chartData,
        insight: latestResult.insight ?? null,
      };

      const res = await axios.post<SaveChartResponse>(
        "/api/saved-charts",
        payload
      );
      const savedId = res.data.chart.id;
      setCurrentSavedChartId(savedId);

      toast.success("Chart saved");

      const next = new URLSearchParams(searchParams.toString());
      next.set("savedChartId", savedId);
      router.replace(`/editor?${next.toString()}`);
    } catch {
      toast.error("Failed to save chart");
    } finally {
      setIsSavingChart(false);
    }
  }, [
    canSaveChart,
    latestResult,
    selectedChartType,
    activeFile,
    loadedSavedChart,
    currentSavedChartId,
    router,
    searchParams,
  ]);

  return {
    isLoadingSavedChart,
    isSavingChart,
    canSaveChart,
    handleSaveChart,
    currentSavedChartId, // ← нэмэгдсэн
  };
}