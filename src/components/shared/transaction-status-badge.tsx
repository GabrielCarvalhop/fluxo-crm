import { cn } from "@/lib/utils";

const META: Record<string, { label: string; classes: string }> = {
  paid: { label: "Pago", classes: "bg-won/10 text-won" },
  pending: { label: "Pendente", classes: "bg-warm/10 text-warm" },
  overdue: { label: "Atrasado", classes: "bg-destructive/10 text-destructive" },
  canceled: { label: "Cancelado", classes: "bg-muted text-muted-foreground" },
};

export function TransactionStatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = META[status] ?? META.pending;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", meta.classes, className)}>
      {meta.label}
    </span>
  );
}
