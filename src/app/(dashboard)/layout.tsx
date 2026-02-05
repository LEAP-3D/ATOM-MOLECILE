"use client";

import React from "react";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "../_components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(260);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarWidth(JSON.parse(saved) ? 80 : 260);
    }

    const handleStorage = () => {
      const collapsed = localStorage.getItem("sidebar-collapsed");
      if (collapsed !== null) {
        setSidebarWidth(JSON.parse(collapsed) ? 80 : 260);
      }
    };

    window.addEventListener("storage", handleStorage);

    // Also listen for changes within the same tab
    const interval = setInterval(() => {
      const collapsed = localStorage.getItem("sidebar-collapsed");
      if (collapsed !== null) {
        const width = JSON.parse(collapsed) ? 80 : 260;
        if (width !== sidebarWidth) {
          setSidebarWidth(width);
        }
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [sidebarWidth]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
    </div>
  );
}
