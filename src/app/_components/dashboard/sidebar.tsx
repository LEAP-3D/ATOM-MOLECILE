"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, PenTool, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

import { SidebarHeader } from "./sidebar-header";
import { SidebarFooter } from "./sidebar-footer";

const navItems = [
  { label: "History", href: "/dashboard", icon: LayoutDashboard },
  { label: "Editor", href: "/editor", icon: PenTool },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(next));
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen glass-strong border-r border-border/50 z-40 flex flex-col"
    >
      {/* ✅ Header component */}
      <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleCollapse} />

      {/* Navigation (unchanged) */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive && "text-primary"
                )}
              />

              {!isCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ✅ Footer component */}
      <SidebarFooter isCollapsed={isCollapsed} />
    </motion.aside>
  );
}
