// Fluxo CRM — seed de dados fictícios
// Roda com a service_role key (só localmente, nunca no runtime do app) para
// poder escrever direto, ignorando RLS. `npm run seed`, reversível com
// `npm run seed:reset`.

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/types/database";
import { SEED_LEADS, SEED_LEAD_NAMES } from "./data";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY em .env.local antes de rodar o seed."
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}
function dateFromNow(n: number) {
  return daysFromNow(n).slice(0, 10);
}

// Narrativa por lead: contato registrado, reunião e proposta, quando
// fizer sentido pro estágio. Chaveado por company_name para manter
// supabase/seed/data.ts enxuto com só os campos de cadastro do lead.
const CONTACTS: Record<
  string,
  { type: Database["public"]["Enums"]["contact_type_enum"]; summary: string; outcome?: string; nextAction?: string; nextActionDaysFromNow?: number }[]
> = {
  "Andrade & Rocha Advocacia": [
    { type: "whatsapp", summary: "Apresentei o site piloto.", outcome: "Gostou, vai decidir com a sócia.", nextAction: "Cobrar retorno da proposta", nextActionDaysFromNow: -3 },
  ],
  "Pousada Vale Verde": [
    { type: "whatsapp", summary: "Primeiro contato, mostrei o piloto.", outcome: "Muito interessado, quer reunião.", nextAction: "Reunião de apresentação", nextActionDaysFromNow: 1 },
  ],
  "Tato Estúdio de Tatuagem": [
    { type: "meeting", summary: "Reunião de negociação.", outcome: "Pediu desconto à vista.", nextAction: "Fechar condição de pagamento", nextActionDaysFromNow: 0 },
  ],
  "Clínica Bem Estar": [
    { type: "call", summary: "Liguei para entender os serviços oferecidos.", outcome: "Vai enviar lista de serviços por WhatsApp.", nextAction: "Follow-up lista de serviços", nextActionDaysFromNow: 4 },
  ],
  "Móveis Bragança": [
    { type: "whatsapp", summary: "Mensagem de primeiro contato enviada.", outcome: "Sem resposta ainda.", nextAction: "Reforçar contato", nextActionDaysFromNow: -1 },
  ],
  "Barbearia Nobre": [
    { type: "whatsapp", summary: "Enviei o piloto.", outcome: "Visualizou, não respondeu." },
  ],
  "Doce Ponto Confeitaria": [
    { type: "whatsapp", summary: "Apresentei o piloto.", outcome: "Adorou! Vai chamar a sócia pra decidir junto.", nextAction: "Follow-up com as duas sócias", nextActionDaysFromNow: 2 },
  ],
  "Oliveira Odontologia": [
    { type: "whatsapp", summary: "Follow-up pós-proposta.", outcome: "Achou o valor alto, fechou com concorrente." },
  ],
  "Ateliê Costura Fina": [
    { type: "instagram", summary: "Respondeu direct sobre o piloto.", outcome: "Pediu a proposta.", nextAction: "Follow-up da proposta", nextActionDaysFromNow: 5 },
  ],
};

const MEETINGS: Record<string, { daysFromNow: number; hour: string; status: Database["public"]["Enums"]["meeting_status_enum"]; objective: string; format: Database["public"]["Enums"]["meeting_format_enum"] }> = {
  "Pousada Vale Verde": { daysFromNow: 0, hour: "15:30", status: "scheduled", objective: "Apresentar o projeto completo e coletar briefing", format: "online" },
  "Tato Estúdio de Tatuagem": { daysFromNow: -3, hour: "10:00", status: "done", objective: "Negociação de valores", format: "in_person" },
  "Clínica Bem Estar": { daysFromNow: 2, hour: "14:00", status: "scheduled", objective: "Qualificação — entender serviços e público-alvo", format: "online" },
};

const PROPOSALS: Record<string, { value: number; status: Database["public"]["Enums"]["proposal_status_enum"]; sentDaysAgo: number; validDaysFromNow: number; rejectedReasonKey?: string }> = {
  "Andrade & Rocha Advocacia": { value: 2400, status: "sent", sentDaysAgo: 5, validDaysFromNow: 1 },
  "Ateliê Costura Fina": { value: 950, status: "sent", sentDaysAgo: 3, validDaysFromNow: 10 },
  "Tato Estúdio de Tatuagem": { value: 1600, status: "negotiation", sentDaysAgo: 10, validDaysFromNow: 5 },
  "Oliveira Odontologia": { value: 2000, status: "rejected", sentDaysAgo: 20, validDaysFromNow: -10, rejectedReasonKey: "price" },
};

