"use client";

import { motion } from "framer-motion";
import { Settings, Download, Trash2 } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";

export function DataManagementSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl glass neon-border p-6"
    >
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" />
        Data Management
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <Label>Export Data</Label>
            <p className="text-sm text-muted-foreground">
              Download all your charts and data
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div>
            <Label className="text-destructive">Delete Account</Label>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all data
            </p>
          </div>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
