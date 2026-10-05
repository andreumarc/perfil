import Link from "next/link";
import {
  ActivityIcon,
  CalendarCheckIcon,
  EyeIcon,
  FlameIcon,
  GaugeIcon,
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import { FunnelChart } from "@/components/admin/charts/funnel-chart";
import { LeadsPerWeekChart } from "@/components/admin/charts/leads-per-week-chart";
import { SectorBarChart } from "@/components/admin/charts/sector-bar-chart";
import { SourcePieChart } from "@/components/admin/charts/source-pie-chart";
import { EmptyDb } from "@/components/admin/empty-db";
import { HotLeadsList } from "@/components/admin/hot-leads-list";
import { KpiCard } from "@/components/admin/kpi-card";
import { PageHeader } from "@/components/admin/page-header";
import { QueryError, safeQuery } from "@/components/admin/query-error";
import { RecentLeadsTable } from "@/components/admin/recent-leads-table";
import { SectionCard } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { getDb } from "@/db/client";
import {
  getFunnel,
  getLeadsPerWeek,
  getOverviewStats,
  getSectorBreakdown,
  getSourceBreakdown,
} from "@/db/queries/analytics";
import { listLeads, listOpenHotLeads } from "@/db/queries/leads";
import { formatDate, formatNumber } from "@/lib/utils";
import { leadsFilterSchema } from "@/lib/validation/admin";

export const dynamic = "force-dynamic";

const RECENT_LIMIT = 8;
const HOT_LIMIT = 8;

function todayLabel() {
  const label = formatDate(new Date(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

async function loadOverview() {
  const [stats, perWeek, sources, sectors, funnel, recent, hot] = await Promise.all([
    getOverviewStats(),
    getLeadsPerWeek(12),
    getSourceBreakdown(),
    getSectorBreakdown(),
    getFunnel(30),
    listLeads(leadsFilterSchema.parse({ pageSize: 10 })),
    listOpenHotLeads(HOT_LIMIT),
  ]);
  return {
    stats,
    perWeek,
    sources,
    sectors,
    funnel,
    recent: recent.items.slice(0, RECENT_LIMIT),
    hotOpen: hot,
  };
}

export default async function AdminOverviewPage() {
  if (!getDb()) return <EmptyDb />;

  const header = (
    <PageHeader
      title="Overview"
      description={`${todayLabel()} · Estado del funnel y de los leads del CRM.`}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/leads">Ver todos los leads</Link>
        </Button>
      }
    />
  );

  const result = await safeQuery(loadOverview);
  if (!result.ok) {
    return (
      <>
        {header}
        <QueryError message={result.error} />
      </>
    );
  }

  const { stats, perWeek, sources, sectors, funnel, recent, hotOpen } = result.data;

  return (
    <>
      {header}

      <section aria-label="Indicadores clave" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total leads" value={formatNumber(stats.totalLeads)} hint="Histórico" icon={<UsersIcon />} />
        <KpiCard label="Leads 7 días" value={formatNumber(stats.leads7d)} hint="Última semana" icon={<TrendingUpIcon />} />
        <KpiCard label="Leads 30 días" value={formatNumber(stats.leads30d)} hint="Último mes" icon={<ActivityIcon />} />
        <KpiCard
          label="HOT leads"
          value={formatNumber(stats.hotLeads)}
          hint="Score ≥ umbral HOT"
          tone="hot"
          icon={<FlameIcon />}
        />
        <KpiCard label="Score medio" value={stats.avgScore} hint="Sobre 100" icon={<GaugeIcon />} />
        <KpiCard
          label="Diagnóstico → lead"
          value={`${stats.diagnosticConversion}%`}
          hint="Conversión, últimos 30 días"
          tone="signal"
          icon={<TargetIcon />}
        />
        <KpiCard
          label="Reuniones"
          value={formatNumber(stats.meetings)}
          hint="Reunión + propuesta + ganados"
          icon={<CalendarCheckIcon />}
        />
        <KpiCard label="Visitantes 30 d" value={formatNumber(stats.visitors30d)} hint="Visitantes únicos" icon={<EyeIcon />} />
      </section>

      <section aria-label="Gráficos" className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Leads por semana" description="Últimas 12 semanas · total y HOT">
          <LeadsPerWeekChart data={perWeek} />
        </SectionCard>
        <SectionCard title="Origen de los leads" description="Por utm_source · histórico">
          <SourcePieChart data={sources} />
        </SectionCard>
        <SectionCard title="Leads por sector" description="Histórico">
          <SectorBarChart data={sectors} />
        </SectionCard>
        <SectionCard
          title="Embudo de conversión"
          description="Últimos 30 días"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/analytics">Ver analytics</Link>
            </Button>
          }
        >
          <FunnelChart steps={funnel} />
        </SectionCard>
      </section>

      <section aria-label="Leads recientes" className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <SectionCard
          title="Últimos leads"
          description={`Los ${RECENT_LIMIT} más recientes`}
          contentClassName="px-0"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/leads">Ver todos</Link>
            </Button>
          }
        >
          <div className="px-2">
            <RecentLeadsTable leads={recent} />
          </div>
        </SectionCard>
        <SectionCard
          title="HOT leads abiertos"
          description="Pendientes de contactar o en conversación"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/leads?hot=1">Ver HOT</Link>
            </Button>
          }
        >
          <HotLeadsList leads={hotOpen} />
        </SectionCard>
      </section>
    </>
  );
}
