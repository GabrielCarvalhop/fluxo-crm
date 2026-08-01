import { notFound } from "next/navigation";
import { getProjectDetail } from "@/lib/queries/projects";
import { buildTimeline } from "@/lib/rules/timeline";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectChecklist } from "@/components/projects/project-checklist";
import { BriefingForm } from "@/components/projects/briefing-form";
import { DomainForm } from "@/components/projects/domain-form";
import { Timeline } from "@/components/shared/timeline";
import { MoneyValue } from "@/components/shared/money-value";
import { TransactionStatusBadge } from "@/components/shared/transaction-status-badge";
import { formatDateShort } from "@/lib/utils/dates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProjectDetail(id);
  if (!detail.project) notFound();

  const timeline = buildTimeline({ notes: detail.notes });

  return (
    <div className="flex h-full flex-col">
      <ProjectHeader project={detail.project} progress={detail.progress} />
      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="checklist">
          <TabsList>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="briefing">Briefing</TabsTrigger>
            <TabsTrigger value="domain">Domínio &amp; Hospedagem</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="pt-4">
            <ProjectChecklist projectId={detail.project.id} clientId={detail.project.client_id} groups={detail.checklistGroups} />
          </TabsContent>

          <TabsContent value="briefing" className="pt-4">
            <BriefingForm projectId={detail.project.id} briefing={detail.briefing} />
          </TabsContent>

          <TabsContent value="domain" className="pt-4">
            <DomainForm projectId={detail.project.id} domain={detail.domain} />
          </TabsContent>

          <TabsContent value="finance" className="pt-4">
            {detail.transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum lançamento neste projeto ainda.</p>
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
          </TabsContent>

          <TabsContent value="history" className="pt-4">
            <Timeline events={timeline} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
