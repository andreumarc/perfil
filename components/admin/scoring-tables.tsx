import { LevelBadge } from "@/components/admin/badges";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LEAD_LEVEL_THRESHOLDS, SCORING_WEIGHTS } from "@/lib/lead-scoring";
import {
  COMPANY_REVENUE,
  HOT_LEAD_THRESHOLD,
  JOB_TITLES,
  MAIN_PROBLEMS,
  NUMBER_LOCATIONS,
  SECTORS,
  labelFor,
} from "@/types/lead";

const PAIN_LABELS: Record<keyof typeof SCORING_WEIGHTS.operationalPain, string> = {
  noEbitdaPerCenter: "Sin EBITDA por centro",
  partialEbitdaPerCenter: "EBITDA por centro parcial o con retraso",
  noCommonKpis: "Sin KPIs comunes",
  partialCommonKpis: "KPIs comunes parciales",
  noDashboard: "Sin cuadro de mando",
  partialDashboard: "Cuadro de mando parcial",
  differentProcesses: "Cada centro opera diferente",
  partialProcesses: "Procesos parcialmente comunes",
  recentAcquisition: "Adquisición reciente",
  consideringAcquisition: "Estudiando adquisiciones",
};

interface WeightRow {
  key: string;
  label: string;
  points: number;
}

function rowsFrom(
  weights: Record<string, number>,
  list: readonly { value: string; label: string }[],
): WeightRow[] {
  return Object.entries(weights).map(([key, points]) => ({ key, label: labelFor(list, key), points }));
}

function WeightTable({ title, max, rows }: { title: string; max: number; rows: WeightRow[] }) {
  return (
    <div className="rounded-lg border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
        <p className="text-sm font-semibold text-navy-900">{title}</p>
        <span className="tabular text-xs text-gray-500">máx. {max} pts</span>
      </div>
      <Table>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.key}>
              <TableCell className="whitespace-normal py-2 text-gray-700">{row.label}</TableCell>
              <TableCell className="tabular w-16 py-2 text-right font-semibold text-navy-900">{row.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function maxOf(record: Record<string, number>) {
  return Math.max(...Object.values(record));
}

/** Tablas de pesos del lead scoring y umbrales de nivel / HOT. Solo lectura. */
export function ScoringTables() {
  const w = SCORING_WEIGHTS;
  const painRows: WeightRow[] = (Object.keys(w.operationalPain) as (keyof typeof w.operationalPain)[]).map((key) => ({
    key,
    label: PAIN_LABELS[key],
    points: w.operationalPain[key],
  }));
  const totalMax =
    maxOf(w.locations) + maxOf(w.revenue) + maxOf(w.role) + maxOf(w.sector) + maxOf(w.mainProblem) + w.operationalPainMax + w.privateEquity;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <WeightTable title="Número de centros" max={maxOf(w.locations)} rows={rowsFrom(w.locations, NUMBER_LOCATIONS)} />
        <WeightTable title="Facturación" max={maxOf(w.revenue)} rows={rowsFrom(w.revenue, COMPANY_REVENUE)} />
        <WeightTable title="Cargo" max={maxOf(w.role)} rows={rowsFrom(w.role, JOB_TITLES)} />
        <WeightTable title="Sector" max={maxOf(w.sector)} rows={rowsFrom(w.sector, SECTORS)} />
        <WeightTable title="Problema principal" max={maxOf(w.mainProblem)} rows={rowsFrom(w.mainProblem, MAIN_PROBLEMS)} />
        <WeightTable title="Dolor operativo (diagnóstico)" max={w.operationalPainMax} rows={painRows} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 px-4 py-2.5">
            <p className="text-sm font-semibold text-navy-900">Niveles de lead</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nivel</TableHead>
                <TableHead className="text-right">Rango de score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LEAD_LEVEL_THRESHOLDS.map((threshold) => (
                <TableRow key={threshold.level}>
                  <TableCell>
                    <LevelBadge level={threshold.level} />
                  </TableCell>
                  <TableCell className="tabular text-right font-medium text-navy-900">
                    {threshold.min} – {threshold.max}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Badge variant="hot">HOT LEAD</Badge>
                </TableCell>
                <TableCell className="tabular text-right font-medium text-navy-900">≥ {HOT_LEAD_THRESHOLD}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
          <p className="text-sm font-semibold text-navy-900">Cómo se calcula</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>
              Cada bloque aporta sus puntos; la suma máxima es <span className="tabular font-medium text-navy-900">{totalMax}</span>{" "}
              y el resultado se normaliza a 0-100.
            </li>
            <li>
              Bonus Private Equity: <span className="tabular font-medium text-navy-900">+{w.privateEquity}</span> pts si el
              sector es Private Equity o el cargo es de inversión.
            </li>
            <li>
              Un lead es HOT a partir de <span className="tabular font-medium text-navy-900">{HOT_LEAD_THRESHOLD}</span>{" "}
              puntos y se notifica con prioridad.
            </li>
          </ul>
          <p className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
            Edita <code className="font-mono text-navy-900">lib/lead-scoring.ts</code> para modificar los pesos. El resto del
            sistema (niveles, HOT, desglose en la ficha del lead) se adapta automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
}
