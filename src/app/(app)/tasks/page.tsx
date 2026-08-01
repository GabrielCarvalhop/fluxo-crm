import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { ListChecks } from "lucide-react";

export default function TasksPage() {
  return (
    <PlaceholderPage
      icon={ListChecks}
      title="Tarefas"
      description="Hoje, próximas, atrasadas e concluídas — chega na Fatia 4."
    />
  );
}
