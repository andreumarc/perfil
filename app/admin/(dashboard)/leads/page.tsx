import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, X } from "lucide-react";

import { LeadsFilters } from "@/components/admin/leads/leads-filters";
import { LeadsPagination } from "@/components/admin/leads/leads-pagination";
import { LeadsTable } from "@/components/admin/leads/leads-table";
import {
  LEADS_PATH,
  filterToSearchParams,
  hasActiveFilters,
  leadsHref,
} from "@/components/admin/leads/query-string";
import { PageHeader } from "@/components/admin/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getDb } from "@/db/client";
import { countLeads, listLeads } from "@/db/queries/leads";
import { formatNumber } from "@/lib/utils";
import { leadsFilterSchema, type LeadsFilter } from "@/lib/validation/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads · Admin",
  robots: { index: false, follow: false },
};

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Valida los search params. Si algún parámetro es inválido se descarta solo
 * ese parámetro (en lugar de perder todos los filtros).
 */
function parseFilter(sp: SearchParams): LeadsFilter {
  const flat: Record<string, string> = {};
  for (const [key, raw] of Object.entries(sp)) {
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value !== undefined && value !== "") flat[key] = value;
  }
  const parsed = leadsFilterSchema.safeParse(flat);
  if (parsed.success) return parsed.data;

  const invalidKeys = new Set(parsed.error.issues.map((issue) => String(issue.path[0] ?? "")));
  const cleaned = Object.fromEntries(Object.entries(flat).filter(([key]) => !invalidKeys.has(key)));
  const retry = leadsFilterSchema.safeParse(cleaned);
  return retry.success ? retry.data : leadsFilterSchema.parse({});
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const filter = parseFilter(sp);

  if (!getDb()) {
    return (
      <div className="space-y-6">
        <PageHeader title="Leads" description="CRM de leads captados por la web." />
        <Alert variant="warning">
          <AlertTitle>Base de datos no configurada (DATABASE_URL)</AlertTitle>
          <AlertDescription>
            <p>
              Ejecuta <code className="font-mono text-xs">npm run db:migrate</code> y{" "}
              <code className="font-mono text-xs">npm run db:seed</code> con una DATABASE_URL de Neon para activar el
              CRM.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const [result, hotCount] = await Promise.all([
    listLeads(filter),
    // Cuando el filtro ya es "solo HOT", el total coincide y no hace falta otra consulta.
    filter.hot === "1" ? Promise.resolve(null) : countLeads({ ...filter, hot: "1" }),
  ]);

  // Página fuera de rango (p. ej. tras cambiar filtros): vuelve a la última válida.
  if (result.items.length === 0 && result.total > 0 && filter.page > result.pageCount) {
    redirect(leadsHref(filter, { page: result.pageCount }));
  }

  const hotTotal = hotCount ?? result.total;
  const filtersActive = hasActiveFilters(filter);
  const exportQs = filterToSearchParams(filter, { page: 1 }).toString();
  const exportHref = exportQs ? `/api/admin/leads/export?${exportQs}` : "/api/admin/leads/export";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description={
          <>
            <span className="tabular font-medium text-navy-900">{formatNumber(result.total)}</span>{" "}
            {result.total === 1 ? "lead" : "leads"}
            {filtersActive ? " con estos filtros" : ""} ·{" "}
            <span className="tabular font-medium text-red-600">{formatNumber(hotTotal)}</span> HOT
          </>
        }
        actions={
          <>
            {filtersActive ? (
              <Button asChild variant="ghost" size="sm">
                <Link href={LEADS_PATH}>
                  <X className="size-4" aria-hidden />
                  Limpiar filtros
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" size="sm">
              <a href={exportHref} download>
                <Download className="size-4" aria-hidden />
                Exportar CSV
              </a>
            </Button>
          </>
        }
      />

      <LeadsFilters filter={filter} />

      <LeadsTable items={result.items} filter={filter} />

      <LeadsPagination
        filter={filter}
        page={result.page}
        pageCount={result.pageCount}
        pageSize={result.pageSize}
        total={result.total}
      />
    </div>
  );
}
