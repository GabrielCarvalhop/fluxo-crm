import { notFound } from "next/navigation";
import { getLeadDetail } from "@/lib/queries/leads";
import { getReferenceData } from "@/lib/queries/reference";
import { buildTimeline } from "@/lib/rules/timeline";
import { LeadHeader } from "@/components/leads/lead-header";
import { LeadSidebar } from "@/components/leads/lead-sidebar";
import { Timeline } from "@/components/shared/timeline";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detail, ref] = await Promise.all([getLeadDetail(id), getReferenceData()]);

  if (!detail.lead) notFound();

  const timeline = buildTimeline(detail);

  return (
    <div className="flex h-full flex-col">
      <LeadHeader lead={detail.lead} lossReasons={ref.lossReasons} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="mb-4 text-sm font-medium text-foreground">Histórico</h2>
          <Timeline events={timeline} />
        </div>
        <div className="overflow-y-auto">
          <LeadSidebar
            lead={detail.lead}
            contacts={detail.contacts}
            notes={detail.notes}
            tags={detail.tags as { id: string; label: string }[]}
            followUps={detail.followUps}
            proposals={detail.proposals}
            allTags={ref.tags}
          />
        </div>
      </div>
    </div>
  );
}
