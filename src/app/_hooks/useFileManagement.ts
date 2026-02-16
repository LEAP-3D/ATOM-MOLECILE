// app/_hooks/useFileManagement.ts
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";

export function useFileManagement() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);

  // Fetch user files on mount
  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        setIsLoadingFiles(true);
        const response = await axios.get("/api/routes/files");

        if (response.data.success) {
          setFiles(response.data.files);

          // Auto-select first file
          if (response.data.files.length > 0) {
            const firstFileId = response.data.files[0].id;
            setSelectedFileIds(new Set([firstFileId]));
          }
        }
      } catch (error) {
        console.error("❌ Файл татахад алдаа:", error);
      } finally {
        setIsLoadingFiles(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchUserFiles();
  }, []);

  const handleUpload = useCallback((file: UploadedFile) => {
    setFiles((prev) => [...prev, file]);
    setSelectedFileIds((prev) => new Set(prev).add(file.id));
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
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  }, []);

  return {
    files,
    selectedFileIds,
    isLoadingFiles,
    handleUpload,
    handleRemove,
    handleFileToggle,
  };
}
