import { cn } from "@/lib/utils";

const META: Record<string, { label: string; classes: string }> = {
  high: { label: "Alta", classes: "bg-destructive/10 text-destructive" },
  medium: { label: "Média", classes: "bg-warm/10 text-warm" },
  low: { label: "Baixa", classes: "bg-muted text-muted-foreground" },
};

export function TaskPriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const meta = META[priority] ?? META.medium;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", meta.classes, className)}>
      {meta.label}
    </span>
  );
}
