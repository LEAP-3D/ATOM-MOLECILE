"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Camera, Save, Shield } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";

type Props = {
  initialName: string;
  email: string;
  onSave?: (name: string) => Promise<void> | void;
};

export function ProfileSettingsCard({ initialName, email, onSave }: Props) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(name);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-xl glass neon-border p-6">
      <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Account Settings
      </h2>

      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-primary-foreground">
            {name.charAt(0)}
          </div>
          <button
            type="button"
            className="absolute inset-0 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <Camera className="h-6 w-6 text-foreground" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Click to change photo
        </p>
      </div>

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
          className="w-full bg-linear-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
        >
          {isSaving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
  );
}
