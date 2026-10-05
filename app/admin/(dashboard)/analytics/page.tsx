import { ActivityIcon, ClipboardCheckIcon, ClipboardListIcon, EyeIcon, TargetIcon, UsersIcon } from "lucide-react";

import { BreakdownTable, sortByOrder } from "@/components/admin/breakdown-table";
import { EventsByDayChart } from "@/components/admin/charts/events-by-day-chart";
import { FunnelChart } from "@/components/admin/charts/funnel-chart";
import { percentOf } from "@/components/admin/charts/palette";
import { EmptyDb } from "@/components/admin/empty-db";
import { KpiCard } from "@/components/admin/kpi-card";
import { PageHeader } from "@/components/admin/page-header";
import { QueryError, safeQuery } from "@/components/admin/query-error";
import { SectionCard } from "@/components/admin/section-card";
import { getDb } from "@/db/client";
import {
  getEventTypeCounts,
  getEventsByDay,
  getFunnel,
  getLevelBreakdown,
  getLocationsBreakdown,
  getRevenueBreakdown,
  getSourceBreakdown,
  getTopPages,
} from "@/db/queries/analytics";
import { EVENT_LABELS, type EventType } from "@/lib/analytics/events";
import { formatNumber } from "@/lib/utils";
import {
  COMPANY_REVENUE,
  LEAD_LEVELS,
  LEAD_LEVEL_LABELS,
  NUMBER_LOCATIONS,
  labelFor,
  type LeadLevel,
} from "@/types/lead";

export const dynamic = "force-dynamic";

const DAYS = 30;

function eventLabel(key: string): string {
  return key in EVENT_LABELS ? EVENT_LABELS[key as EventType] : key;
}

function levelLabel(key: string): string {
  return (LEAD_LEVELS as readonly string[]).includes(key) ? LEAD_LEVEL_LABELS[key as LeadLevel] : key;
}

async function loadAnalytics() {
  const [funnel, byDay, eventTypes, topPages, sources, levels, revenue, locations] = await Promise.all([
    getFunnel(DAYS),
    getEventsByDay(DAYS),
    getEventTypeCounts(DAYS),
    getTopPages(DAYS, 10),
    getSourceBreakdown(),
    getLevelBreakdown(),
    getRevenueBreakdown(),
    getLocationsBreakdown(),
  ]);
  const value = (key: string) => funnel.find((step) => step.key === key)?.value ?? 0;
  return {
    funnel,
    byDay,
    eventTypes,
    topPages,
    sources,
    levels: sortByOrder(levels, LEAD_LEVELS),
    revenue: sortByOrder(
      revenue,
      COMPANY_REVENUE.map((item) => item.value),
    ),
    locations: sortByOrder(
      locations,
      NUMBER_LOCATIONS.map((item) => item.value),
    ),
    kpis: {
      visitors: value("visitors"),
      started: value("diagnostic_started"),
      completed: value("diagnostic_completed"),
      leads: value("leads"),
    },
  };
}

export default async function AdminAnalyticsPage() {
  if (!getDb()) return <EmptyDb />;

  const header = (
    <PageHeader
      title="Analytics del funnel"
      description={`Últimos ${DAYS} días · de visitante anónimo a reunión. Los desgloses por fuente, nivel, facturación y centros son históricos.`}
    />
  );

  const result = await safeQuery(loadAnalytics);
  if (!result.ok) {
    return (
      <>
        {header}
        <QueryError message={result.error} />
      </>
    );
  }

  const { funnel, byDay, eventTypes, topPages, sources, levels, revenue, locations, kpis } = result.data;
  const conversionRate = percentOf(kpis.leads, kpis.visitors);
  const completionRate = percentOf(kpis.completed, kpis.started);

  return (
    <>
      {header}

      <section aria-label="Indicadores del funnel" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Visitantes" value={formatNumber(kpis.visitors)} hint={`Únicos, ${DAYS} d`} icon={<EyeIcon />} />
        <KpiCard label="Diag. iniciados" value={formatNumber(kpis.started)} hint="Primer paso del diagnóstico" icon={<ClipboardListIcon />} />
        <KpiCard label="Diag. completados" value={formatNumber(kpis.completed)} hint="Resultado generado" icon={<ClipboardCheckIcon />} />
        <KpiCard label="Leads" value={formatNumber(kpis.leads)} hint="Todos los formularios" icon={<UsersIcon />} />
        <KpiCard label="Conversion rate" value={`${conversionRate}%`} hint="Leads / visitantes" tone="signal" icon={<TargetIcon />} />
        <KpiCard label="Finalización" value={`${completionRate}%`} hint="Completados / iniciados" icon={<ActivityIcon />} />
      </section>

      <section aria-label="Embudo y actividad" className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <SectionCard title="Embudo de conversión" description={`Últimos ${DAYS} días · % respecto al paso anterior`}>
          <FunnelChart steps={funnel} size="lg" />
        </SectionCard>
        <SectionCard title="Actividad diaria" description="Páginas vistas, diagnósticos iniciados y leads creados">
          <EventsByDayChart data={byDay} />
        </SectionCard>
      </section>

      <section aria-label="Eventos y páginas" className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Eventos por tipo" description={`Últimos ${DAYS} días`} contentClassName="px-2">
          <BreakdownTable items={eventTypes} labelFor={eventLabel} keyHeader="Evento" valueHeader="Eventos" />
        </SectionCard>
        <SectionCard title="Top páginas" description={`Páginas vistas, últimos ${DAYS} días`} contentClassName="px-2">
          <BreakdownTable items={topPages} keyHeader="Ruta" valueHeader="Vistas" mono />
        </SectionCard>
      </section>

      <section aria-label="Desgloses de leads" className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Leads por fuente" description="utm_source · histórico" contentClassName="px-2">
          <BreakdownTable items={sources} keyHeader="Fuente" mono />
        </SectionCard>
        <SectionCard title="Leads por nivel" description="Según lead scoring · histórico" contentClassName="px-2">
          <BreakdownTable items={levels} labelFor={levelLabel} keyHeader="Nivel" />
        </SectionCard>
        <SectionCard title="Leads por facturación" description="Facturación anual declarada" contentClassName="px-2">
          <BreakdownTable
            items={revenue}
            labelFor={(key) => (key === "n/d" ? "No informada" : labelFor(COMPANY_REVENUE, key))}
            keyHeader="Facturación"
          />
        </SectionCard>
        <SectionCard title="Leads por número de centros" description="Tamaño de la red" contentClassName="px-2">
          <BreakdownTable
            items={locations}
            labelFor={(key) => (key === "n/d" ? "No informado" : labelFor(NUMBER_LOCATIONS, key))}
            keyHeader="Centros"
          />
        </SectionCard>
      </section>
    </>
  );
}
