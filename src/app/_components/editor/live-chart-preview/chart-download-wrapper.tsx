"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

type Props = {
  title?: string;
  children: React.ReactNode;
};

export function ChartDownloadWrapper({ title, children }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: "#0a0a0a",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${title ?? "chart"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header — download товч энд */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-white">{title ?? "Chart Preview"}</h2>
        <button
          onClick={handleDownloadPng}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white transition"
        >
          <Download size={14} />
          PNG татах
        </button>
      </div>

      {/* Chart — зөвхөн энэ хэсэг screenshot авна */}
      <div ref={chartRef} className="p-4 bg-[#0a0a0a]">
        {children}
      </div>
    </div>
  );
}