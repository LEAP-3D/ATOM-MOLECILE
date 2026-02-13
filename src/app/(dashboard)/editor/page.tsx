"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ExcelUpload,
  type UploadedFile,
} from "@/app/_components/editor/excel-upload";
import { DataPreviewModal } from "@/app/_components/editor/data-preview-modal";
import { ChatInput } from "@/app/_components/editor/chat-input";
import {
  ChartSuggestions,
  type ChartSuggestion,
} from "@/app/_components/editor/chart-suggestions";
import { LiveChartPreview } from "@/app/_components/editor/live-chart-preview";
import { useChartSuggestions } from "@/app/_hooks/useChartSuggestions";
import { useFileManagement } from "@/app/_hooks/useFileManagement";
import { useChartGeneration } from "@/app/_hooks/useChartGeneration";

export default function EditorPage() {
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // ⭐ RAG-аас ирсэн active file
  const [activeFileFromRAG, setActiveFileFromRAG] = useState<UploadedFile | null>(null);

  const {
    files,
    selectedFileIds,
    handleUpload,
    handleRemove,
    handleFileToggle,
  } = useFileManagement();

  // Active file: RAG-аас ирсэн эсвэл хамгийн сүүлийнх
  const activeFile = activeFileFromRAG ?? files[files.length - 1] ?? null;

  const {
    suggestions,
    selectedSuggestion,
    setSelectedSuggestion,
    isGenerating,
  } = useChartSuggestions(activeFile);

  // ⭐ RAG Flow: files болон setActiveFile дамжуулах
  const { isChatLoading, handleChatSubmit } = useChartGeneration(
    files,
    setSelectedSuggestion,
    setActiveFileFromRAG
  );

  const handleView = useCallback((file: UploadedFile) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  }, []);

  const handleSuggestionSelect = useCallback(
    (suggestion: ChartSuggestion) => {
      setSelectedSuggestion(suggestion);
    },
    [setSelectedSuggestion]
  );

  const handleAxisChange = useCallback(
    (xAxis: string, yAxis: string) => {
      setSelectedSuggestion((prev) =>
        prev ? { ...prev, xAxis, yAxis } : prev
      );
    },
    [setSelectedSuggestion]
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
              onFileToggle={handleFileToggle}
              onUpload={handleUpload}
              onRemove={handleRemove}
              onView={handleView}
            />
          </div>

          <ChatInput
            onSubmit={handleChatSubmit}
            isLoading={isChatLoading}
            disabled={files.length === 0} // ⚠️ Файл байхгүй бол disabled
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

         <div className="flex-1 p-6">  {/* h-[500px] устгаад flex-1 болгох */}
    <div className="w-full h-full min-h-[400px]">  {/* h-full нэмэх */}
          <LiveChartPreview
            file={activeFile}
            suggestion={selectedSuggestion}
            isLoading={isGenerating || isChatLoading}
          />
        </div>
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
          suggestions={suggestions}
          selectedSuggestion={selectedSuggestion}
          onSelect={handleSuggestionSelect}
          onAxisChange={handleAxisChange}
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