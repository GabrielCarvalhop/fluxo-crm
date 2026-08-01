import { formatMoney } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

export function MoneyValue({ value, className }: { value: number | string | null | undefined; className?: string }) {
  return <span className={cn("font-mono tabular-nums", className)}>{formatMoney(value)}</span>;
}
