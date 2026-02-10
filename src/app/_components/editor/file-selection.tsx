// app/_components/editor/file-selection.tsx
"use client";

import { motion } from "framer-motion";
import type { UploadedFile } from "./excel-upload";

type FileSelectionProps = {
  files: UploadedFile[];
  selectedFileIds: Set<string>;
  onFileToggle: (fileId: string) => void;
  isLoading?: boolean;
};

export function FileSelection({
  files,
  selectedFileIds,
  onFileToggle,
  isLoading,
}: FileSelectionProps) {
  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Файлууд уншиж байна...</p>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 pt-4 border-t border-border/50"
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Chart үүсгэх файлууд
      </p>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {files.map((file) => (
          <label
            key={file.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedFileIds.has(file.id)}
              onChange={() => onFileToggle(file.id)}
              className="w-4 h-4 rounded border-border accent-primary"
            />
            <span className="text-sm flex-1 truncate" title={file.name}>
              {file.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {file.data.length} мөр
            </span>
          </label>
        ))}
      </div>
    </motion.div>
  );
}