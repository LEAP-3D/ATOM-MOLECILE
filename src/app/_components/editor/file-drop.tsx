"use client";
import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DropzoneProps = {
  onFileProcess: (file: File) => Promise<void>;
  isUploading: boolean;
};

export function Dropzone({ onFileProcess, isUploading }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items?.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files?.length > 0) {
        await onFileProcess(e.dataTransfer.files[0]);
      }
    },
    [onFileProcess]
  );

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await onFileProcess(files[0]);
    e.target.value = ""; // Reset input
  };

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border hover:border-primary/50 hover:bg-muted/30",
        isUploading && "opacity-50 pointer-events-none"
      )}
    >
      <input
        type="file"
        id="file-input"
        accept=".xlsx"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      <motion.div
        animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Upload
              className={cn(
                "h-6 w-6 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">
            {isUploading
              ? "Uploading..."
              : "Drag and drop your Excel file here"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click here to select a file (.xlsx)
          </p>
        </div>
      </motion.div>
    </div>
  );
}
