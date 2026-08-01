import { PageHeaderSkeleton, RowsSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <PageHeaderSkeleton action />
      <RowsSkeleton />
    </div>
  );
}
