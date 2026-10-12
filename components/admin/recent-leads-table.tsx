import Link from "next/link";

import { SourceBadge, StatusBadge } from "@/components/admin/badges";
import { EmptyHint } from "@/components/admin/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LeadListItem } from "@/db/queries/leads";
import { formatDate } from "@/lib/utils";

export function RecentLeadsTable({ leads, serviceNames }: { leads: LeadListItem[]; serviceNames: Record<string, string> }) {
  if (leads.length === 0) return <EmptyHint>Todavía no hay solicitudes registradas.</EmptyHint>;
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Fecha</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="tabular text-gray-500">{formatDate(lead.createdAt)}</TableCell>
            <TableCell>
              <Link href={`/admin/leads/${lead.id}`} className="max-w-[220px] truncate font-medium text-ink-900 underline-offset-4 hover:underline">{lead.name}</Link>
              <div className="truncate text-xs text-gray-500">{lead.locality ?? ""}</div>
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-gray-600">{lead.serviceSlug ? (serviceNames[lead.serviceSlug] ?? lead.serviceSlug) : "—"}</TableCell>
            <TableCell><SourceBadge source={lead.source} /></TableCell>
            <TableCell><StatusBadge status={lead.status} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
