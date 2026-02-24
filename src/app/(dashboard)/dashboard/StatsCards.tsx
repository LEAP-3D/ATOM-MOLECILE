"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Stats = {
  chartsCreated: number;
  filesUploaded: number;
};

export function StatsCards() {
  const [stats, setStats] = useState<Stats>({
    chartsCreated: 0,
    filesUploaded: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = (await res.json()) as Stats;
        if (mounted) setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    void run();
    return () => {
      mounted = false;
    };
  }, []);

  const cards = [
    { label: "Charts Created", value: stats.chartsCreated },
    { label: "Files Uploaded", value: stats.filesUploaded },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8"
    >
      {cards.map((stat) => (
        <div
          key={stat.label}
          className="p-4 rounded-xl glass neon-border text-center"
        >
          <div className="text-2xl font-bold gradient-text">
            {isLoading ? "—" : stat.value.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
}
