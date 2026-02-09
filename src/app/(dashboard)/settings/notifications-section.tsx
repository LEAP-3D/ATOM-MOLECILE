"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Switch } from "@/app/_components/ui/switch";
import { Label } from "@/app/_components/ui/label";

export type NotificationSettings = {
  email: boolean;
  push: boolean;
  updates: boolean;
};

type Props = {
  value: NotificationSettings;
  onChange: (next: NotificationSettings) => void;
};

export function NotificationsSection({ value, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl glass neon-border p-6"
    >
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        Notifications
      </h2>

      <div className="space-y-4">
        <Row
          title="Email Notifications"
          desc="Receive updates about your charts via email"
          checked={value.email}
          onCheckedChange={(checked) => onChange({ ...value, email: checked })}
        />
        <Row
          title="Push Notifications"
          desc="Get notified in your browser"
          checked={value.push}
          onCheckedChange={(checked) => onChange({ ...value, push: checked })}
        />
        <Row
          title="Product Updates"
          desc="News about new features and improvements"
          checked={value.updates}
          onCheckedChange={(checked) =>
            onChange({ ...value, updates: checked })
          }
        />
      </div>
    </motion.div>
  );
}

function Row({
  title,
  desc,
  checked,
  onCheckedChange,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label>{title}</Label>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
