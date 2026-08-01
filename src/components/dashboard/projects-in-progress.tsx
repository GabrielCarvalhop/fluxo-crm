import Link from "next/link";
import { ProjectStatusBadge } from "@/components/shared/project-status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderKanban } from "lucide-react";
import type { DashboardData } from "@/lib/queries/dashboard";

export function ProjectsInProgress({ projects }: { projects: DashboardData["projects"] }) {
  if (projects.length === 0) {
    return <EmptyState icon={FolderKanban} title="Nenhum projeto em andamento" />;
  }

  return (
    <div className="flex flex-col">
      {projects.map((p) => (
        <Link
          key={p.id}
          href={`/projects/${p.id}`}
          className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5 text-sm last:border-0 hover:bg-accent/50"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{p.name}</p>
            <p className="truncate text-xs text-text-subtle">{p.client?.company_name}</p>
          </div>
          <ProjectStatusBadge status={p.status} />
        </Link>
      ))}
    </div>
  );
}
