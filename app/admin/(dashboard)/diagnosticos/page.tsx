import { ClipboardListIcon, FlameIcon, GaugeIcon, TrendingUpIcon } from "lucide-react";

import { BreakdownTable, sortByOrder } from "@/components/admin/breakdown-table";
import { DiagnosticsTable } from "@/components/admin/diagnostics-table";
import { EmptyDb } from "@/components/admin/empty-db";
import { KpiCard } from "@/components/admin/kpi-card";
import { MaturityBars } from "@/components/admin/maturity-bars";
import { PageHeader } from "@/components/admin/page-header";
import { QueryError, safeQuery } from "@/components/admin/query-error";
import { SectionCard } from "@/components/admin/section-card";
import { getDb } from "@/db/client";
import { getDiagnosticStats, listDiagnostics } from "@/db/queries/analytics";
import { RESULT_LEVELS } from "@/lib/diagnostic/calculate";
import { DIMENSIONS, DIMENSION_DESCRIPTIONS, DIMENSION_LABELS, type Dimension } from "@/lib/diagnostic/questions";
import { formatNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

const LIST_LIMIT = 100;

function resultLevelLabel(key: string): string {
  return RESULT_LEVELS.find((level) => level.key === key)?.label ?? key;
}

async function loadDiagnostics() {
  const [stats, rows] = await Promise.all([getDiagnosticStats(), listDiagnostics(LIST_LIMIT)]);

  const averages: Record<Dimension, number> = {
    finance: stats.avgFinance,
    operations: stats.avgOperations,
    people: stats.avgPeople,
    data: stats.avgData,
    scalability: stats.avgScalability,
  };
  const maturity = DIMENSIONS.map((dimension) => ({
    key: dimension,
    label: DIMENSION_LABELS[dimension],
    value: averages[dimension],
    description: DIMENSION_DESCRIPTIONS[dimension],
  }));
  const weakest = stats.total > 0 ? [...maturity].sort((a, b) => a.value - b.value)[0] : null;

  return {
    stats,
    rows,
    maturity,
    weakest,
    levels: sortByOrder(
      stats.levels,
      RESULT_LEVELS.map((level) => level.key),
    ),
    hotCount: rows.filter((row) => row.isHot).length,
  };
}

export default async function AdminDiagnosticsPage() {
  if (!getDb()) return <EmptyDb />;

  const header = (
    <PageHeader
      title="Diagnósticos"
      description="Madurez operativa de las redes que han completado el Diagnóstico Multisite: dónde están sus huecos y qué leads generan."
    />
  );

  const result = await safeQuery(loadDiagnostics);
  if (!result.ok) {
    return (
      <>
        {header}
        <QueryError message={result.error} />
      </>
    );
  }

  const { stats, rows, maturity, weakest, levels, hotCount } = result.data;

  return (
    <>
      {header}

      <section aria-label="Indicadores de diagnóstico" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Diagnósticos" value={formatNumber(stats.total)} hint="Completados, histórico" icon={<ClipboardListIcon />} />
        <KpiCard label="Madurez media" value={stats.total > 0 ? stats.avgTotal : "—"} hint="Sobre 100" icon={<GaugeIcon />} />
        <KpiCard
          label="Bloque más débil"
          value={weakest ? weakest.label : "—"}
          hint={weakest ? `Media de ${weakest.value}/100 · mayor oportunidad comercial` : "Sin diagnósticos"}
          tone="signal"
          icon={<TrendingUpIcon />}
        />
        <KpiCard
          label="HOT leads"
          value={formatNumber(hotCount)}
          hint={`Entre los últimos ${Math.min(rows.length, LIST_LIMIT)} diagnósticos`}
          tone="hot"
          icon={<FlameIcon />}
        />
      </section>

      <section aria-label="Madurez por bloque" className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Madurez media por bloque" description="Puntuación 0-100 de cada dimensión del diagnóstico">
          {stats.total > 0 ? (
            <MaturityBars items={maturity} />
          ) : (
            <p className="py-10 text-center text-sm text-gray-500">Sin diagnósticos completados todavía.</p>
          )}
        </SectionCard>
        <SectionCard title="Distribución por nivel" description="Fase de la organización según su madurez total" contentClassName="px-2">
          <BreakdownTable
            items={levels}
            labelFor={resultLevelLabel}
            keyHeader="Nivel de madurez"
            valueHeader="Diagnósticos"
            emptyText="Sin diagnósticos completados todavía."
          />
        </SectionCard>
      </section>

      <SectionCard
        title="Diagnósticos completados"
        description={`Los ${LIST_LIMIT} más recientes · F Finanzas · O Operaciones · P Personas · D Datos · E Escalabilidad`}
        contentClassName="px-2"
      >
        <DiagnosticsTable rows={rows} />
      </SectionCard>
    </>
  );
}
