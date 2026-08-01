import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientDetail } from "@/lib/queries/clients";
import { buildTimeline } from "@/lib/rules/timeline";
import { ClientHeader } from "@/components/clients/client-header";
import { Timeline } from "@/components/shared/timeline";
import { MoneyValue } from "@/components/shared/money-value";
import { ProjectStatusBadge } from "@/components/shared/project-status-badge";
import { TransactionStatusBadge } from "@/components/shared/transaction-status-badge";
import { formatDateShort } from "@/lib/utils/dates";
import { Separator } from "@/components/ui/separator";
import { FolderKanban } from "lucide-react";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getClientDetail(id);
  if (!detail.client) notFound();

  const timeline = buildTimeline(detail);

  return (
    <div className="flex h-full flex-col">
      <ClientHeader client={detail.client} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <section>
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <FolderKanban className="size-4" /> Projetos
              </h2>
              {detail.projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum projeto ainda.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {detail.projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/projects/${p.id}`}
                      className="flex items-center justify-between rounded-md border border-border p-3 text-sm hover:bg-accent/50"
                    >
                      <span className="font-medium text-foreground">{p.name}</span>
                      <ProjectStatusBadge status={p.status} />
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <Separator className="my-6" />

            <section>
              <h2 className="mb-3 text-sm font-medium text-foreground">Pagamentos</h2>
              {detail.transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum lançamento ainda.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {detail.transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between rounded-md border border-border p-2.5 text-sm">
                      <div>
                        <p className="text-foreground">{t.description}</p>
                        <p className="text-xs text-text-subtle">Venc.: {formatDateShort(t.due_date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoneyValue value={t.amount} className={t.kind === "expense" ? "text-destructive" : ""} />
                        <TransactionStatusBadge status={t.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div className="lg:w-96">
            <h2 className="mb-3 text-sm font-medium text-foreground">Histórico</h2>
            <Timeline events={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
