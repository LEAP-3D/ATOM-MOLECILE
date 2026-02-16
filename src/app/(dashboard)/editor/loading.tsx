import { Skeleton } from "@/components/ui/skeleton";

export default function EditorLoading() {
  return (
    <div className="h-screen flex">
      <div className="w-80 shrink-0 border-r border-border/50 glass-strong flex flex-col">
        <div className="p-4 border-b border-border/50">
          <Skeleton className="h-7 w-28 rounded-md" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-14 w-full rounded-md" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-24 w-full rounded-md" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-border/50">
          <Skeleton className="h-7 w-36 rounded-md" />
        </div>

        <div className="flex-1 p-4">
          <div className="h-full rounded-lg border border-border/50 p-4 space-y-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-[55%] w-full rounded-md" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 shrink-0 border-l border-border/50 glass-strong">
        <div className="p-4 border-b border-border/50">
          <Skeleton className="h-7 w-40 rounded-md" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
