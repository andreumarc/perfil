import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, Inbox } from "lucide-react";

import { HotBadge, LevelBadge, ScorePill, SourceBadge, StatusBadge } from "@/components/admin/badges";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lead } from "@/db/schema";
import { cn, formatDate } from "@/lib/utils";
import type { LeadsFilter } from "@/lib/validation/admin";
import { COMPANY_REVENUE, JOB_TITLES, NUMBER_LOCATIONS, labelFor } from "@/types/lead";

import { LEADS_PATH, hasActiveFilters, leadsHref } from "./query-string";

type SortColumn = LeadsFilter["sort"];

/** Dirección por defecto al activar una columna: texto ascendente, métricas descendentes. */
const DEFAULT_DIR_BY_COLUMN: Record<SortColumn, LeadsFilter["dir"]> = {
  createdAt: "desc",
  score: "desc",
  company: "asc",
  status: "asc",
  numberLocations: "desc",
  companyRevenue: "desc",
};

function SortableHead({
  column,
  label,
  filter,
  className,
}: {
  column: SortColumn;
  label: string;
  filter: LeadsFilter;
  className?: string;
}) {
  const active = filter.sort === column;
  const nextDir: LeadsFilter["dir"] = active
    ? filter.dir === "asc"
      ? "desc"
      : "asc"
    : DEFAULT_DIR_BY_COLUMN[column];
  const href = leadsHref(filter, { sort: column, dir: nextDir, page: 1 });
  const Icon = active ? (filter.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <TableHead
      className={className}
      aria-sort={active ? (filter.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <Link
        href={href}
        scroll={false}
        className={cn(
          "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-navy-900",
          active && "text-navy-900",
        )}
      >
        {label}
        <Icon className={cn("size-3.5", !active && "opacity-40")} aria-hidden />
      </Link>
    </TableHead>
  );
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(date);
}

export function LeadsTable({ items, filter }: { items: Lead[]; filter: LeadsFilter }) {
  if (items.length === 0) {
    const filtered = hasActiveFilters(filter);
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
          <Inbox className="size-5" aria-hidden />
        </span>
        <h2 className="mt-4 text-base font-semibold text-navy-900">
          {filtered ? "Ningún lead coincide con estos filtros" : "Todavía no hay leads"}
        </h2>
        <p className="mt-1 max-w-sm text-sm text-gray-600">
          {filtered
            ? "Prueba a ampliar la búsqueda o a quitar algún filtro."
            : "Cuando un directivo complete el diagnóstico o envíe el formulario de contacto aparecerá aquí con su score."}
        </p>
        {filtered ? (
          <Button asChild variant="outline" size="sm" className="mt-5">
            <Link href={LEADS_PATH}>Limpiar filtros</Link>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHead column="createdAt" label="Fecha" filter={filter} className="w-[112px]" />
            <SortableHead column="company" label="Empresa" filter={filter} />
            <TableHead className="hidden md:table-cell">Cargo</TableHead>
            <TableHead className="hidden lg:table-cell">Email</TableHead>
            <SortableHead column="numberLocations" label="Centros" filter={filter} className="hidden md:table-cell" />
            <SortableHead column="companyRevenue" label="Facturación" filter={filter} className="hidden lg:table-cell" />
            <SortableHead column="score" label="Score" filter={filter} />
            <TableHead className="hidden md:table-cell">Nivel</TableHead>
            <TableHead className="hidden lg:table-cell">Origen</TableHead>
            <SortableHead column="status" label="Status" filter={filter} />
            <TableHead className="w-[72px] text-right">
              <span className="sr-only">Abrir</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((lead) => {
            const href = `${LEADS_PATH}/${lead.id}`;
            return (
              <TableRow key={lead.id} className={cn(lead.isHot && "bg-red-50/40 hover:bg-red-50/70")}>
                <TableCell className="tabular text-gray-700">
                  <div className="leading-tight">{formatDate(lead.createdAt)}</div>
                  <div className="text-xs text-gray-500">{formatTime(lead.createdAt)}</div>
                </TableCell>
                <TableCell className="max-w-[260px]">
                  <Link href={href} className="block truncate font-medium text-navy-900 hover:underline">
                    {lead.company}
                  </Link>
                  <div className="truncate text-xs text-gray-500">
                    {lead.firstName} {lead.lastName}
                  </div>
                </TableCell>
                <TableCell className="hidden max-w-[200px] truncate text-gray-700 md:table-cell">
                  {labelFor(JOB_TITLES, lead.jobTitle)}
                </TableCell>
                <TableCell className="hidden max-w-[220px] lg:table-cell">
                  <a href={`mailto:${lead.email}`} className="block truncate text-navy-700 hover:underline">
                    {lead.email}
                  </a>
                </TableCell>
                <TableCell className="hidden tabular text-gray-700 md:table-cell">
                  {labelFor(NUMBER_LOCATIONS, lead.numberLocations)}
                </TableCell>
                <TableCell className="hidden tabular text-gray-700 lg:table-cell">
                  {labelFor(COMPANY_REVENUE, lead.companyRevenue)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ScorePill score={lead.score} />
                    <HotBadge isHot={lead.isHot} />
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <LevelBadge level={lead.leadLevel} />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-col items-start gap-0.5">
                    <SourceBadge source={lead.source} />
                    {lead.utmSource ? (
                      <span className="max-w-[160px] truncate text-[11px] text-gray-500">utm: {lead.utmSource}</span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={href}
                    className="inline-flex items-center gap-0.5 text-sm font-medium text-navy-700 hover:text-navy-900 hover:underline"
                    aria-label={`Abrir lead de ${lead.company}`}
                  >
                    Abrir
                    <ChevronRight className="size-4" aria-hidden />
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
