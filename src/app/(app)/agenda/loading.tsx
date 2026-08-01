import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton } from "@/components/shared/skeletons";

export default function AgendaLoading() {
  return (
    <div className="flex h-full flex-col">
      <PageHeaderSkeleton />
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>
      <div className="grid grid-cols-7 gap-px bg-border">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex min-h-64 flex-col gap-2 bg-background p-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-5 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
