import { cn } from "@/lib/utils";

const META = {
  hot: { emoji: "🔥", label: "Quente", classes: "bg-hot/10 text-hot" },
  warm: { emoji: "🟡", label: "Morno", classes: "bg-warm/10 text-warm" },
  cold: { emoji: "❄️", label: "Frio", classes: "bg-cold/10 text-cold" },
  none: { emoji: null, label: "Sem classificação", classes: "bg-muted text-muted-foreground" },
} as const;

export type Temperature = keyof typeof META;

export function TemperatureBadge({ value, className }: { value: Temperature; className?: string }) {
  const meta = META[value];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        meta.classes,
        className
      )}
    >
      {meta.emoji && <span aria-hidden>{meta.emoji}</span>}
      {meta.label}
    </span>
  );
}
