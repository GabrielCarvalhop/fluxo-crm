import { Suspense } from "react";
import Link from "next/link";
import { getClientsList } from "@/lib/queries/clients";
import { ClientsSearch } from "@/components/clients/clients-search";
import { EmptyState } from "@/components/shared/empty-state";
import { Building2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RelativeTime } from "@/components/shared/relative-time";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const clients = await getClientsList(q);

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-3">
        <h1 className="text-base font-medium text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">{clients.length} encontrados</p>
      </div>
      <div className="border-b border-border px-4 py-2.5">
        <Suspense>
          <ClientsSearch />
        </Suspense>
      </div>
      <div className="flex-1 overflow-y-auto">
        {clients.length === 0 ? (
          <EmptyState icon={Building2} title="Nenhum cliente ainda" description="Clientes aparecem aqui quando um lead é convertido no Pipeline." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Projetos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último contato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <Link href={`/clients/${client.id}`} className="hover:underline">{client.company_name}</Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {[client.city, client.state].filter(Boolean).join(", ") || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{client.projects?.length ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={client.status === "active" ? "secondary" : "outline"}>
                      {client.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <RelativeTime iso={client.last_contact_at} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
