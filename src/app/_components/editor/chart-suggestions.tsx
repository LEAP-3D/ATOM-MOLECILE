"use client";
import type { UploadedFile } from "./excel-upload";

import { EmptyState } from "./empty-state";
import { SuggestionItem } from "./suggestion-item";
// import { AxisSelector } from "./axis-selector";

export type ChartSuggestion = {
  type: string;
  title: string;
  reason: string;
  xAxis: string;
  yAxis: string;
  data?: Record<string, unknown>[];
  confidence: number;
};

type ChartSuggestionsProps = {
  file: UploadedFile | null;
  suggestions: ChartSuggestion[];
  selectedSuggestion: ChartSuggestion | null;
  onSelect: (suggestion: ChartSuggestion) => void;
  onAxisChange: (xAxis: string, yAxis: string) => void;
};

export function ChartSuggestions({
  file,
  suggestions,
  selectedSuggestion,
  onSelect,
}: // onAxisChange,
ChartSuggestionsProps) {
  // Render Empty State: No file uploaded
  if (!file) {
    return (
      <EmptyState
        icon="file"
        title="No Data Uploaded"
        message="Upload an Excel file to receive intelligent chart suggestions."
      />
    );
  }

  // Render Loading State: Analyzing data
  if (suggestions.length === 0) {
    return (
      <EmptyState
        icon="loader"
        title="Analyzing Data..."
        message="We are analyzing your data to suggest the best chart types."
      />
    );
  }

  // Render Suggestions
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Chart Suggestions</h3>
        <p className="text-sm text-muted-foreground">
          Based on your data structure
        </p>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <SuggestionItem
            key={suggestion.type}
            suggestion={suggestion}
            isSelected={selectedSuggestion?.type === suggestion.type}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* {selectedSuggestion && file && (
        <AxisSelector
          file={file}
          selectedSuggestion={selectedSuggestion}
          onAxisChange={onAxisChange}
        />
      )} */}
    </div>
  );
}
