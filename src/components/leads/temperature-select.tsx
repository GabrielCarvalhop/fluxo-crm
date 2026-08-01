"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setLeadTemperature } from "@/lib/actions/leads";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OPTIONS = [
  { value: "hot", label: "🔥 Quente" },
  { value: "warm", label: "🟡 Morno" },
  { value: "cold", label: "❄️ Frio" },
  { value: "none", label: "Sem classificação" },
];

export function TemperatureSelect({ leadId, temperature }: { leadId: string; temperature: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={temperature}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(async () => {
          try {
            await setLeadTemperature({ id: leadId, temperature: value as "hot" | "warm" | "cold" | "none" });
          } catch {
            toast.error("Não foi possível alterar a temperatura.");
          }
        })
      }
    >
      <SelectTrigger className="h-7 w-40 text-xs"><SelectValue /></SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
