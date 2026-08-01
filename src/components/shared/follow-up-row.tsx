"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Check, Clock, MessageCircle } from "lucide-react";
import { completeFollowUp, snoozeFollowUp } from "@/lib/actions/follow-ups";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import { formatDateShort, isOverdue } from "@/lib/utils/dates";
import { cn } from "@/lib/utils";

export type FollowUpItem = {
  id: string;
  title: string;
  due_at: string;
  lead_id: string | null;
  client_id: string | null;
  entityName: string;
  entityHref: string;
  whatsapp: string | null;
};

export function FollowUpRow({ item, showEntity = true }: { item: FollowUpItem; showEntity?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const hasSchedule = Boolean(item.due_at);
  const overdue = hasSchedule && isOverdue(item.due_at);
  const whatsappLink = buildWhatsAppLink(item.whatsapp);

  function snooze(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    startTransition(() => snoozeFollowUp(item.id, d.toISOString()));
  }

  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0">
      <div className="min-w-0 flex-1">
        {showEntity && (
          <Link href={item.entityHref} className="block truncate text-sm font-medium text-foreground hover:underline">
            {item.entityName}
          </Link>
        )}
        <p className="truncate text-sm text-muted-foreground">{item.title}</p>
        {hasSchedule && (
          <p className={cn("mt-0.5 flex items-center gap-1 text-xs", overdue ? "text-destructive" : "text-text-subtle")}>
            <Clock className="size-3" />
            {formatDateShort(item.due_at)}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {whatsappLink && (
          <Button variant="ghost" size="icon-sm" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle className="size-3.5" />
            </a>
          </Button>
        )}
        {hasSchedule ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isPending}>Adiar</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => snooze(1)}>Adiar 1 dia</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => snooze(3)}>Adiar 3 dias</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => snooze(7)}>Adiar 1 semana</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              onClick={() => startTransition(() => completeFollowUp(item.id))}
              aria-label="Concluir"
            >
              <Check className="size-3.5" />
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" asChild>
            <Link href={item.entityHref}>Definir follow-up →</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
