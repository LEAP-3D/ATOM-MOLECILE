"use client";

import { useCallback, useEffect, useState } from "react";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";
import type { ChartSuggestion } from "../_components/editor/chart-suggestions/chart-types";
import { analyzeData } from "@/app/_lib/analyze-data";

export function useChartSuggestions(activeFile: UploadedFile | null) {
  const [suggestions, setSuggestions] = useState<ChartSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<ChartSuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const upsertGeneratedSuggestion = useCallback(
    (suggestion: ChartSuggestion) => {
      setSuggestions((prev) => {
        const filtered = prev.filter((item) => item.type !== suggestion.type);
        return [suggestion, ...filtered];
      });
      setSelectedSuggestion(suggestion);
    },
    []
  );

  useEffect(() => {
    if (!activeFile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      setSelectedSuggestion(null);
      setIsGenerating(false);
      return;
    }

    setIsGenerating(true);

    const timeout = setTimeout(() => {
      const newSuggestions = analyzeData(activeFile);
      setSuggestions(newSuggestions);
      setSelectedSuggestion(newSuggestions[0] ?? null);
      setIsGenerating(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [activeFile]);

  return {
    suggestions,
    selectedSuggestion,
    setSelectedSuggestion,
    upsertGeneratedSuggestion,
    isGenerating,
  };
}
