// app/_hooks/useChartGeneration.ts
import { useState, useCallback } from "react";
import axios from "axios";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";
import type { ChartSuggestion } from "@/app/_components/editor/chart-suggestions";

function normalizeChartType(type: unknown): ChartSuggestion["type"] {
  const raw = String(type ?? "").toLowerCase();
  if (["bar", "line", "area", "pie", "scatter"].includes(raw)) return raw;
  if (raw === "column") return "bar";
  if (raw === "donut" || raw === "doughnut") return "pie";
  return "bar";
}

export function useChartGeneration(
  files: UploadedFile[],
  selectedFileIds: Set<string>,
  onSuggestionGenerated: (suggestion: ChartSuggestion) => void
) {
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSubmit = useCallback(
    async (message: string) => {
      if (selectedFileIds.size === 0) {
        alert("Файл сонгоно уу");
        return;
      }

      setIsChatLoading(true);

      try {
        const selectedFiles = files.filter((f) => selectedFileIds.has(f.id));

        const filesData = selectedFiles.map((file) => ({
          name: file.name,
          columns: file.columns,
          data: file.data,
        }));

        console.log("📤 Sending to HF API:", { query: message, filesData });

        const response = await axios.post("/api/routes/generate-chart", {
          query: message,
          filesData: filesData,
        });
        console.log("📥 Received response from HF API:", response.data);
        if (response.data.success) {
          // backend-ээс ирж буй өгөгдлийг шууд response.data-аас авна
          const data = response.data;

          console.log("✅ Received data:", data);
          const chartData: Record<string, unknown>[] = Array.isArray(
            data.chartData
          )
            ? data.chartData
            : [];
          const firstRow =
            chartData.length > 0
              ? (chartData[0] as Record<string, unknown>)
              : null;
          const rowKeys = firstRow ? Object.keys(firstRow) : [];

          const newSuggestion: ChartSuggestion = {
            type: normalizeChartType(data.chartType),
            title: data.title || "Generated Chart",
            reason: data.description || "AI-generated visualization",
            xAxis: data.xAxisKey || rowKeys[0] || "",
            yAxis: data.yAxisKey || rowKeys[1] || "",
            confidence: 0.9,
            data: chartData,
          };

          onSuggestionGenerated(newSuggestion);
        }
      } catch (error) {
        console.error("❌ Chart генерацлахад алдаа:", error);
        alert("Chart үүсгэхэд алдаа гарлаа");
      } finally {
        setIsChatLoading(false);
      }
    },
    [files, selectedFileIds, onSuggestionGenerated]
  );

  return {
    isChatLoading,
    handleChatSubmit,
  };
}
