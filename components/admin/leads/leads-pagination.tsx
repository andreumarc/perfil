import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import type { LeadsFilter } from "@/lib/validation/admin";

import { leadsHref } from "./query-string";

export function LeadsPagination({
  filter,
  page,
  pageCount,
  pageSize,
  total,
}: {
  filter: LeadsFilter;
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}) {
  if (total === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  return (
    <nav
      aria-label="Paginación de leads"
      className="flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="tabular">
        Mostrando <span className="font-medium text-navy-900">{formatNumber(from)}–{formatNumber(to)}</span> de{" "}
        <span className="font-medium text-navy-900">{formatNumber(total)}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="tabular mr-1">
          Página {page} de {pageCount}
        </span>
        {hasPrev ? (
          <Button asChild variant="outline" size="sm">
            <Link href={leadsHref(filter, { page: page - 1 })} rel="prev" aria-label="Página anterior">
              <ChevronLeft className="size-4" aria-hidden />
              Anterior
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled aria-disabled>
            <ChevronLeft className="size-4" aria-hidden />
            Anterior
          </Button>
        )}
        {hasNext ? (
          <Button asChild variant="outline" size="sm">
            <Link href={leadsHref(filter, { page: page + 1 })} rel="next" aria-label="Página siguiente">
              Siguiente
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled aria-disabled>
            Siguiente
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        )}
      </div>
    </nav>
  );
}
