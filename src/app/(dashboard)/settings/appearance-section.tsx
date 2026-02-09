"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Palette, Moon, Sun, Monitor } from "lucide-react";
import { Label } from "@/app/_components/ui/label";

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl glass neon-border p-6"
    >
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Palette className="h-5 w-5 text-primary" />
        Appearance
      </h2>

      <div className="space-y-4">
        <div>
          <Label className="mb-3 block">Theme</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
              { value: "system", icon: Monitor, label: "System" },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-muted/30"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mx-auto mb-2 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
