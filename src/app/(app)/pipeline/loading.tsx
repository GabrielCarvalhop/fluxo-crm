import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton } from "@/components/shared/skeletons";

export default function PipelineLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border">
        <PageHeaderSkeleton action />
      </div>
      <div className="flex gap-3 overflow-hidden p-4">
        {Array.from({ length: 6 }).map((_, col) => (
          <div key={col} className="flex w-72 shrink-0 flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-4 w-6" />
            </div>
            <Skeleton className="mx-1 h-4 w-20" />
            {Array.from({ length: 3 - (col % 3) }).map((_, card) => (
              <Skeleton key={card} className="h-24 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
