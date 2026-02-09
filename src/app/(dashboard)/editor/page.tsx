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

export default function EditorPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const activeFile = files[files.length - 1] ?? null;

  const {
    suggestions,
    selectedSuggestion,
    setSelectedSuggestion,
    isGenerating,
  } = useChartSuggestions(activeFile);

  const handleUpload = useCallback((file: UploadedFile) => {
    setFiles((prev) => [...prev, file]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleView = useCallback((file: UploadedFile) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  }, []);

  const handleChatSubmit = useCallback((message: string) => {
    console.log("Chat message:", message);
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
            onUpload={handleUpload}
            onRemove={handleRemove}
            onView={handleView}
          />
          <ChatInput onSubmit={handleChatSubmit} disabled={!activeFile} />
        </div>
      </motion.div>

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
            suggestion={selectedSuggestion}
            isLoading={isGenerating}
          />
        </div>
      </motion.div>

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

      <DataPreviewModal
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
