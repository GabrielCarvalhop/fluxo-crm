import { MessageCircle, AtSign, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactLogDialog } from "@/components/leads/contact-log-dialog";
import { QuickMeetingDialog } from "@/components/shared/quick-meeting-dialog";
import { QuickTaskDialog } from "@/components/shared/quick-task-dialog";
import { buildWhatsAppLink } from "@/lib/utils/whatsapp";
import type { ClientDetail } from "@/lib/queries/clients";

export function ClientHeader({ client }: { client: ClientDetail["client"] }) {
  const whatsappLink = buildWhatsAppLink(client.whatsapp);
  const instagramLink = client.instagram ? `https://instagram.com/${client.instagram.replace(/^@/, "")}` : null;

  return (
    <div className="flex flex-col gap-3 border-b border-border px-6 py-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">{client.company_name}</h1>
          <Badge variant={client.status === "active" ? "secondary" : "outline"}>
            {client.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          {client.city && <span>{client.city}{client.state ? `, ${client.state}` : ""}</span>}
          {client.domain && <span>{client.domain}</span>}
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
        {client.website_url && (
          <Button variant="outline" size="sm" className="gap-1.5" asChild>
            <a href={client.website_url} target="_blank" rel="noopener noreferrer">
              <Globe className="size-3.5" /> Abrir site
            </a>
          </Button>
        )}
        <QuickMeetingDialog clientId={client.id} defaultTitle={`Reunião — ${client.company_name}`} />
        <QuickTaskDialog clientId={client.id} />
        <ContactLogDialog clientId={client.id} />
      </div>
    </div>
  );
}