type ByKey = Record<string, string>;

async function fetchByKey(table: "pipeline_stages" | "segments" | "lead_sources" | "loss_reasons"): Promise<ByKey> {
  const { data, error } = await supabase.from(table).select("id, key");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.id]));
}

async function main() {
  console.log("Fluxo CRM — seed\n");

  const { data: already } = await supabase.from("leads").select("id").in("company_name", SEED_LEAD_NAMES).limit(1);
  if (already && already.length > 0) {
    console.log("Já existem leads fictícios no banco. Rode `npm run seed:reset` antes de rodar de novo.");
    process.exit(0);
  }

  const [stages, segments, sources, lossReasons] = await Promise.all([
    fetchByKey("pipeline_stages"),
    fetchByKey("segments"),
    fetchByKey("lead_sources"),
    fetchByKey("loss_reasons"),
  ]);

  const { data: profileRows } = await supabase.from("profiles").select("id").limit(1);
  const ownerId = profileRows?.[0]?.id ?? null;
  if (!ownerId) {
    console.warn("Nenhum profile encontrado ainda — crie seu usuário admin antes do seed para os registros terem um responsável. Seguindo sem owner_id.");
  }

  const tagLabels = Array.from(new Set(SEED_LEADS.flatMap((l) => l.tags ?? [])));
  const tagIdByLabel: ByKey = {};
  for (const label of tagLabels) {
    const { data: tag, error } = await supabase
      .from("tags")
      .upsert({ label }, { onConflict: "label" })
      .select("id, label")
      .single();
    if (error) throw error;
    tagIdByLabel[label] = tag.id;
  }

  const { data: template } = await supabase
    .from("checklist_templates")
    .select("id, checklist_template_items(id, group_label, label, position)")
    .eq("is_default", true)
    .single();

  console.log(`Criando ${SEED_LEADS.length} leads…`);
  const leadIdByName: ByKey = {};

  for (const lead of SEED_LEADS) {
    const { data: inserted, error } = await supabase
      .from("leads")
      .insert({
        company_name: lead.company_name,
        contact_name: lead.contact_name,
        segment_id: segments[lead.segment_key] ?? null,
        city: lead.city,
        state: lead.state,
        whatsapp: lead.whatsapp,
        instagram: lead.instagram,
        website_url: lead.website_url ?? null,
        google_maps_url: lead.google_maps_url ?? null,
        source_id: sources[lead.source_key] ?? null,
        has_website: lead.has_website,
        website_quality: lead.website_quality,
        pilot_created: lead.pilot_created,
        pilot_url: lead.pilot_url ?? null,
        stage_id: stages[lead.stage_key],
        temperature: lead.temperature,
        estimated_value: lead.estimated_value,
        prospected_at: daysFromNow(-lead.prospectedDaysAgo),
        owner_id: ownerId,
        loss_reason_id: lead.lossReasonKey ? lossReasons[lead.lossReasonKey] : null,
        loss_notes: lead.lossNotes ?? null,
      })
      .select("id")
      .single();

    if (error) throw new Error(`lead ${lead.company_name}: ${error.message}`);
    leadIdByName[lead.company_name] = inserted.id;

    if (lead.tags?.length) {
      await supabase
        .from("lead_tags")
        .insert(lead.tags.map((t) => ({ lead_id: inserted.id, tag_id: tagIdByLabel[t] })));
    }

    if (lead.note) {
      await supabase.from("notes").insert({ lead_id: inserted.id, author_id: ownerId, body: lead.note });
    }
  }

  console.log("Registrando contatos e follow-ups…");
  for (const [companyName, contacts] of Object.entries(CONTACTS)) {
    const leadId = leadIdByName[companyName];
    for (const c of contacts) {
      const { error } = await supabase.from("lead_contacts").insert({
        lead_id: leadId,
        user_id: ownerId,
        type: c.type,
        contacted_at: daysFromNow(c.nextActionDaysFromNow !== undefined ? Math.min(c.nextActionDaysFromNow - 1, -1) : -1),
        summary: c.summary,
        outcome: c.outcome ?? null,
        next_action: c.nextAction ?? null,
        next_action_at: c.nextActionDaysFromNow !== undefined ? daysFromNow(c.nextActionDaysFromNow) : null,
      });
      if (error) throw new Error(`contato ${companyName}: ${error.message}`);
    }
  }

  console.log("Criando reuniões…");
  for (const [companyName, m] of Object.entries(MEETINGS)) {
    const leadId = leadIdByName[companyName];
    const starts = daysFromNow(m.daysFromNow).slice(0, 10) + "T" + m.hour + ":00-03:00";
    const { error } = await supabase.from("meetings").insert({
      title: `Reunião — ${companyName}`,
      lead_id: leadId,
      type: "meeting",
      starts_at: new Date(starts).toISOString(),
      format: m.format,
      objective: m.objective,
      status: m.status,
    });
    if (error) throw new Error(`reunião ${companyName}: ${error.message}`);
  }

  console.log("Criando propostas…");
  for (const [companyName, p] of Object.entries(PROPOSALS)) {
    const leadId = leadIdByName[companyName];
    const { error } = await supabase.from("proposals").insert({
      lead_id: leadId,
      title: `Site institucional — ${companyName}`,
      value: p.value,
      status: p.status,
      sent_at: daysFromNow(-p.sentDaysAgo),
      valid_until: dateFromNow(p.validDaysFromNow),
      payment_terms: "50% no início, 50% na entrega",
      payment_method: "PIX",
      rejected_reason_id: p.rejectedReasonKey ? lossReasons[p.rejectedReasonKey] : null,
    });
    if (error) throw new Error(`proposta ${companyName}: ${error.message}`);
  }

  // --- Conversão dos leads fechados em clientes -----------------------
  console.log("Convertendo leads fechados em clientes…");
  const clientIdByName: ByKey = {};

  for (const lead of SEED_LEADS.filter((l) => l.willConvert)) {
    const leadId = leadIdByName[lead.company_name];
    const { data: client, error } = await supabase
      .from("clients")
      .insert({
        lead_id: leadId,
        company_name: lead.company_name,
        contact_name: lead.contact_name,
        whatsapp: lead.whatsapp,
        instagram: lead.instagram,
        city: lead.city,
        state: lead.state,
        status: "active",
      })
      .select("id")
      .single();
    if (error) throw new Error(`cliente ${lead.company_name}: ${error.message}`);

    clientIdByName[lead.company_name] = client.id;

    await supabase
      .from("leads")
      .update({ converted_client_id: client.id, converted_at: daysFromNow(-lead.prospectedDaysAgo + 5) })
      .eq("id", leadId);

    // proposta aceita para quem fechou (não tem entrada em PROPOSALS)
    if (!PROPOSALS[lead.company_name]) {
      await supabase.from("proposals").insert({
        lead_id: leadId,
        client_id: client.id,
        title: `Site institucional — ${lead.company_name}`,
        value: lead.estimated_value,
        status: "accepted",
        sent_at: daysFromNow(-lead.prospectedDaysAgo + 3),
        valid_until: dateFromNow(-lead.prospectedDaysAgo + 13),
        payment_terms: "50% no início, 50% na entrega",
        payment_method: "PIX",
      });
    }
  }

  // --- Projetos ---------------------------------------------------------
  console.log("Criando projetos, checklists, briefing, domínio e financeiro…");

  type ProjectSeed = {
    client: string;
    name: string;
    status: Database["public"]["Enums"]["project_status_enum"];
    startDaysAgo: number;
    dueDaysFromNow: number;
    deliveredDaysAgo?: number;
    finalUrl?: string;
    value: number;
    doneGroups: string[]; // grupos 100% concluídos
    partialGroup?: { label: string; doneCount: number };
    briefingAnswered: boolean;
    dnsConfigured: boolean;
    income: { status: Database["public"]["Enums"]["transaction_status_enum"]; dueDaysFromNow: number; paidDaysAgo?: number };
  };

  const PROJECTS: ProjectSeed[] = [
    {
      client: "Malbec Vinhos & Cia",
      name: "Site institucional — Malbec Vinhos & Cia",
      status: "development",
      startDaysAgo: 20,
      dueDaysFromNow: 10,
      value: 1700,
      doneGroups: ["Pré-produção"],
      partialGroup: { label: "Desenvolvimento", doneCount: 3 },
      briefingAnswered: true,
      dnsConfigured: false,
      income: { status: "pending", dueDaysFromNow: 5 },
    },
    {
      client: "Hotel Pousada do Lago",
      name: "Site institucional — Hotel Pousada do Lago",
      status: "client_review",
      startDaysAgo: 30,
      dueDaysFromNow: 3,
      value: 2600,
      doneGroups: ["Pré-produção", "Desenvolvimento"],
      partialGroup: { label: "Publicação", doneCount: 3 },
      briefingAnswered: true,
      dnsConfigured: true,
      income: { status: "pending", dueDaysFromNow: -2 },
    },
    {
      client: "Reis & Castro Advogados",
      name: "Site institucional — Reis & Castro Advogados",
      status: "finished",
      startDaysAgo: 60,
      dueDaysFromNow: -20,
      deliveredDaysAgo: 18,
      finalUrl: "https://reiscastroadvogados.com.br",
      value: 2900,
      doneGroups: ["Pré-produção", "Desenvolvimento", "Publicação", "Entrega"],
      briefingAnswered: true,
      dnsConfigured: true,
      income: { status: "paid", dueDaysFromNow: -18, paidDaysAgo: 18 },
    },
  ];

  for (const p of PROJECTS) {
    const clientId = clientIdByName[p.client];

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        client_id: clientId,
        name: p.name,
        type: "institutional",
        status: p.status,
        briefing_status: p.briefingAnswered ? "complete" : "not_sent",
        start_date: dateFromNow(-p.startDaysAgo),
        due_date: dateFromNow(p.dueDaysFromNow),
        delivered_at: p.deliveredDaysAgo !== undefined ? daysFromNow(-p.deliveredDaysAgo) : null,
        final_url: p.finalUrl ?? null,
        value: p.value,
      })
      .select("id")
      .single();
    if (projectError) throw new Error(`projeto ${p.name}: ${projectError.message}`);

    if (template) {
      const groupsInOrder = Array.from(new Set(template.checklist_template_items.map((i) => i.group_label)));
      const groupIdByLabel: ByKey = {};

      for (const label of groupsInOrder) {
        const { data: group, error } = await supabase
          .from("project_checklist_groups")
          .insert({ project_id: project.id, label, position: groupsInOrder.indexOf(label) })
          .select("id")
          .single();
        if (error) throw error;
        groupIdByLabel[label] = group.id;
      }

      const itemsByGroup: Record<string, typeof template.checklist_template_items> = {};
      for (const item of template.checklist_template_items) {
        (itemsByGroup[item.group_label] ??= []).push(item);
      }

      for (const [label, items] of Object.entries(itemsByGroup)) {
        const fullyDone = p.doneGroups.includes(label);
        const partial = p.partialGroup?.label === label ? p.partialGroup.doneCount : 0;

        const rows = items
          .sort((a, b) => a.position - b.position)
          .map((item, idx) => {
            const done = fullyDone || idx < partial;
            return {
              group_id: groupIdByLabel[label],
              label: item.label,
              position: item.position,
              done,
              done_at: done ? daysFromNow(-Math.max(1, p.startDaysAgo - idx)) : null,
            };
          });

        const { error } = await supabase.from("project_checklist_items").insert(rows);
        if (error) throw error;
      }
    }

    if (p.briefingAnswered) {
      await supabase.from("project_briefings").insert({
        project_id: project.id,
        about: `${p.client} é um negócio local consolidado na região, buscando presença digital profissional.`,
        services: "Ver descrição completa no WhatsApp do cliente.",
        goal: "Atrair novos clientes e passar mais credibilidade online.",
        whatsapp: "Confirmado com o cliente.",
        location: "Endereço confirmado com o cliente.",
        colors: "Paleta baseada na identidade visual atual.",
        answered_at: daysFromNow(-p.startDaysAgo + 3),
      });
    }

    const domainSlug = p.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/site institucional — /, "")
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 20);

    await supabase.from("domains").insert({
      project_id: project.id,
      domain_name: `${domainSlug}.com.br`,
      registrar: "Registro.br",
      registered_at: dateFromNow(-p.startDaysAgo + 1),
      expires_at: dateFromNow(365 - p.startDaysAgo),
      cost: 40,
      paid_by: "fluxo",
      hosting: "vercel",
      dns_configured: p.dnsConfigured,
      final_url: p.finalUrl ?? null,
    });

    await supabase.from("financial_transactions").insert([
      {
        client_id: clientId,
        project_id: project.id,
        description: `Pagamento — ${p.name}`,
        amount: p.value,
        kind: "income",
        status: p.income.status,
        due_date: dateFromNow(p.income.dueDaysFromNow),
        paid_at: p.income.paidDaysAgo !== undefined ? daysFromNow(-p.income.paidDaysAgo) : null,
        method: "pix",
      },
      {
        client_id: clientId,
        project_id: project.id,
        description: "Registro de domínio",
        amount: 40,
        kind: "expense",
        expense_category: "domain",
        status: "paid",
        due_date: dateFromNow(-p.startDaysAgo + 1),
        paid_at: daysFromNow(-p.startDaysAgo + 1),
        method: "card",
      },
    ]);
  }

  // --- Tarefas avulsas ----------------------------------------------------
  console.log("Criando tarefas…");
  const malbecId = (await supabase.from("projects").select("id").eq("name", PROJECTS[0].name).single()).data?.id;
  const pousadaLagoId = (await supabase.from("projects").select("id").eq("name", PROJECTS[1].name).single()).data?.id;
  const reisCastroProjectId = (await supabase.from("projects").select("id").eq("name", PROJECTS[2].name).single()).data?.id;

  const tasks: Database["public"]["Tables"]["tasks"]["Insert"][] = [
    {
      title: "Configurar DNS do domínio",
      project_id: pousadaLagoId,
      client_id: clientIdByName["Hotel Pousada do Lago"],
      priority: "high",
      due_at: daysFromNow(0),
      status: "pending",
      assignee_id: ownerId,
    },
    {
      title: "Revisar copy das páginas internas",
      project_id: malbecId,
      client_id: clientIdByName["Malbec Vinhos & Cia"],
      priority: "medium",
      due_at: daysFromNow(3),
      status: "pending",
      assignee_id: ownerId,
    },
    {
      title: "Preparar apresentação do projeto",
      lead_id: leadIdByName["Clínica Bem Estar"],
      priority: "high",
      due_at: daysFromNow(1),
      status: "pending",
      assignee_id: ownerId,
    },
    {
      title: "Emitir recibo do pagamento",
      client_id: clientIdByName["Reis & Castro Advogados"],
      priority: "medium",
      due_at: daysFromNow(-1),
      status: "pending",
      assignee_id: ownerId,
    },
    {
      title: "Pesquisar novos leads — segmento pousadas",
      priority: "low",
      due_at: daysFromNow(2),
      status: "pending",
      assignee_id: ownerId,
    },
    {
      title: "Registrar domínio reiscastroadvogados.com.br",
      project_id: reisCastroProjectId,
      client_id: clientIdByName["Reis & Castro Advogados"],
      priority: "medium",
      due_at: daysFromNow(-19),
      status: "done",
      done_at: daysFromNow(-19),
      assignee_id: ownerId,
    },
  ];

  const { error: tasksError } = await supabase.from("tasks").insert(tasks);
  if (tasksError) throw new Error(`tarefas: ${tasksError.message}`);

  console.log("\nSeed concluído:");
  console.log(`  ${SEED_LEADS.length} leads`);
  console.log(`  ${Object.keys(clientIdByName).length} clientes`);
  console.log(`  ${PROJECTS.length} projetos`);
  console.log(`  ${tasks.length} tarefas`);
  console.log("\nRode \`npm run seed:reset\` a qualquer momento para remover só estes dados fictícios.");
}

main().catch((err) => {
  console.error("\nSeed falhou:", err.message ?? err);
  process.exit(1);
});
