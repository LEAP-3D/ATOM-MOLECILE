import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Badge } from "@/app/_components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { type SavedChartSummary } from "@/app/_lib/saved-charts";
import { SavedChartPreview, SavedChartPreviewSkeleton } from "./SavedChartPreview";

type ChartCardProps = {
  chart: SavedChartSummary;
  index: number;
  deletingId: string | null;
  onRequestDelete: (id: string) => void;
};

export function ChartCard({
  chart,
  index,
  deletingId,
  onRequestDelete,
}: ChartCardProps) {
  const router = useRouter();
  const isDeleting = deletingId === chart.id;
  const updatedAt = new Date(chart.updatedAt);
  const dateLabel = Number.isNaN(updatedAt.getTime())
    ? "-"
    : updatedAt.toLocaleDateString();

  const chartTypeLabel =
    chart.chartType.charAt(0).toUpperCase() + chart.chartType.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <Card className="h-full">
        <CardContent className="pt-6 pb-0">
          <SavedChartPreview type={chart.chartType} data={chart.chartData} />
        </CardContent>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-2 text-lg">
              {chart.title || "Untitled chart"}
            </CardTitle>
            <Badge variant="secondary">{chartTypeLabel}</Badge>
          </div>
          <CardDescription className="line-clamp-1">
            Updated {dateLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-1">
            Source: {chart.fileName}
          </p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button
            className="flex-1"
            onClick={() => router.push(`/editor?savedChartId=${chart.id}`)}
          >
            Open
          </Button>
          <Button
            variant="outline"
            onClick={() => onRequestDelete(chart.id)}
            disabled={isDeleting || !!deletingId}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {isDeleting ? "Deleting" : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function ChartCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="pt-6 pb-0">
        <SavedChartPreviewSkeleton />
      </CardContent>
      <CardHeader className="pb-4">
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-muted/50" />
          <div className="h-4 w-1/3 rounded bg-muted/50" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-4 w-2/3 rounded bg-muted/50" />
      </CardContent>
      <CardFooter className="gap-2">
        <div className="h-9 flex-1 rounded bg-muted/50" />
        <div className="h-9 w-20 rounded bg-muted/50" />
      </CardFooter>
    </Card>
  );
}
