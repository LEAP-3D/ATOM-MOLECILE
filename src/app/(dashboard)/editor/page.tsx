"use client";

import { useState, useEffect, useCallback } from "react";
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

// Function to analyze data and generate chart suggestions
function analyzeData(file: UploadedFile): ChartSuggestion[] {
  const suggestions: ChartSuggestion[] = [];
  const { columns, data } = file;

  if (data.length === 0 || columns.length === 0) return suggestions;

  // Detect column types
  const columnTypes: Record<string, "numeric" | "categorical" | "date"> = {};

  columns.forEach((col) => {
    const sampleValues = data.slice(0, 10).map((row) => row[col]);
    const numericCount = sampleValues.filter((v) => !isNaN(Number(v))).length;
    const dateCount = sampleValues.filter(
      (v) => !isNaN(Date.parse(String(v)))
    ).length;

    if (numericCount > 7) {
      columnTypes[col] = "numeric";
    } else if (dateCount > 7) {
      columnTypes[col] = "date";
    } else {
      columnTypes[col] = "categorical";
    }
  });

  const numericCols = columns.filter((c) => columnTypes[c] === "numeric");
  const categoricalCols = columns.filter(
    (c) => columnTypes[c] === "categorical"
  );
  const dateCols = columns.filter((c) => columnTypes[c] === "date");

  // Bar chart for categorical vs numeric
  if (categoricalCols.length > 0 && numericCols.length > 0) {
    suggestions.push({
      type: "bar",
      title: "Bar Chart",
      reason: `Compare ${numericCols[0]} across different ${categoricalCols[0]} categories`,
      xAxis: categoricalCols[0],
      yAxis: numericCols[0],
      confidence: 0.92,
    });
  }

  // Line chart for date/time series
  if (dateCols.length > 0 && numericCols.length > 0) {
    suggestions.push({
      type: "line",
      title: "Line Chart",
      reason: `Track ${numericCols[0]} trends over time using ${dateCols[0]}`,
      xAxis: dateCols[0],
      yAxis: numericCols[0],
      confidence: 0.88,
    });
  } else if (columns.length >= 2) {
    suggestions.push({
      type: "line",
      title: "Line Chart",
      reason: `Show progression of ${numericCols[0] || columns[1]} over ${
        columns[0]
      }`,
      xAxis: columns[0],
      yAxis: numericCols[0] || columns[1],
      confidence: 0.75,
    });
  }

  // Area chart
  if (numericCols.length > 0) {
    suggestions.push({
      type: "area",
      title: "Area Chart",
      reason: `Visualize cumulative ${numericCols[0]} with filled area`,
      xAxis: categoricalCols[0] || columns[0],
      yAxis: numericCols[0],
      confidence: 0.82,
    });
  }

  // Pie chart for proportions
  if (
    categoricalCols.length > 0 &&
    numericCols.length > 0 &&
    data.length <= 10
  ) {
    suggestions.push({
      type: "pie",
      title: "Pie Chart",
      reason: `Show proportion of ${numericCols[0]} by ${categoricalCols[0]}`,
      xAxis: categoricalCols[0],
      yAxis: numericCols[0],
      confidence: 0.85,
    });
  }

  // Scatter plot for correlation
  if (numericCols.length >= 2) {
    suggestions.push({
      type: "scatter",
      title: "Scatter Plot",
      reason: `Explore correlation between ${numericCols[0]} and ${numericCols[1]}`,
      xAxis: numericCols[0],
      yAxis: numericCols[1],
      confidence: 0.78,
    });
  }

  // Sort by confidence
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

export default function EditorPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<ChartSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<ChartSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeFile = files[files.length - 1] || null;

  // Generate suggestions when a file is uploaded
  useEffect(() => {
    if (activeFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsGenerating(true);
      // Simulate AI processing delay
      const timeout = setTimeout(() => {
        const newSuggestions = analyzeData(activeFile);
        setSuggestions(newSuggestions);
        if (newSuggestions.length > 0) {
          setSelectedSuggestion(newSuggestions[0]);
        }
        setIsGenerating(false);
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      setSuggestions([]);
      setSelectedSuggestion(null);
    }
  }, [activeFile]);

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
    // In a real app, this would trigger AI analysis
  }, []);

  const handleSuggestionSelect = useCallback((suggestion: ChartSuggestion) => {
    setSelectedSuggestion(suggestion);
  }, []);

  const handleAxisChange = useCallback(
    (xAxis: string, yAxis: string) => {
      if (selectedSuggestion) {
        setSelectedSuggestion({
          ...selectedSuggestion,
          xAxis,
          yAxis,
        });
      }
    },
    [selectedSuggestion]
  );

  return (
    <div className="h-screen flex">
      {/* Left Sidebar - Upload & Chat */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 flex-shrink-0 border-r border-border/50 glass-strong flex flex-col"
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

      {/* Main Content - Chart Preview */}
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

      {/* Right Sidebar - Suggestions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-80 flex-shrink-0 border-l border-border/50 glass-strong"
      >
        <ChartSuggestions
          file={activeFile}
          suggestions={suggestions}
          selectedSuggestion={selectedSuggestion}
          onSelect={handleSuggestionSelect}
          onAxisChange={handleAxisChange}
        />
      </motion.div>

      {/* Data Preview Modal */}
      <DataPreviewModal
        file={previewFile}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
