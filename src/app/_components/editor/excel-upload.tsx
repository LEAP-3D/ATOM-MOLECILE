"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios";
import * as XLSX from "xlsx";
import { Notification } from "./upload-notification";
import { Dropzone } from "./file-drop";
import { UploadedFileItem } from "./uploaded-file-item";

export type UploadedFile = {
  id: string;
  name: string;
  uploadDate: Date;
  data: Record<string, unknown>[];
  columns: string[];
};

type ExcelUploadProps = {
  files: UploadedFile[];
  selectedFileIds: Set<string>;
  onUpload: (file: UploadedFile) => void;
  onRemove: (id: string) => void;
  onView: (file: UploadedFile) => void;
  onFileToggle: (fileId: string) => void;
};

export function ExcelUpload({
  files,
  selectedFileIds,
  onUpload,
  onRemove,
  onView,
  onFileToggle,
}: ExcelUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setMessage("Зөвхөн .xlsx эсвэл .xls файл сонгоно уу");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      // 1) Server рүү upload хийх (Prisma + Pinecone)
      const formData = new FormData();
      formData.append("files", file);
      const res = await axios.post("/api/routes/upload", formData);
      const serverMsg = res.data.message || "Амжилттай хадгалагдлаа!";

      // 2) Excel файлыг уншиж, өгөгдлийг задлах
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

      // 3) Uploaded file объект үүсгэх
      const uploadedFile: UploadedFile = {
        id: res.data.fileId || crypto.randomUUID(),
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
      setTimeout(() => setMessage(""), 4000);
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
            className="space-y-3"
          >
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
              Бүртгэгдсэн файлууд ({files.length})
            </p>

            <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1">
              {files.map((file) => {
                const isSelected = selectedFileIds.has(file.id);

                return (
                  <motion.div
                    key={file.id}
                    onClick={() => onFileToggle(file.id)}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "relative cursor-pointer rounded-xl border-2 transition-all duration-200 outline-none",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border hover:border-muted-foreground/30 bg-card"
                    )}
                  >
                    <div className="p-1">
                      <UploadedFileItem
                        file={file}
                        onView={(f) => {
                          onView(f);
                        }}
                        onRemove={(id) => {
                          onRemove(id);
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
