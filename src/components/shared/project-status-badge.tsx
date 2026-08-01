import { cn } from "@/lib/utils";

const LABEL: Record<string, string> = {
  briefing_pending: "Briefing pendente",
  awaiting_materials: "Aguardando materiais",
  planning: "Planejamento",
  design: "Design",
  development: "Desenvolvimento",
  internal_review: "Revisão interna",
  client_review: "Revisão cliente",
  awaiting_approval: "Aguardando aprovação",
  deploy: "Deploy",
  finished: "Finalizado",
  post_sale: "Pós-venda",
};

const CLASSES: Record<string, string> = {
  briefing_pending: "bg-muted text-muted-foreground",
  awaiting_materials: "bg-muted text-muted-foreground",
  planning: "bg-cold/10 text-cold",
  design: "bg-cold/10 text-cold",
  development: "bg-cold/10 text-cold",
  internal_review: "bg-warm/10 text-warm",
  client_review: "bg-warm/10 text-warm",
  awaiting_approval: "bg-warm/10 text-warm",
  deploy: "bg-hot/10 text-hot",
  finished: "bg-won/10 text-won",
  post_sale: "bg-won/10 text-won",
};

export function ProjectStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        CLASSES[status] ?? CLASSES.briefing_pending,
        className
      )}
    >
      {LABEL[status] ?? status}
    </span>
  );
}
