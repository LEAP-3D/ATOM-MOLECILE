"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import * as XLSX from "xlsx";

// Components
import { Notification } from "./upload-notification";
import { Dropzone } from "./file-drop";
import { UploadedFileItem } from "./uploaded-file-item";

// It's good practice to move shared types to a separate file, e.g., `types.ts`
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
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx")) {
      setMessage("Зөвхөн .xlsx файл сонгоно уу");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await axios.post("/api/routes/upload", formData);
      const serverMsg = res.data.message || "Амжилттай хадгалагдлаа!";

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<
        string,
        unknown
      >[];

      if (jsonData.length === 0) {
        throw new Error("Excel файл хоосон байна");
      }

      const uploadedFile: UploadedFile = {
        id: crypto.randomUUID(),
        name: file.name,
        uploadDate: new Date(),
        data: jsonData,
        columns: Object.keys(jsonData[0] || {}),
      };

      onUpload(uploadedFile);
      setMessage(serverMsg);
    } catch (err: unknown) {
      const errorMsg = axios.isAxiosError(err)
        ? err.response?.data?.error || "Сервер талд алдаа гарлаа"
        : err instanceof Error
          ? err.message
          : "Тодорхойгүй алдаа гарлаа";
      setMessage(errorMsg);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {message && <Notification message={message} />}

      <Dropzone onFileProcess={processFile} isUploading={isUploading} />

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
              <UploadedFileItem
                key={file.id}
                file={file}
                onView={onView}
                onRemove={onRemove}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
