"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Save, Loader2 } from "lucide-react";

import {
  ExcelUpload,
  type UploadedFile,
} from "@/app/_components/editor/excel-upload";
import { DataPreviewModal } from "@/app/_components/editor/data-preview-modal";
import { ChatInput } from "@/app/_components/editor/chat-input";
import { ChartSuggestions } from "@/app/_components/editor/chart-suggestions/ChartSuggestions";
import { LiveChartPreview } from "@/app/_components/editor/live-chart-preview";
import { useFileManagement } from "@/app/_hooks/useFileManagement";
import { useChartGeneration } from "@/app/_hooks/useChartGeneration";
import { useSavedChart } from "@/app/_hooks/useSavedChart";
import { Button } from "@/app/_components/ui/button";

export default function EditorClient() {
  const searchParams = useSearchParams();
  const savedChartIdParam = searchParams.get("savedChartId");

  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    files,
    selectedFileIds,
    isLoadingFiles,
    handleUpload,
    handleRemove,
    handleFileToggle,
  } = useFileManagement();

  const activeFile = files[files.length - 1] ?? null;

  const {
    isChatLoading,
    latestResult,
    selectedChartType,
    setSelectedChartType,
    setLatestResult,
    generateChart,
  } = useChartGeneration();

  const { isLoadingSavedChart, isSavingChart, canSaveChart, handleSaveChart } =
    useSavedChart({
      savedChartIdParam,
      activeFile,
      latestResult,
      selectedChartType,
      setLatestResult,
      setSelectedChartType,
    });

  const handleView = useCallback((file: UploadedFile) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  }, []);

  const handleChatSubmit = useCallback(
    async (message: string) => {
      const selectedFiles = files.filter((file) =>
        selectedFileIds.has(file.id)
      );
      return generateChart(message, selectedFiles);
    },
    [files, selectedFileIds, generateChart]
  );

  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 shrink-0 border-r border-border/50 glass-strong flex flex-col"
      >
        <div className="p-4 border-b border-border/50">
          <h2 className="font-semibold text-lg">Data Input</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <ExcelUpload
            files={files}
            selectedFileIds={selectedFileIds}
            isLoadingFiles={isLoadingFiles}
            onFileToggle={handleFileToggle}
            onUpload={handleUpload}
            onRemove={handleRemove}
            onView={handleView}
          />

          <ChatInput
            onSubmit={handleChatSubmit}
            isLoading={isChatLoading}
            disabled={selectedFileIds.size === 0}
          />
        </div>
      </motion.div>

      {/* CENTER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col min-w-0"
      >
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Chart Preview</h2>

          <Button
            onClick={() => handleSaveChart()}
            disabled={!canSaveChart || isSavingChart}
          >
            {isSavingChart ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save chart
              </>
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <LiveChartPreview
            file={activeFile}
            result={latestResult}
            selectedChartType={selectedChartType}
            isLoading={isChatLoading || isLoadingSavedChart}
          />
        </div>
      </motion.div>

      {/* RIGHT */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 shrink-0 border-l border-border/50 glass-strong"
      >
        <ChartSuggestions
          file={activeFile}
          recommendedCharts={latestResult?.recommendedCharts}
          selectedChartType={selectedChartType}
          onSelectChartType={setSelectedChartType}
          isLoading={isChatLoading}
        />
      </motion.div>

      <DataPreviewModal
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
