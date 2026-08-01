"use client";

import { useTransition } from "react";
import { updateProposalStatus } from "@/lib/actions/proposals";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUSES = [
  { value: "draft", label: "Rascunho" },
  { value: "sent", label: "Enviada" },
  { value: "viewed", label: "Visualizada" },
  { value: "negotiation", label: "Negociação" },
  { value: "accepted", label: "Aceita" },
  { value: "rejected", label: "Recusada" },
];

export function ProposalStatusSelect({ proposalId, status }: { proposalId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status === "expired" ? "sent" : status}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(() =>
          updateProposalStatus({
            id: proposalId,
            status: value as "draft" | "sent" | "viewed" | "negotiation" | "accepted" | "rejected",
          })
        )
      }
    >
      <SelectTrigger className="h-7 w-36 text-xs"><SelectValue /></SelectTrigger>
      <SelectContent>
        {STATUSES.map((s) => (
          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
