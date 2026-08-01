import { Suspense } from "react";
import Link from "next/link";
import { getProjectsList } from "@/lib/queries/projects";
import { getClientsList } from "@/lib/queries/clients";
import { NewProjectDialog } from "@/components/projects/new-project-dialog";
import { ProjectStatusBadge } from "@/components/shared/project-status-badge";
import { MoneyValue } from "@/components/shared/money-value";
import { EmptyState } from "@/components/shared/empty-state";
import { Progress } from "@/components/ui/progress";
import { FolderKanban } from "lucide-react";

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([getProjectsList(), getClientsList()]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-base font-medium text-foreground">Projetos</h1>
          <p className="text-sm text-muted-foreground">{projects.length} no total</p>
        </div>
        <Suspense>
          <NewProjectDialog clients={clients.map((c) => ({ id: c.id, company_name: c.company_name }))} />
        </Suspense>
      </div>
      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 ? (
          <EmptyState icon={FolderKanban} title="Nenhum projeto ainda" description="Projetos aparecem aqui após você criar um, ou depois de fechar um lead." />
        ) : (
          <div className="flex flex-col">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center gap-4 border-b border-border px-4 py-3 text-sm hover:bg-accent/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">{p.name}</p>
                  <p className="truncate text-xs text-text-subtle">{p.client?.company_name}</p>
                </div>
                <div className="hidden w-40 items-center gap-2 sm:flex">
                  <Progress value={p.progressPct} className="h-1.5" />
                  <span className="w-8 shrink-0 text-right text-xs text-text-subtle">{Math.round(p.progressPct)}%</span>
                </div>
                <MoneyValue value={p.value} className="hidden w-24 text-right text-muted-foreground md:block" />
                <ProjectStatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
