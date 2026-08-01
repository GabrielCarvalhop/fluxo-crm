import { relativeTime, formatDateTime } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";

export function RelativeTime({ iso, className }: { iso: string | null | undefined; className?: string }) {
  if (!iso) return <span className={className}>—</span>;
  return (
    <span title={formatDateTime(iso)} className={cn("tabular-nums", className)}>
      {relativeTime(iso)}
    </span>
  );
}
