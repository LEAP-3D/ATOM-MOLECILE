"use client";

import { motion } from "framer-motion";
import { ProfileSettingsCard } from "./profile-settings-card";
import { SavedChartsSection } from "./saved-charts-section";
import { UploadedFilesSection } from "./uploaded-files-section";
import { useFileManagement } from "@/app/_hooks/useFileManagement";
import { useCallback, useState } from "react";
import { DataPreviewModal } from "@/app/_components/editor/data-preview-modal";
import type { UploadedFile } from "@/app/_components/editor/excel-upload";

const mockSavedCharts = [
  {
    id: "1",
    name: "Q4 Sales Analysis",
    type: "bar",
    createdAt: new Date("2024-01-15"),
    thumbnail: "bar",
  },
  {
    id: "2",
    name: "Monthly Revenue Trends",
    type: "line",
    createdAt: new Date("2024-01-10"),
    thumbnail: "line",
  },
  {
    id: "3",
    name: "Market Share Distribution",
    type: "pie",
    createdAt: new Date("2024-01-05"),
    thumbnail: "pie",
  },
];

export default function ProfilePage() {
  const { files, handleUpload, handleRemove } = useFileManagement();
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
          Manage your account settings and view your saved work
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
          <SavedChartsSection charts={mockSavedCharts} />
          <UploadedFilesSection
            files={files}
            onUpload={handleUpload}
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
