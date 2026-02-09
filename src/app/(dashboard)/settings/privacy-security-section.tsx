"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";

export function PrivacySecuritySection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl glass neon-border p-6"
    >
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        Privacy &amp; Security
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
          <div>
            <Label>Active Sessions</Label>
            <p className="text-sm text-muted-foreground">
              Manage devices where you are logged in
            </p>
          </div>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
