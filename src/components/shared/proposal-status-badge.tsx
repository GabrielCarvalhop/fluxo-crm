import { cn } from "@/lib/utils";

const META: Record<string, { label: string; classes: string }> = {
  draft: { label: "Rascunho", classes: "bg-muted text-muted-foreground" },
  sent: { label: "Enviada", classes: "bg-cold/10 text-cold" },
  viewed: { label: "Visualizada", classes: "bg-cold/10 text-cold" },
  negotiation: { label: "Negociação", classes: "bg-warm/10 text-warm" },
  accepted: { label: "Aceita", classes: "bg-won/10 text-won" },
  rejected: { label: "Recusada", classes: "bg-lost/10 text-lost" },
  expired: { label: "Expirada", classes: "bg-destructive/10 text-destructive" },
};

export function ProposalStatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = META[status] ?? META.draft;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", meta.classes, className)}>
      {meta.label}
    </span>
  );
}
