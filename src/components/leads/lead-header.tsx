import Link from "next/link";
import { MessageCircle, AtSign, Globe, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MoneyValue } from "@/components/shared/money-value";
import { StageBadge } from "@/components/shared/stage-badge";
import { ContactLogDialog } from "./contact-log-dialog";
import { QuickMeetingDialog } from "@/components/shared/quick-meeting-dialog";
import { QuickProposalDialog } from "@/components/shared/quick-proposal-dialog";
import { QuickTaskDialog } from "@/components/shared/quick-task-dialog";
import { MarkLostDialog } from "./mark-lost-dialog";
import { ConvertToClientButton } from "./convert-to-client-button";
import { EditLeadDialog } from "./edit-lead-dialog";
import { TemperatureSelect } from "./temperature-select";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import type { LeadDetail } from "@/lib/queries/leads";

export function LeadHeader({
  lead,
  lossReasons,
  segments,
  sources,
}: {
  lead: LeadDetail["lead"];
  lossReasons: { id: string; label: string }[];
  segments: { id: string; label: string }[];
  sources: { id: string; label: string }[];
}) {
  const whatsappLink = buildWhatsAppLink(lead.whatsapp);
  const instagramLink = lead.instagram ? `https://instagram.com/${lead.instagram.replace(/^@/, "")}` : null;
  const isClosed = lead.stage?.key === "won" || lead.stage?.key === "lost";

  return (
    <div className="flex flex-col gap-3 border-b border-border px-6 py-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">{lead.company_name}</h1>
          {lead.stage && <StageBadge label={lead.stage.label} color={lead.stage.color} />}
          <TemperatureSelect leadId={lead.id} temperature={lead.temperature} />
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          {lead.segment?.label && <span>{lead.segment.label}</span>}
          {lead.city && <span>{lead.city}{lead.state ? `, ${lead.state}` : ""}</span>}
          {lead.estimated_value !== null && <MoneyValue value={lead.estimated_value} />}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {whatsappLink && (
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-3.5" /> WhatsApp
            </a>
          </Button>
        )}
        {instagramLink && (
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={instagramLink} target="_blank" rel="noopener noreferrer">
              <AtSign className="size-3.5" /> Instagram
            </a>
          </Button>
        )}
        {lead.website_url && (
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={lead.website_url} target="_blank" rel="noopener noreferrer">
              <Globe className="size-3.5" /> Abrir site
            </a>
          </Button>
        )}
        {lead.pilot_url && (
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={lead.pilot_url} target="_blank" rel="noopener noreferrer">
              <Rocket className="size-3.5" /> Abrir piloto
            </a>
          </Button>
        )}

        <EditLeadDialog lead={lead} segments={segments} sources={sources} />
        <QuickMeetingDialog leadId={lead.id} defaultTitle={`Reunião — ${lead.company_name}`} />
        <QuickProposalDialog leadId={lead.id} defaultTitle={`Site institucional — ${lead.company_name}`} />
        <QuickTaskDialog leadId={lead.id} />
        <ContactLogDialog leadId={lead.id} />

        {!isClosed && (
          <div className="ml-auto flex items-center gap-1.5">
            <MarkLostDialog leadId={lead.id} reasons={lossReasons} />
            <ConvertToClientButton leadId={lead.id} companyName={lead.company_name} />
          </div>
        )}
        {lead.stage?.key === "won" && lead.converted_client_id && (
          <Link href={`/clients/${lead.converted_client_id}`} className="ml-auto text-sm text-primary hover:underline">
            Ver cliente →
          </Link>
        )}
      </div>
    </div>
  );
}
