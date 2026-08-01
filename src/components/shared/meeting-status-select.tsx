"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateMeetingStatus } from "@/lib/actions/meetings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OPTIONS = [
  { value: "scheduled", label: "Agendada" },
  { value: "done", label: "Realizada" },
  { value: "canceled", label: "Cancelada" },
  { value: "no_show", label: "Não compareceu" },
];

export function MeetingStatusSelect({ meetingId, status }: { meetingId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status}
      disabled={isPending}
      onValueChange={(value) =>
        startTransition(async () => {
          try {
            await updateMeetingStatus({
              id: meetingId,
              status: value as "scheduled" | "done" | "canceled" | "no_show",
            });
          } catch {
            toast.error("Não foi possível alterar o status da reunião.");
          }
        })
      }
    >
      <SelectTrigger className="h-7 w-36 text-xs"><SelectValue /></SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
