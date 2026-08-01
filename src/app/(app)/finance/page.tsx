import { PlaceholderPage } from "@/components/shared/placeholder-page";
import { Wallet } from "lucide-react";

export default function FinancePage() {
  return (
    <PlaceholderPage
      icon={Wallet}
      title="Financeiro"
      description="Lançamentos, a receber, custos por projeto e lucro estimado — chega na Fatia 4."
    />
  );
}
