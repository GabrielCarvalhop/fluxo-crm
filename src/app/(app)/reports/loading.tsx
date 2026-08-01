import { Skeleton } from "@/components/ui/skeleton";
import { SectionSkeleton } from "@/components/shared/skeletons";

export default function ReportsLoading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <Skeleton className="h-5 w-32" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionSkeleton rows={5} />
        <SectionSkeleton rows={5} />
        <SectionSkeleton rows={5} />
        <SectionSkeleton rows={5} />
      </div>
      <SectionSkeleton rows={6} />
    </div>
  );
}
