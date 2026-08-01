export type TimelineEvent = {
  id: string;
  at: string;
  kind: "log" | "contact" | "note" | "meeting" | "proposal";
  title: string;
  description?: string | null;
};

const ACTION_LABEL: Record<string, string> = {
  created: "Cadastrado",
  stage_changed: "Estágio alterado",
  temperature_changed: "Temperatura alterada",
  contact_logged: "Contato registrado",
  status_changed: "Status alterado",
};

const CONTACT_TYPE_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  call: "Ligação",
  instagram: "Instagram",
  email: "E-mail",
  meeting: "Reunião",
  other: "Outro",
};

type TimelineInput = {
  logs?: { id: string; created_at: string; action: string; from_value: string | null; to_value: string | null }[];
  contacts?: { id: string; contacted_at: string; type: string; summary: string | null; outcome: string | null }[];
  notes?: { id: string; created_at: string; body: string }[];
  meetings?: { id: string; starts_at: string; status: string; objective: string | null }[];
  proposals?: { id: string; created_at: string; code: string | null; title: string }[];
};

/** Junta logs automáticos, contatos, notas, reuniões e propostas numa timeline única, ordenada. */
export function buildTimeline(input: TimelineInput): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const log of input.logs ?? []) {
    if (log.action === "stage_changed" || log.action === "temperature_changed" || log.action === "status_changed") {
      events.push({
        id: `log-${log.id}`,
        at: log.created_at,
        kind: "log",
        title: ACTION_LABEL[log.action] ?? log.action,
        description: log.from_value && log.to_value ? `${log.from_value} → ${log.to_value}` : log.to_value,
      });
    } else if (log.action === "created") {
      events.push({ id: `log-${log.id}`, at: log.created_at, kind: "log", title: "Cadastrado" });
    }
  }

  for (const c of input.contacts ?? []) {
    events.push({
      id: `contact-${c.id}`,
      at: c.contacted_at,
      kind: "contact",
      title: `Contato por ${CONTACT_TYPE_LABEL[c.type] ?? c.type}`,
      description: [c.summary, c.outcome].filter(Boolean).join(" — ") || null,
    });
  }

  for (const n of input.notes ?? []) {
    events.push({ id: `note-${n.id}`, at: n.created_at, kind: "note", title: "Nota adicionada", description: n.body });
  }

  for (const m of input.meetings ?? []) {
    events.push({
      id: `meeting-${m.id}`,
      at: m.starts_at,
      kind: "meeting",
      title: m.status === "done" ? "Reunião realizada" : "Reunião marcada",
      description: m.objective,
    });
  }

  for (const p of input.proposals ?? []) {
    events.push({
      id: `proposal-${p.id}`,
      at: p.created_at,
      kind: "proposal",
      title: `Proposta ${p.code ?? ""} criada`.trim(),
      description: p.title,
    });
  }

  return events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}
