// Fluxo CRM — remove só os dados fictícios criados por seed.ts.
// Ordem importa por causa de duas FKs sem cascade de propósito
// (clients.lead_id e leads.converted_client_id, projects.proposal_id):
// projetos -> propostas -> (desvincula lead<->client) -> clientes -> leads.

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/types/database";
import { SEED_LEAD_NAMES } from "./data";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local antes de rodar o reset."
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("Fluxo CRM — removendo dados do seed\n");

  const { data: leads } = await supabase.from("leads").select("id").in("company_name", SEED_LEAD_NAMES);
  const leadIds = (leads ?? []).map((l) => l.id);
  if (leadIds.length === 0) {
    console.log("Nenhum lead fictício encontrado — nada para remover.");
    return;
  }

  const { data: clients } = await supabase.from("clients").select("id").in("lead_id", leadIds);
  const clientIds = (clients ?? []).map((c) => c.id);

  const { data: projects } = clientIds.length
    ? await supabase.from("projects").select("id").in("client_id", clientIds)
    : { data: [] };
  const projectIds = (projects ?? []).map((p) => p.id);

  if (projectIds.length) {
    console.log(`Removendo ${projectIds.length} projeto(s)…`);
    const { error } = await supabase.from("projects").delete().in("id", projectIds);
    if (error) throw error;
  }

  console.log("Removendo propostas…");
  await supabase.from("proposals").delete().in("lead_id", leadIds);
  if (clientIds.length) await supabase.from("proposals").delete().in("client_id", clientIds);

  console.log("Desvinculando lead <-> cliente…");
  await supabase.from("leads").update({ converted_client_id: null }).in("id", leadIds);

  if (clientIds.length) {
    console.log(`Removendo ${clientIds.length} cliente(s)…`);
    const { error } = await supabase.from("clients").delete().in("id", clientIds);
    if (error) throw error;
  }

  console.log(`Removendo ${leadIds.length} lead(s)…`);
  const { error: leadsError } = await supabase.from("leads").delete().in("id", leadIds);
  if (leadsError) throw leadsError;

  console.log("Limpando activity_logs órfãos…");
  const allIds = [...leadIds, ...clientIds, ...projectIds];
  if (allIds.length) {
    await supabase.from("activity_logs").delete().in("entity_id", allIds);
  }

  console.log("\nSeed removido.");
}

main().catch((err) => {
  console.error("\nReset falhou:", err.message ?? err);
  process.exit(1);
});
