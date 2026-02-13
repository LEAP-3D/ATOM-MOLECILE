// app/_hooks/useChartGeneration.ts
import { useState } from "react";
import axios from "axios";
import type { ChartSuggestion } from "@/app/_components/editor/chart-suggestions";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";

export function useChartGeneration(
  files: UploadedFile[],
  setSelectedSuggestion: (suggestion: ChartSuggestion | null) => void,
  setActiveFile: (file: UploadedFile | null) => void
) {
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSubmit = async (message: string) => {
    if (!message.trim()) return;

    setIsChatLoading(true);
    setSelectedSuggestion(null);

    try {
      console.log("📤 Sending query to backend...");

      // ⭐ RAG Flow: зөвхөн query явуулна
      const response = await axios.post("/api/routes/generate-chart", {
        query: message,
      });

      console.log("✅ Backend response:", response.data);

      if (response.data.success && response.data.chartConfig) {
        const { chartConfig, filesData } = response.data;

        // Backend-ээс ирсэн filesData-г UploadedFile type руу хөрвүүлэх
        const matchedFile = filesData.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (fd: any) => fd.name === filesData[chartConfig.fileIndex]?.name
        );

        if (matchedFile) {
          const activeFile: UploadedFile = {
            id: matchedFile.id,
            name: matchedFile.name,
            uploadDate: new Date(),
            data: matchedFile.data,
            columns: matchedFile.columns,
          };

          // Active file-ыг тохируулах
          setActiveFile(activeFile);
        }

        // Chart suggestion үүсгэх
        const suggestion: ChartSuggestion = {
          type: chartConfig.chartType,
          xAxis: chartConfig.xAxis,
          yAxis: chartConfig.yAxis,
          title: chartConfig.title,
          reason: "",
          confidence: 0
        };

        setSelectedSuggestion(suggestion);

        console.log("📊 Chart suggestion set:", suggestion);
        console.log("📁 Active file set:", matchedFile?.name);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Chart generation failed:", error);
      
      const errorMsg = error.response?.data?.error || error.message;
      alert(`Chart үүсгэхэд алдаа гарлаа: ${errorMsg}`);
    } finally {
      setIsChatLoading(false);
    }
  };

  return {
    isChatLoading,
    handleChatSubmit,
  };
}