// app/_hooks/useChartGeneration.ts
import { useState, useCallback } from "react";
import axios from "axios";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";
import type { ChartSuggestion } from "@/app/_components/editor/chart-suggestions";

export function useChartGeneration(
  files: UploadedFile[],
  selectedFileIds: Set<string>,
  setSelectedSuggestion: (suggestion: ChartSuggestion | null) => void
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

        if (response.data.success) {
          const { chartConfig } = response.data;

          console.log("✅ Received chart config:", chartConfig);

          const newSuggestion: ChartSuggestion = {
            type: chartConfig.chartType,
            title: chartConfig.title || "Generated Chart",
            reason: chartConfig.description || "AI-generated visualization",
            xAxis: chartConfig.xAxis,
            yAxis: chartConfig.yAxis,
            confidence: 0.9,
          };

          setSelectedSuggestion(newSuggestion);
        }
      } catch (error) {
        console.error("❌ Chart генерацлахад алдаа:", error);
        alert("Chart үүсгэхэд алдаа гарлаа");
      } finally {
        setIsChatLoading(false);
      }
    },
    [files, selectedFileIds, setSelectedSuggestion]
  );

  return {
    isChatLoading,
    handleChatSubmit,
  };
}