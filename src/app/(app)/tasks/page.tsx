import { Suspense } from "react";
import { isToday, isPast } from "date-fns";
import { getTasksList } from "@/lib/queries/tasks";
import { QuickTaskDialog } from "@/components/shared/quick-task-dialog";
import { TaskRow } from "@/components/tasks/task-row";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks } from "lucide-react";

export default async function TasksPage() {
  const tasks = await getTasksList();

  const overdue = tasks.filter((t) => t.status !== "done" && t.due_at && isPast(new Date(t.due_at)) && !isToday(new Date(t.due_at)));
  const today = tasks.filter((t) => t.status !== "done" && t.due_at && isToday(new Date(t.due_at)));
  const upcoming = tasks.filter(
    (t) => t.status !== "done" && (!t.due_at || (!isPast(new Date(t.due_at)) && !isToday(new Date(t.due_at))))
  );
  const done = tasks.filter((t) => t.status === "done");

  const groups = [
    { key: "today", label: "Hoje", items: today },
    { key: "upcoming", label: "Próximas", items: upcoming },
    { key: "overdue", label: "Atrasadas", items: overdue },
    { key: "done", label: "Concluídas", items: done },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-base font-medium text-foreground">Tarefas</h1>
          <p className="text-sm text-muted-foreground">{tasks.length} no total</p>
        </div>
        <Suspense>
          <QuickTaskDialog />
        </Suspense>
      </div>

      <Tabs defaultValue="today" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="mx-4">
          {groups.map((g) => (
            <TabsTrigger key={g.key} value={g.key}>
              {g.label} <span className="ml-1 text-text-subtle">{g.items.length}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {groups.map((g) => (
          <TabsContent key={g.key} value={g.key} className="min-h-0 flex-1 overflow-y-auto">
            {g.items.length === 0 ? (
              <EmptyState icon={ListChecks} title="Nada por aqui" />
            ) : (
              <div className="flex flex-col">
                {g.items.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
