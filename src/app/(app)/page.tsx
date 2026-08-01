import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      icon={LayoutDashboard}
      title="Dashboard"
      description="Chega na próxima fatia: leads ativos, follow-ups de hoje, reuniões, propostas em aberto e o que precisa da sua atenção."
    />
  );
}
