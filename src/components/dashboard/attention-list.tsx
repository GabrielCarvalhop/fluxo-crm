import Link from "next/link";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { CheckCircle2 } from "lucide-react";
import type { AttentionItem } from "@/lib/rules/attention";
import { cn } from "@/lib/utils";

const ICON = { critical: AlertCircle, warning: AlertTriangle, info: Info };
const CLASSES = {
  critical: "text-destructive",
  warning: "text-warm",
  info: "text-cold",
};

export function AttentionList({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) {
    return <EmptyState icon={CheckCircle2} title="Tudo em dia" description="Nada precisa da sua atenção agora." />;
  }

  const visible = items.slice(0, 8);

  return (
    <div className="flex flex-col">
      {visible.map((item) => {
        const Icon = ICON[item.severity];
        return (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-start gap-2.5 border-b border-border px-4 py-2.5 text-sm last:border-0 hover:bg-accent/50"
          >
            <Icon className={cn("mt-0.5 size-4 shrink-0", CLASSES[item.severity])} />
            <span className="text-foreground">{item.title}</span>
          </Link>
        );
      })}
      {items.length > 8 && (
        <div className="px-4 py-2 text-xs text-text-subtle">+{items.length - 8} outros itens</div>
      )}
    </div>
  );
}
