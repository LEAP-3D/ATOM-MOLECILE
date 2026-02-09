"use client";

import { motion } from "framer-motion";
import { FileSpreadsheet, Eye, Trash2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";

export type UploadedFileRow = {
  id: string;
  name: string;
  uploadedAt: Date;
  rows: number;
  columns: number;
};

type Props = {
  files: UploadedFileRow[];
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function UploadedFilesSection({ files, onView, onDelete }: Props) {
  return (
    <div className="rounded-xl glass neon-border p-6">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-primary" />
        Uploaded Files
      </h2>

      {files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="group flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-linear-to-br from-green-500/20 to-emerald-500/20">
                <FileSpreadsheet className="h-5 w-5 text-green-500" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{file.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {file.rows.toLocaleString()} rows • {file.columns} columns
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                {file.uploadedAt.toLocaleDateString()}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onView?.(file.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete?.(file.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <FileSpreadsheet className="h-10 w-10 mx-auto mb-2 opacity-50" />
          <p>No uploaded files</p>
        </div>
      )}
    </div>
  );
}
