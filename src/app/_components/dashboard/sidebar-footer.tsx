"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type SidebarFooterProps = {
  isCollapsed: boolean;
};

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // ✅ SSR + эхний client render: яг ижил HTML
  if (!mounted) {
    return <div className="p-3 border-t border-border/50 space-y-1" />;
  }

  const isDark = resolvedTheme === "dark";
  return (
    <div className="p-3 border-t border-border/50 space-y-1">
      {/* Theme toggle */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5" />
        )}

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Sign out */}
      <Link
        href="/"
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="h-5 w-5" />

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              Sign Out
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </div>
  );
}
