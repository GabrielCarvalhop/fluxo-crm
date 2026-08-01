"use client";

import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageCircle, Clock } from "lucide-react";
import { MoneyValue } from "@/components/shared/money-value";
import { TemperatureBadge, type Temperature } from "@/components/shared/temperature-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import { isOverdue, formatDateShort } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

export type PipelineLead = Database["public"]["Tables"]["leads"]["Row"] & {
  segment: { label: string } | null;
  source: { label: string } | null;
};

export function LeadCard({ lead }: { lead: PipelineLead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = isOverdue(lead.next_follow_up_at);
  const whatsappLink = buildWhatsAppLink(lead.whatsapp);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-lg border border-border bg-card p-2.5 shadow-sm",
        isDragging && "opacity-40"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab touch-none active:cursor-grabbing">
        <div className="flex items-start justify-between gap-2">
          <span className="truncate text-sm font-semibold text-foreground">{lead.company_name}</span>
          {lead.estimated_value !== null && <MoneyValue value={lead.estimated_value} className="shrink-0 text-xs text-muted-foreground" />}
        </div>
        <div className="mt-0.5 truncate text-xs text-text-subtle">
          {[lead.segment?.label, lead.city].filter(Boolean).join(" · ") || "—"}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <TemperatureBadge value={lead.temperature as Temperature} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-text-subtle">
          <span>Último contato: <RelativeTime iso={lead.last_contact_at} /></span>
        </div>
        {lead.next_action && (
          <div
            className={cn(
              "mt-1.5 flex items-center gap-1 rounded-md px-1.5 py-1 text-[11px]",
              overdue ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            )}
          >
            <Clock className="size-3 shrink-0" />
            <span className="truncate">
              {lead.next_action} · {formatDateShort(lead.next_follow_up_at)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2 hidden items-center gap-1 border-t border-border pt-2 group-hover:flex">
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <MessageCircle className="size-3" />
            WhatsApp
          </a>
        )}
        <Link
          href={`/leads/${lead.id}`}
          className="ml-auto flex h-6 items-center rounded-md px-1.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          Abrir →
        </Link>
      </div>
    </div>
  );
}
