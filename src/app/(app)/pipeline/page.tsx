import { Suspense } from "react";
import { getPipelineBoard } from "@/lib/queries/leads";
import { getReferenceData } from "@/lib/queries/reference";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { NewLeadDialog } from "@/components/leads/new-lead-dialog";

export default async function PipelinePage() {
  const [{ stages, leads }, ref] = await Promise.all([getPipelineBoard(), getReferenceData()]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="text-base font-medium text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground">{leads.length} leads ativos</p>
        </div>
        <Suspense>
          <NewLeadDialog segments={ref.segments} sources={ref.sources} />
        </Suspense>
      </div>
      <div className="min-h-0 flex-1">
        <PipelineBoard stages={stages} leads={leads} />
      </div>
    </div>
  );
}
