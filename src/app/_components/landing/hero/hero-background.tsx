"use client";

import { WavyBackground } from "@/components/ui/wavy-background";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroBackground() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const checkDark = (): boolean =>
      document.documentElement.classList.contains("dark");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(checkDark());

    const observer = new MutationObserver(() => {
      setIsDark(checkDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <WavyBackground
      key={isDark ? "dark" : "light"}
      backgroundFill={isDark ? "#050510" : "#ffffff"}
      colors={
        isDark
          ? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]
          : ["#93c5fd", "#a5b4fc", "#d8b4fe", "#f0abfc", "#67e8f9"]
      }
      waveOpacity={isDark ? 0.5 : 0.35}
      className="w-full h-full"
    >
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accent/20 rounded-full blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>
    </WavyBackground>
  );
}
