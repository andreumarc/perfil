import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, X } from "lucide-react";

import { LeadsFilters } from "@/components/admin/leads/leads-filters";
import { LeadsPagination } from "@/components/admin/leads/leads-pagination";
import { LeadsTable } from "@/components/admin/leads/leads-table";
import { LEADS_PATH, filterToSearchParams, hasActiveFilters, leadsHref } from "@/components/admin/leads/query-string";
import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/content/services";
import { getDb } from "@/db/client";
import { countLeads, listLeads } from "@/db/queries/leads";
import { getSession } from "@/lib/auth/guard";
import { listUsers } from "@/lib/auth/users";
import { formatNumber } from "@/lib/utils";
import { leadsFilterSchema, type LeadsFilter } from "@/lib/validation/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Solicitudes", robots: { index: false, follow: false } };

type SearchParams = Record<string, string | string[] | undefined>;

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
  if (!getDb()) return <EmptyDb />;
  const session = await getSession();

  const [result, newCount, users] = await Promise.all([listLeads(filter), countLeads({ status: "NEW" }), listUsers()]);
  if (result.items.length === 0 && result.total > 0 && filter.page > result.pageCount) {
    redirect(leadsHref(filter, { page: result.pageCount }));
  }

  const filtersActive = hasActiveFilters(filter);
  const exportQs = filterToSearchParams(filter, { page: 1 }).toString();
  const exportHref = exportQs ? `/api/admin/leads/export?${exportQs}` : "/api/admin/leads/export";
  const serviceNames = Object.fromEntries(SERVICES.map((s) => [s.slug, s.shortName]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitudes"
        description={
          <>
            <span className="tabular font-medium text-ink-900">{formatNumber(result.total)}</span> {result.total === 1 ? "solicitud" : "solicitudes"}
            {filtersActive ? " con estos filtros" : ""} · <span className="tabular font-medium text-copper-600">{formatNumber(newCount)}</span> nuevas
          </>
        }
        actions={
          <>
            {filtersActive ? (
              <Button asChild variant="ghost" size="sm"><Link href={LEADS_PATH}><X className="size-4" aria-hidden />Limpiar filtros</Link></Button>
            ) : null}
            {session?.role === "admin" ? (
              <Button asChild variant="outline" size="sm"><a href={exportHref} download><Download className="size-4" aria-hidden />Exportar CSV</a></Button>
            ) : null}
          </>
        }
      />
      {sp.deleted === "1" ? (
        <Alert variant="success"><AlertDescription><p>Solicitud eliminada definitivamente.</p></AlertDescription></Alert>
      ) : null}
      <LeadsFilters filter={filter} options={{ services: SERVICES.map((s) => ({ slug: s.slug, name: s.shortName })), users: users.filter((u) => u.isActive).map((u) => ({ id: u.id, name: u.name })) }} />
      <LeadsTable items={result.items} filter={filter} serviceNames={serviceNames} />
      <LeadsPagination filter={filter} page={result.page} pageCount={result.pageCount} pageSize={result.pageSize} total={result.total} />
    </div>
  );
}
