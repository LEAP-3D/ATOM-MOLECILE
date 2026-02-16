"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
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

export default function EditorPage() {
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
    generateChart,
  } = useChartGeneration();

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
      {/* LEFT SIDEBAR */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 shrink-0 border-r border-border/50 glass-strong flex flex-col"
      >
        <div className="p-4 border-b border-border/50">
          <h2 className="font-semibold text-lg">Data Input</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-3">
            <ExcelUpload
              files={files}
              selectedFileIds={selectedFileIds}
              isLoadingFiles={isLoadingFiles}
              onFileToggle={handleFileToggle}
              onUpload={handleUpload}
              onRemove={handleRemove}
              onView={handleView}
            />
          </div>

          <ChatInput
            onSubmit={handleChatSubmit}
            isLoading={isChatLoading}
            disabled={selectedFileIds.size === 0}
          />
        </div>
      </motion.div>

      {/* CENTER - CHART PREVIEW */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col min-w-0"
      >
        <div className="p-4 border-b border-border/50">
          <h2 className="font-semibold text-lg">Chart Preview</h2>
        </div>

        <div className="flex-1 overflow-hidden">
          <LiveChartPreview
            file={activeFile}
            result={latestResult}
            selectedChartType={selectedChartType}
            isLoading={isChatLoading}
          />
        </div>
      </motion.div>

      {/* RIGHT SIDEBAR - SUGGESTIONS */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
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

      {/* DATA PREVIEW MODAL */}
      <DataPreviewModal
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
