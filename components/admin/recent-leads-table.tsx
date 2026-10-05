import Link from "next/link";

import { HotBadge, LevelBadge, ScorePill, SourceBadge, StatusBadge } from "@/components/admin/badges";
import { EmptyHint } from "@/components/admin/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lead } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { JOB_TITLES, labelFor } from "@/types/lead";

/** Tabla compacta de los últimos leads (Overview). Cada fila enlaza a la ficha. */
export function RecentLeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) return <EmptyHint>Todavía no hay leads registrados.</EmptyHint>;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Fecha</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead>Nivel</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Origen</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="tabular text-gray-500">{formatDate(lead.createdAt)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/leads/${lead.id}`}
                  className="max-w-[220px] truncate font-medium text-navy-900 underline-offset-4 hover:underline"
                >
                  {lead.company}
                </Link>
                <HotBadge isHot={lead.isHot} />
              </div>
            </TableCell>
            <TableCell className="text-gray-700">
              {lead.firstName} {lead.lastName}
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-gray-600">{labelFor(JOB_TITLES, lead.jobTitle)}</TableCell>
            <TableCell className="text-right">
              <ScorePill score={lead.score} />
            </TableCell>
            <TableCell>
              <LevelBadge level={lead.leadLevel} />
            </TableCell>
            <TableCell>
              <StatusBadge status={lead.status} />
            </TableCell>
            <TableCell>
              <SourceBadge source={lead.source} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
