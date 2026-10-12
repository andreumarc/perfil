import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Inbox } from "lucide-react";

import { SourceBadge, StatusBadge } from "@/components/admin/badges";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LeadListItem } from "@/db/queries/leads";
import { formatPhone } from "@/lib/phone";
import { cn, formatDate, isPast } from "@/lib/utils";
import type { LeadsFilter } from "@/lib/validation/admin";

import { LEADS_PATH, hasActiveFilters, leadsHref } from "./query-string";

type SortColumn = LeadsFilter["sort"];

const DEFAULT_DIR_BY_COLUMN: Record<SortColumn, LeadsFilter["dir"]> = {
  createdAt: "desc",
  name: "asc",
  status: "asc",
  source: "asc",
  nextFollowUpAt: "asc",
};

function SortableHead({ column, label, filter, className }: { column: SortColumn; label: string; filter: LeadsFilter; className?: string }) {
  const active = filter.sort === column;
  const nextDir: LeadsFilter["dir"] = active ? (filter.dir === "asc" ? "desc" : "asc") : DEFAULT_DIR_BY_COLUMN[column];
  const Icon = active ? (filter.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <TableHead className={className} aria-sort={active ? (filter.dir === "asc" ? "ascending" : "descending") : "none"}>
      <Link href={leadsHref(filter, { sort: column, dir: nextDir, page: 1 })} scroll={false} className={cn("inline-flex items-center gap-1 rounded-sm transition-colors hover:text-ink-900", active && "text-ink-900")}>
        {label}
        <Icon className={cn("size-3.5", !active && "opacity-40")} aria-hidden />
      </Link>
    </TableHead>
  );
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function LeadsTable({ items, filter, serviceNames }: { items: LeadListItem[]; filter: LeadsFilter; serviceNames: Record<string, string> }) {
  if (items.length === 0) {
    const filtered = hasActiveFilters(filter);
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-copper-50 text-copper-600"><Inbox className="size-5" aria-hidden /></span>
        <h2 className="mt-4 text-base font-semibold text-ink-900">{filtered ? "Ninguna solicitud coincide con estos filtros" : "Todavía no hay solicitudes"}</h2>
        <p className="mt-1 max-w-sm text-sm text-gray-600">{filtered ? "Prueba a ampliar la búsqueda o a quitar algún filtro." : "Cuando alguien envíe el formulario de presupuesto o de contacto aparecerá aquí."}</p>
        {filtered ? <Button asChild variant="outline" size="sm" className="mt-5"><Link href={LEADS_PATH}>Limpiar filtros</Link></Button> : null}
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead column="createdAt" label="Fecha" filter={filter} className="w-[112px]" />
            <SortableHead column="name" label="Contacto" filter={filter} />
            <TableHead className="hidden lg:table-cell">Servicio</TableHead>
            <TableHead className="hidden md:table-cell">Localidad</TableHead>
            <SortableHead column="source" label="Origen" filter={filter} className="hidden lg:table-cell" />
            <SortableHead column="status" label="Estado" filter={filter} />
            <TableHead className="hidden md:table-cell">Responsable</TableHead>
            <SortableHead column="nextFollowUpAt" label="Próx. tarea" filter={filter} className="hidden xl:table-cell" />
            <TableHead className="w-[72px] text-right"><span className="sr-only">Abrir</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((lead) => {
            const href = `${LEADS_PATH}/${lead.id}`;
            const overdue = isPast(lead.nextFollowUpAt) && lead.status !== "WON" && lead.status !== "LOST";
            return (
              <TableRow key={lead.id} className={cn(lead.status === "NEW" && "bg-copper-50/40 hover:bg-copper-50/70")}>
                <TableCell className="tabular text-gray-700">
                  <div className="leading-tight">{formatDate(lead.createdAt)}</div>
                  <div className="text-xs text-gray-500">{formatTime(lead.createdAt)}</div>
                </TableCell>
                <TableCell className="max-w-[260px]">
                  <Link href={href} className="block truncate font-medium text-ink-900 hover:underline">{lead.name}</Link>
                  <div className="tabular truncate text-xs text-gray-500">{formatPhone(lead.phone)} · {lead.email}</div>
                </TableCell>
                <TableCell className="hidden max-w-[220px] truncate text-gray-700 lg:table-cell">{lead.serviceSlug ? (serviceNames[lead.serviceSlug] ?? lead.serviceSlug) : "—"}</TableCell>
                <TableCell className="hidden text-gray-700 md:table-cell">{[lead.locality, lead.postalCode].filter(Boolean).join(" · ") || "—"}</TableCell>
                <TableCell className="hidden lg:table-cell"><SourceBadge source={lead.source} /></TableCell>
                <TableCell><StatusBadge status={lead.status} /></TableCell>
                <TableCell className="hidden text-gray-700 md:table-cell">{lead.assigneeName ?? <span className="text-gray-400">Sin asignar</span>}</TableCell>
                <TableCell className={cn("tabular hidden xl:table-cell", overdue ? "font-medium text-red-700" : "text-gray-700")}>{lead.nextFollowUpAt ? formatDate(lead.nextFollowUpAt) : "—"}</TableCell>
                <TableCell className="text-right">
                  <Link href={href} className="inline-flex items-center gap-0.5 text-sm font-medium text-copper-600 hover:underline" aria-label={`Abrir solicitud de ${lead.name}`}>
                    Abrir<ChevronRight className="size-4" aria-hidden />
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
