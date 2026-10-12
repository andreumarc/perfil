import Link from "next/link";
import { ActivityIcon, CalendarClockIcon, EyeIcon, InboxIcon, PercentIcon, PhoneCallIcon, TrendingUpIcon, UsersIcon } from "lucide-react";

import { BreakdownTable } from "@/components/admin/breakdown-table";
import { BreakdownPieChart } from "@/components/admin/charts/breakdown-pie-chart";
import { LeadsPerWeekChart } from "@/components/admin/charts/leads-per-week-chart";
import { EmptyDb } from "@/components/admin/empty-db";
import { KpiCard } from "@/components/admin/kpi-card";
import { PageHeader } from "@/components/admin/page-header";
import { QueryError, safeQuery } from "@/components/admin/query-error";
import { RecentLeadsTable } from "@/components/admin/recent-leads-table";
import { SectionCard } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/content/services";
import { getDb } from "@/db/client";
import { countUnassignedNew, getLeadsPerWeek, getOverviewStats, getServiceBreakdown, getSourceBreakdown, getSourcePageBreakdown } from "@/db/queries/analytics";
import { listLeads } from "@/db/queries/leads";
import { formatDate, formatNumber } from "@/lib/utils";
import { leadsFilterSchema } from "@/lib/validation/admin";
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS } from "@/types/lead";

export const dynamic = "force-dynamic";

function todayLabel() {
  const label = formatDate(new Date(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

async function loadOverview() {
  const [stats, perWeek, sources, services, pages, recent, unassigned] = await Promise.all([
    getOverviewStats(),
    getLeadsPerWeek(12),
    getSourceBreakdown(),
    getServiceBreakdown(8),
    getSourcePageBreakdown(8),
    listLeads(leadsFilterSchema.parse({ pageSize: 10 })),
    countUnassignedNew(),
  ]);
  return { stats, perWeek, sources, services, pages, recent: recent.items.slice(0, 8), unassigned };
}

export default async function AdminOverviewPage() {
  if (!getDb()) return <EmptyDb />;
  const header = (
    <PageHeader
      title="Resumen"
      description={`${todayLabel()} · Estado de las solicitudes y del seguimiento comercial.`}
      actions={<Button asChild variant="outline" size="sm"><Link href="/admin/leads">Ver todas las solicitudes</Link></Button>}
    />
  );
  const result = await safeQuery(loadOverview);
  if (!result.ok) return (<>{header}<QueryError message={result.error} /></>);
  const { stats, perWeek, sources, services, pages, recent, unassigned } = result.data;
  const serviceLabels = Object.fromEntries(SERVICES.map((s) => [s.slug, s.shortName]));
  const inProgress = stats.byStatus.CONTACTED + stats.byStatus.VISIT_SCHEDULED + stats.byStatus.QUOTE_SENT;

  return (
    <>
      {header}
      <section aria-label="Indicadores clave" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Nuevas sin atender" value={formatNumber(stats.byStatus.NEW)} hint={unassigned ? `${unassigned} sin responsable` : "Todas asignadas"} tone="copper" icon={<InboxIcon />} />
        <KpiCard label="Solicitudes 7 días" value={formatNumber(stats.leads7d)} hint={`${formatNumber(stats.leads30d)} en 30 días`} icon={<TrendingUpIcon />} />
        <KpiCard label="En conversación" value={formatNumber(inProgress)} hint="Contactadas, visitas y presupuestos" icon={<PhoneCallIcon />} />
        <KpiCard label="Ganadas" value={formatNumber(stats.byStatus.WON)} hint={`${stats.byStatus.LOST} perdidas · ${stats.winRate}% histórico`} tone="olive" icon={<PercentIcon />} />
        <KpiCard label="Tasa de contacto 30 d" value={`${stats.contactRate30d}%`} hint="Solicitudes que han salido de 'Nuevo'" icon={<ActivityIcon />} />
        <KpiCard label="Tareas vencidas" value={formatNumber(stats.overdueTasks)} hint={`${stats.tasksToday} para hoy`} tone={stats.overdueTasks ? "hot" : "default"} icon={<CalendarClockIcon />} />
        <KpiCard label="Visitantes 30 d" value={formatNumber(stats.visitors30d)} hint={`${formatNumber(stats.pageViews30d)} páginas vistas`} icon={<EyeIcon />} />
        <KpiCard label="Total solicitudes" value={formatNumber(stats.totalLeads)} hint="Histórico" icon={<UsersIcon />} />
      </section>

      <section aria-label="Gráficos" className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Solicitudes por semana" description="Últimas 12 semanas · total y ganadas"><LeadsPerWeekChart data={perWeek} /></SectionCard>
        <SectionCard title="Origen de las solicitudes" description="Por formulario o canal · histórico"><BreakdownPieChart data={sources} labels={LEAD_SOURCE_LABELS} /></SectionCard>
        <SectionCard title="Servicios más solicitados" description="Histórico"><BreakdownTable items={services} labels={{ ...serviceLabels, "sin-servicio": "Sin servicio indicado" }} /></SectionCard>
        <SectionCard title="Páginas que generan contactos" description="Página desde la que se envió el formulario"><BreakdownTable items={pages} /></SectionCard>
      </section>

      <section aria-label="Estados" className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
        <SectionCard title="Últimas solicitudes" description="Las 8 más recientes" contentClassName="px-0" action={<Button asChild variant="ghost" size="sm"><Link href="/admin/leads">Ver todas</Link></Button>}>
          <div className="px-2"><RecentLeadsTable leads={recent} serviceNames={serviceLabels} /></div>
        </SectionCard>
        <SectionCard title="Embudo comercial" description="Solicitudes por estado · histórico">
          <BreakdownTable items={(Object.keys(stats.byStatus) as (keyof typeof stats.byStatus)[]).map((k) => ({ key: k, value: stats.byStatus[k] }))} labels={LEAD_STATUS_LABELS} />
        </SectionCard>
      </section>
    </>
  );
}
