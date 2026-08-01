import { Skeleton } from "@/components/ui/skeleton";
import { StatCardsSkeleton, SectionSkeleton } from "@/components/shared/skeletons";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      <StatCardsSkeleton />
      <SectionSkeleton rows={5} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  );
}
