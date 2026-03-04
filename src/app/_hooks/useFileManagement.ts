// app/_hooks/useFileManagement.ts
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";

type FilesResponse = {
  success: boolean;
  files: UploadedFile[];
  error?: string;
};

export function useFileManagement() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [filesError, setFilesError] = useState<string | null>(null);

  const fetchUserFiles = useCallback(async () => {
    try {
      setIsLoadingFiles(true);
      setFilesError(null);
      const response = await axios.get<FilesResponse>("/api/routes/files");

      if (response.data.success) {
        setFiles(response.data.files);

        // Auto-select first file
        if (response.data.files.length > 0) {
          const firstFileId = response.data.files[0].id;
          setSelectedFileIds(new Set([firstFileId]));
        } else {
          setSelectedFileIds(new Set());
        }
        return;
      }

      setFilesError(response.data.error ?? "Failed to load uploaded files");
    } catch (error: unknown) {
      const message = (() => {
        if (!axios.isAxiosError(error)) {
          return "Failed to load uploaded files";
        }

        const payload = error.response?.data;
        const payloadMessage =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error?: unknown }).error === "string"
            ? (payload as { error: string }).error
            : undefined;

        return payloadMessage ?? error.message ?? "Failed to load uploaded files";
      })();

      setFilesError(message);
      console.error("❌ Файл татахад алдаа:", error);
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  // Fetch user files on mount
  useEffect(() => {
    void fetchUserFiles();
  }, [fetchUserFiles]);

  const handleUpload = useCallback((file: UploadedFile) => {
    setFiles((prev) => [...prev, file]);
    // Keep selection single: newly uploaded file becomes the only selected file.
    setSelectedFileIds(new Set([file.id]));
  }, []);

  const handleRemove = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/routes/files/${id}`);

      setFiles((prev) => prev.filter((f) => f.id !== id));
      setSelectedFileIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error("❌ Файл устгахад алдаа:", error);
    }
  }, []);

  const handleFileToggle = useCallback((fileId: string) => {
    setSelectedFileIds((prev) => {
      // Keep selection single: either select this file or clear selection.
      if (prev.has(fileId)) {
        return new Set();
      }
      return new Set([fileId]);
    });
  }, []);

  return {
    files,
    selectedFileIds,
    isLoadingFiles,
    filesError,
    retryFetchFiles: fetchUserFiles,
    handleUpload,
    handleRemove,
    handleFileToggle,
  };
}
