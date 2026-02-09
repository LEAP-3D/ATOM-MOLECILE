"use client";
import { motion } from "framer-motion";
type Props = {
  chartType: string;
  gradient: string;
};
export function MiniChartPreview({ chartType, gradient }: Props) {
  const gradientClass = gradient.split(" ")[0].replace("from-", "");
  switch (chartType) {
    case "bar":
      return (
        <div className="flex items-end gap-2 h-20">
          {[60, 80, 45, 90, 70].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
              className={`w-6 rounded-t bg-gradient-to-t ${gradient}`}
            />
          ))}
        </div>
      );
    case "line":
      return (
        <svg viewBox="0 0 100 50" className="w-full h-20">
          <motion.path
            d="M0,40 L20,30 L40,35 L60,15 L80,25 L100,10"
            fill="none"
            stroke={`hsl(var(--${
              gradientClass === "primary"
                ? "primary"
                : gradientClass === "secondary"
                ? "secondary"
                : "accent"
            }))`}
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      );
    case "area":
      return (
        <svg viewBox="0 0 100 50" className="w-full h-20">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0.5"
              />
              <stop
                offset="100%"
                stopColor="hsl(var(--primary))"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,50 L0,40 L20,30 L40,35 L60,15 L80,25 L100,10 L100,50 Z"
            fill="url(#areaGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.path
            d="M0,40 L20,30 L40,35 L60,15 L80,25 L100,10"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      );
    case "pie":
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16">
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="20"
            strokeDasharray="125.6 251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="20"
            strokeDasharray="75.4 251.2"
            strokeDashoffset="-125.6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="20"
            strokeDasharray="50.2 251.2"
            strokeDashoffset="-201"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
        </svg>
      );
    case "scatter":
      return (
        <div className="relative w-full h-20">
          {[
            { x: 10, y: 30 },
            { x: 25, y: 60 },
            { x: 40, y: 20 },
            { x: 55, y: 45 },
            { x: 70, y: 35 },
            { x: 85, y: 55 },
          ].map((point, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className={`absolute w-3 h-3 rounded-full bg-gradient-to-br ${gradient}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            />
          ))}
        </div>
      );
    case "map":
      return (
        <div className="relative w-full h-20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-16 h-12 rounded bg-gradient-to-br ${gradient} opacity-30`}
          />
          {[
            { x: 20, y: 30 },
            { x: 50, y: 50 },
            { x: 70, y: 25 },
          ].map((point, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
              className={`absolute w-2 h-2 rounded-full bg-gradient-to-br ${gradient}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
            />
          ))}
        </div>
      );
    default:
      return (
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} opacity-50`}
        />
      );
  }
}
