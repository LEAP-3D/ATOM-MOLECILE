"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  // Mail,
  Camera,
  Save,
  FileSpreadsheet,
  BarChart3,
  Trash2,
  Eye,
  // Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";

// Mock data for demonstration
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

const mockUploadedFiles = [
  {
    id: "1",
    name: "sales_data_2024.xlsx",
    uploadedAt: new Date("2024-01-15"),
    rows: 1250,
    columns: 8,
  },
  {
    id: "2",
    name: "customer_analytics.xlsx",
    uploadedAt: new Date("2024-01-10"),
    rows: 3420,
    columns: 12,
  },
];

export default function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email] = useState("john.doe@example.com");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
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
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="rounded-xl glass neon-border p-6">
            <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Settings
            </h2>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {name.charAt(0)}
                </div>
                <button className="absolute inset-0 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-6 w-6 text-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Click to change photo
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  Email
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Verified
                  </span>
                </Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="mt-1.5 opacity-60"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
              >
                {isSaving ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                  </motion.div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Saved Work */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Saved Charts */}
          <div className="rounded-xl glass neon-border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Saved Charts
            </h2>

            {mockSavedCharts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSavedCharts.map((chart, index) => (
                  <motion.div
                    key={chart.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    {/* Chart Thumbnail */}
                    <div className="h-20 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 mb-3 flex items-center justify-center">
                      <ChartThumbnail type={chart.thumbnail} />
                    </div>

                    <h3 className="font-medium text-sm truncate">
                      {chart.name}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      {/* <Calendar className="h-3 w-3" /> */}
                      {chart.createdAt.toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="flex-1 h-8">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No saved charts yet</p>
              </div>
            )}
          </div>

          {/* Uploaded Files */}
          <div className="rounded-xl glass neon-border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Uploaded Files
            </h2>

            {mockUploadedFiles.length > 0 ? (
              <div className="space-y-3">
                {mockUploadedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="group flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                      <FileSpreadsheet className="h-5 w-5 text-green-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {file.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {file.rows.toLocaleString()} rows • {file.columns}{" "}
                        columns
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {/* <Calendar className="h-3 w-3" /> */}
                      {file.uploadedAt.toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
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
        </motion.div>
      </div>
    </div>
  );
}

function ChartThumbnail({ type }: { type: string }) {
  switch (type) {
    case "bar":
      return (
        <div className="flex items-end gap-1 h-8">
          {[60, 80, 45, 70].map((h, i) => (
            <div
              key={i}
              className="w-3 bg-gradient-to-t from-primary to-primary/50 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );
    case "line":
      return (
        <svg viewBox="0 0 60 30" className="w-12 h-8">
          <path
            d="M0,25 L15,15 L30,20 L45,8 L60,12"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="2"
          />
        </svg>
      );
    case "pie":
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="8"
            strokeDasharray="47 94"
          />
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="hsl(var(--chart-4))"
            strokeWidth="8"
            strokeDasharray="30 94"
            strokeDashoffset="-47"
          />
        </svg>
      );
    default:
      return <BarChart3 className="h-8 w-8 text-muted-foreground" />;
  }
}
