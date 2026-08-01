"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Conteúdo real vem do motor de atenção (lib/rules/attention.ts), montado
// junto com o Dashboard na Fatia 2 — depende de leads/follow-ups existirem.
export function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground" aria-label="Notificações">
          <Bell className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0">
        <div className="border-b border-border px-3 py-2.5 text-sm font-medium">Notificações</div>
        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
          Nada por aqui ainda.
        </div>
      </PopoverContent>
    </Popover>
  );
}
