import { cn } from "@/lib/utils";

export function StageBadge({
  label,
  color,
  className,
}: {
  label: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", className)}
      style={{ backgroundColor: `${color}1F`, color }}
    >
      {label}
    </span>
  );
}
