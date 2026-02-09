import { BarChart3 } from "lucide-react";

export function ChartThumbnail({ type }: { type: string }) {
  switch (type) {
    case "bar":
      return (
        <div className="flex items-end gap-1 h-8">
          {[60, 80, 45, 70].map((h, i) => (
            <div
              key={i}
              className="w-3 bg-linear-to-t from-primary to-primary/50 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      );
    case "line":
      return (
        <svg viewBox="0 0 60 30" className="w-12 h-8">
          <path
            d="M0,25 L15,15 L30,20 L45,8 L60,12"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="2"
          />
        </svg>
      );
    case "pie":
      return (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="hsl(var(--accent))"
            strokeWidth="8"
            strokeDasharray="47 94"
          />
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="hsl(var(--chart-4))"
            strokeWidth="8"
            strokeDasharray="30 94"
            strokeDashoffset="-47"
          />
        </svg>
      );
    default:
      return <BarChart3 className="h-8 w-8 text-muted-foreground" />;
  }
}
