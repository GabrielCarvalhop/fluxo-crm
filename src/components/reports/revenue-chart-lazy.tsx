"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Recharts sozinho pesa ~110 kB. Como o gráfico fica abaixo da dobra e só
 * existe nesta tela, ele é carregado sob demanda — o resto de /reports
 * (funil, conversão, origens, motivos de perda) aparece antes.
 */
export const RevenueChart = dynamic(() => import("./revenue-chart"), {
  ssr: false,
  loading: () => (
    <div className="p-4">
      <Skeleton className="h-56 w-full rounded-md" />
    </div>
  ),
});
