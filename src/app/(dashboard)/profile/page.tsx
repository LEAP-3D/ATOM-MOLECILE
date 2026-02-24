"use client";

import { motion } from "framer-motion";
import { ProfileSettingsCard } from "./profile-settings-card";
import { UploadedFilesSection } from "./uploaded-files-section";
import { useFileManagement } from "@/app/_hooks/useFileManagement";
import { useCallback, useState } from "react";
import { DataPreviewModal } from "@/app/_components/editor/data-preview-modal";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";

export default function ProfilePage() {
  const { files, isLoadingFiles, filesError, retryFetchFiles, handleRemove } =
    useFileManagement();
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const handleView = useCallback((file: UploadedFile) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  }, []);
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Your <span className="gradient-text">Profile</span>
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and uploaded files
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <ProfileSettingsCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <UploadedFilesSection
            files={files}
            isLoading={isLoadingFiles}
            isError={filesError}
            onRetry={retryFetchFiles}
            // onUpload={handleUpload}
            onRemove={handleRemove}
            onView={handleView}
          />
          <DataPreviewModal
            file={previewFile}
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
          />
        </motion.div>
      </div>
    </div>
  );
}
