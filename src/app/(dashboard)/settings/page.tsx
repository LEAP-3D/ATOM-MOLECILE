"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AppearanceSection } from "./appearance-section";
import {
  NotificationsSection,
  type NotificationSettings,
} from "./notifications-section";
import { PrivacySecuritySection } from "./privacy-security-section";
import { DataManagementSection } from "./data-management-section";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    updates: true,
  });

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-muted-foreground">
          Customize your DataViz Studio experience
        </p>
      </motion.div>

      <div className="space-y-6">
        <AppearanceSection />

        <NotificationsSection
          value={notifications}
          onChange={setNotifications}
        />

        <PrivacySecuritySection />

        <DataManagementSection />
      </div>
    </div>
  );
}
