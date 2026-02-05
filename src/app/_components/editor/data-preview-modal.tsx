"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import type { UploadedFile } from "./excel-upload";

type DataPreviewModalProps = {
  file: UploadedFile | null;
  isOpen: boolean;
  onClose: () => void;
};

export function DataPreviewModal({
  file,
  isOpen,
  onClose,
}: DataPreviewModalProps) {
  if (!file) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 flex flex-col glass-strong rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div>
                <h2 className="text-lg font-semibold">{file.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {file.data.length} rows • {file.columns.length} columns
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted/80 backdrop-blur-sm">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 w-12">
                      #
                    </th>
                    {file.columns.map((column) => (
                      <th
                        key={column}
                        className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 whitespace-nowrap"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {file.data.slice(0, 100).map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2 text-sm text-muted-foreground">
                        {rowIndex + 1}
                      </td>
                      {file.columns.map((column) => (
                        <td
                          key={column}
                          className="px-4 py-2 text-sm whitespace-nowrap"
                        >
                          {String(row[column] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {file.data.length > 100 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Showing first 100 rows of {file.data.length} total
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
