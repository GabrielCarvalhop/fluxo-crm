"use client";

import { useTransition } from "react";
import { updateTransactionStatus } from "@/lib/actions/finance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TransactionStatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={status === "overdue" ? "pending" : status}
      disabled={isPending}
      onValueChange={(value) => startTransition(() => updateTransactionStatus({ id, status: value as "paid" | "pending" | "canceled" }))}
    >
      <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pendente</SelectItem>
        <SelectItem value="paid">Pago</SelectItem>
        <SelectItem value="canceled">Cancelado</SelectItem>
      </SelectContent>
    </Select>
  );
}
