import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { MoneyValue } from "@/components/shared/money-value";
import { ProposalStatusBadge } from "@/components/shared/proposal-status-badge";
import { FollowUpRow } from "@/components/shared/follow-up-row";
import { LeadTags } from "./lead-tags";
import { LeadNotes } from "./lead-notes";
import { MeetingStatusSelect } from "@/components/shared/meeting-status-select";
import { formatDateTime } from "@/lib/utils/dates";
import type { LeadDetail } from "@/lib/queries/leads";

export function LeadSidebar({
  lead,
  contacts,
  notes,
  tags,
  followUps,
  meetings,
  proposals,
  allTags,
}: {
  lead: LeadDetail["lead"];
  contacts: LeadDetail["contacts"];
  notes: LeadDetail["notes"];
  tags: { id: string; label: string }[];
  followUps: LeadDetail["followUps"];
  meetings: LeadDetail["meetings"];
  proposals: LeadDetail["proposals"];
  allTags: { id: string; label: string }[];
}) {
  const pendingFollowUps = followUps.filter((f) => f.status === "pending");

  return (
    <div className="flex w-full flex-col gap-5 border-l border-border p-4 lg:w-80">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-text-subtle uppercase">Contato</span>
        <dl className="flex flex-col gap-1 text-sm">
          {lead.whatsapp && <Row label="WhatsApp" value={lead.whatsapp} />}
          {lead.phone && <Row label="Telefone" value={lead.phone} />}
          {lead.email && <Row label="E-mail" value={lead.email} />}
          {lead.instagram && <Row label="Instagram" value={lead.instagram} />}
          {lead.google_maps_url && (
            <Row label="Maps" value={<a href={lead.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Abrir</a>} />
          )}
          <Row label="Origem" value={lead.source?.label ?? "—"} />
          <Row label="Site atual" value={lead.has_website ? "Sim" : "Não"} />
        </dl>
      </div>

      <Separator />

      <LeadTags leadId={lead.id} currentTags={tags} allTags={allTags} />

      <Separator />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-text-subtle uppercase">Follow-ups pendentes</span>
        {pendingFollowUps.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum.</p>
        ) : (
          <div className="-mx-4 flex flex-col">
            {pendingFollowUps.map((f) => (
              <FollowUpRow
                key={f.id}
                showEntity={false}
                item={{
                  id: f.id,
                  title: f.title,
                  due_at: f.due_at,
                  lead_id: f.lead_id,
                  client_id: f.client_id,
                  entityName: lead.company_name,
                  entityHref: `/leads/${lead.id}`,
                  whatsapp: lead.whatsapp,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-text-subtle uppercase">Reuniões</span>
        {meetings.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {meetings.map((m) => (
              <div key={m.id} className="flex flex-col gap-1.5 rounded-md border border-border p-2">
                <span className="text-sm text-foreground">{formatDateTime(m.starts_at)}</span>
                <MeetingStatusSelect meetingId={m.id} status={m.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-text-subtle uppercase">Propostas</span>
        {proposals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {proposals.map((p) => (
              <Link
                key={p.id}
                href="/proposals"
                className="flex items-center justify-between gap-2 rounded-md border border-border p-2 text-sm hover:bg-accent/50"
              >
                <span className="truncate">{p.title}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <MoneyValue value={p.value} className="text-xs" />
                  <ProposalStatusBadge status={p.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <LeadNotes leadId={lead.id} notes={notes} />

      {contacts.length > 0 && (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-text-subtle uppercase">{contacts.length} contato(s) registrado(s)</span>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-text-subtle">{label}</dt>
      <dd className="truncate text-foreground">{value}</dd>
    </div>
  );
}
