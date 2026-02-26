// src/components/charts/EmbedModal.tsx
"use client";

import { useState } from "react";
import { Code2, Copy, Check, X, ExternalLink } from "lucide-react";

type EmbedModalProps = {
  title?: string;
  chartId?: string;
  onClose: () => void;
};

export function EmbedModal({
  title,
  chartId: chartIdProp,
  onClose,
}: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(500);
  const [bg, setBg] = useState("#0a0a0a");

  const baseUrl = "https://data-seven-black.vercel.app/embed/chart";
  const chartId =
    chartIdProp ??
    (title
      ? encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))
      : "chart");

  const embedUrl = `${baseUrl}/${chartId}?w=${width}&h=${height}&bg=${encodeURIComponent(
    bg
  )}`;

  const iframeCode = `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" style="border:0;" allowfullscreen></iframe>`;

  const copy = async () => {
    await navigator.clipboard.writeText(embedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyIframe = async () => {
    await navigator.clipboard.writeText(iframeCode);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              Embed & Share
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted text-muted-foreground transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Хэмжээ */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Хэмжээ</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Өргөн (px)
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-20 rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                Өндөр (px)
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-20 rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </label>
            </div>
          </div>

          {/* Арын өнгө */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">
              Арын өнгө
            </p>
            <div className="flex items-center gap-3">
              {["#0a0a0a", "#ffffff", "#1e1e2e", "#f8fafc", "transparent"].map(
                (color) => (
                  <button
                    key={color}
                    onClick={() => setBg(color)}
                    title={color}
                    className={`w-7 h-7 rounded-md border-2 transition ${
                      bg === color
                        ? "border-primary scale-110"
                        : "border-border"
                    }`}
                    style={{
                      backgroundColor:
                        color === "transparent" ? undefined : color,
                      backgroundImage:
                        color === "transparent"
                          ? "repeating-conic-gradient(#888 0% 25%, #444 0% 50%) 0 0 / 8px 8px"
                          : undefined,
                    }}
                  />
                )
              )}
              <input
                type="color"
                value={bg === "transparent" ? "#000000" : bg}
                onChange={(e) => setBg(e.target.value)}
                className="w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent"
                title="Өөрийн өнгө сонгох"
              />
            </div>
          </div>

          {/* Embed URL */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">
              Embed URL
              <span className="ml-2 text-muted-foreground font-normal">
                — Веб сайтад ашиглана
              </span>
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
              <code className="flex-1 text-xs text-foreground/80 truncate">
                {embedUrl}
              </code>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-background border border-border hover:bg-muted text-foreground transition shrink-0"
              >
                {copied ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <Copy size={12} />
                )}
                {copied ? "Хуулагдлаа!" : "Хуулах"}
              </button>
            </div>
          </div>

          {/* iFrame Code */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">
              iFrame Code
              <span className="ml-2 text-muted-foreground font-normal">
                — HTML сайт болон iframe дэмждэг орчинд ашиглана
              </span>
            </p>
            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
              <code className="flex-1 text-xs text-foreground/80 break-all">
                {iframeCode}
              </code>
              <button
                onClick={copyIframe}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-background border border-border hover:bg-muted text-foreground transition shrink-0"
              >
                {copiedIframe ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <Copy size={12} />
                )}
                {copiedIframe ? "Хуулагдлаа!" : "Хуулах"}
              </button>
            </div>
          </div>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            <ExternalLink size={12} />
            Preview нээх
          </a>
        </div>
      </div>
    </div>
  );
}
