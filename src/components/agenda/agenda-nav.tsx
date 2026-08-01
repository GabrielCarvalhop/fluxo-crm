"use client";

import { useRouter } from "next/navigation";
import { addDays, addWeeks, addMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AgendaNav({ view, date }: { view: "day" | "week" | "month"; date: string }) {
  const router = useRouter();
  const current = new Date(date + "T12:00:00");

  function go(newDate: Date, newView: "day" | "week" | "month" = view) {
    router.push(`/agenda?view=${newView}&date=${format(newDate, "yyyy-MM-dd")}`);
  }

  function shift(dir: 1 | -1) {
    if (view === "day") return go(addDays(current, dir));
    if (view === "week") return go(addWeeks(current, dir));
    return go(addMonths(current, dir));
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        <Button variant="outline" size="icon-sm" onClick={() => shift(-1)} aria-label="Anterior">
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => go(new Date())}>Hoje</Button>
        <Button variant="outline" size="icon-sm" onClick={() => shift(1)} aria-label="Próximo">
          <ChevronRight className="size-4" />
        </Button>
        <span className="ml-2 text-sm font-medium text-foreground capitalize">
          {format(current, view === "day" ? "d 'de' MMMM, yyyy" : "MMMM 'de' yyyy", { locale: ptBR })}
        </span>
      </div>

      <Tabs value={view} onValueChange={(v) => go(current, v as "day" | "week" | "month")}>
        <TabsList>
          <TabsTrigger value="day">Dia</TabsTrigger>
          <TabsTrigger value="week">Semana</TabsTrigger>
          <TabsTrigger value="month">Mês</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
