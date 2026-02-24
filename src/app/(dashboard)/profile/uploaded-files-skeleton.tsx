"use client";

import { FileSpreadsheet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ITEMS = 6;

export function UploadedFilesSkeleton() {
  return (
    <div className="rounded-xl glass neon-border p-6">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-primary" />
        Uploaded Files
      </h2>

      <div className="space-y-3">
        {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
          >
            <Skeleton className="h-9 w-9 rounded-lg bg-muted/70" />

            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-2/3 bg-muted/70" />
              <Skeleton className="h-3 w-1/3 bg-muted/70" />
            </div>

            <Skeleton className="h-3 w-20 bg-muted/70" />

            <div className="flex items-center gap-1">
              <Skeleton className="h-7 w-7 rounded-md bg-muted/70" />
              <Skeleton className="h-7 w-7 rounded-md bg-muted/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
