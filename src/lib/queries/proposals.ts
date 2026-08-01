import { createClient } from "@/lib/supabase/server";

export async function getProposalsList() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("v_proposals")
    .select("*, lead:leads(company_name), client:clients(company_name)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export type ProposalsList = Awaited<ReturnType<typeof getProposalsList>>;

export function computeProposalIndicators(proposals: ProposalsList) {
  const sentOrBeyond = proposals.filter((p) => p.effective_status !== "draft");
  const negotiation = proposals.filter((p) => p.effective_status === "negotiation");
  const accepted = proposals.filter((p) => p.effective_status === "accepted");
  const closedOrRejected = proposals.filter((p) => p.effective_status === "accepted" || p.effective_status === "rejected");

  return {
    sentCount: sentOrBeyond.length,
    totalProposedValue: proposals.reduce((sum, p) => sum + Number(p.value), 0),
    negotiationValue: negotiation.reduce((sum, p) => sum + Number(p.value), 0),
    closedValue: accepted.reduce((sum, p) => sum + Number(p.value), 0),
    closingRate: closedOrRejected.length > 0 ? Math.round((accepted.length / closedOrRejected.length) * 100) : null,
  };
}
