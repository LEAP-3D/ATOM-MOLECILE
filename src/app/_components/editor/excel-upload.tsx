"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileSpreadsheet, Eye, Trash2, Loader2 } from "lucide-react";
import axios from "axios"; // Axios нэмэв
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export type UploadedFile = {
  id: string;
  name: string;
  uploadDate: Date;
  data: Record<string, unknown>[];
  columns: string[];
};

type ExcelUploadProps = {
  files: UploadedFile[];
  onUpload: (file: UploadedFile) => void;
  onRemove: (id: string) => void;
  onView: (file: UploadedFile) => void;
};

export function ExcelUpload({
  files,
  onUpload,
  onRemove,
  onView,
}: ExcelUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(""); // Мэдэгдэл харуулах хэсэг

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx")) {
      setMessage("Зөвхөн .xlsx файл сонгоно уу");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      // 1. Сервер рүү илгээх (Таны өгсөн логик)
      const formData = new FormData();
      formData.append("files", file);

      const res = await axios.post("/api/routes/upload", formData);
      const serverMsg = res.data.message || "Амжилттай хадгалагдлаа!";

      // 2. Файлыг дотооддоо боловсруулж JSON болгох (Client-side view)
      const XLSX = await import("xlsx");
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<
        string,
        unknown
      >[];

      if (jsonData.length === 0) {
        setMessage("Excel файл хоосон байна");
        setIsUploading(false);
        return;
      }

      const columns = Object.keys(jsonData[0] || {});

      const uploadedFile: UploadedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        uploadDate: new Date(),
        data: jsonData,
        columns,
      };

      onUpload(uploadedFile);
      setMessage(serverMsg);
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      // Алдааг барих хэсэг
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.error || "Сервер талд алдаа гарлаа");
      } else if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Тодорхойгүй алдаа гарлаа");
      }
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
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

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        await processFile(e.dataTransfer.files[0]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onUpload]
  );

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Мэдэгдэл харуулах */}
      {message && (
        <div
          className={cn(
            "p-2 text-sm rounded-md text-center animate-in fade-in zoom-in duration-300",
            message.includes("Амжилттай")
              ? "bg-green-500/10 text-green-500"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {message}
        </div>
      )}

      {/* Upload Zone */}
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
          <div className="p-3 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20">
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
                ? "Сервер рүү илгээж байна..."
                : "Excel файлаа энд чирч оруулна уу"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              эсвэл сонгох бол энд дарна уу (.xlsx)
            </p>
          </div>
        </motion.div>
      </div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Бүртгэгдсэн файлууд
            </p>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card group"
              >
                <div className="p-2 rounded-lg bg-green-500/10">
                  <FileSpreadsheet className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.data.length} мөр • {file.columns.length} багана
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onView(file)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onRemove(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
