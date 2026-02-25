// src/components/charts/ChartDownloadWrapper.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Code2 } from "lucide-react";
import { useTheme } from "next-themes";
import { EmbedModal } from "./EmbedModal";

type Props = {
  title?: string;
  children: React.ReactNode;
  chartId?: string;
};

export function ChartDownloadWrapper({ title, chartId, children }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [showEmbed, setShowEmbed] = useState(false);

  const isDark = resolvedTheme === "dark";
  const bg = isDark ? "#0a0a0a" : "#ffffff";

  const handleDownloadPng = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: bg,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${title ?? "chart"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, [bg, title]);

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <h2 className="text-sm font-semibold px-2 text-foreground">
            {title ?? "Chart Preview"}
          </h2>
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={() => setShowEmbed(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-muted hover:bg-muted/80 text-foreground transition"
            >
              <Code2 size={14} />
              Embed
            </button>
            <button
              onClick={handleDownloadPng}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-muted hover:bg-muted/80 text-foreground transition"
            >
              <Download size={14} />
              PNG татах
            </button>
          </div>
        </div>

        <div ref={chartRef} className="px-2 py-2 w-full" style={{ backgroundColor: bg }}>
          {children}
        </div>
      </div>

      {showEmbed && (
        <EmbedModal
          title={title}
          chartId={chartId}
          onClose={() => setShowEmbed(false)}
        />
      )}
    </>
  );
}


