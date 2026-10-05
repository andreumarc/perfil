import Link from "next/link";

import { HotBadge, ScorePill } from "@/components/admin/badges";
import { EmptyHint } from "@/components/admin/section-card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DiagnosticRow } from "@/db/queries/analytics";
import { RESULT_LEVELS, type ResultLevelKey } from "@/lib/diagnostic/calculate";
import { DIMENSION_LABELS } from "@/lib/diagnostic/questions";
import { cn, formatDate } from "@/lib/utils";
import { NUMBER_LOCATIONS, SECTORS, labelFor } from "@/types/lead";

/** Etiqueta corta del nivel de madurez para celdas de tabla. */
const SHORT_LEVEL_LABELS: Record<ResultLevelKey, string> = {
  reactive: "Reactiva",
  structuring: "Estructuración",
  professionalizing: "Profesionalización",
  scalable: "Escalable",
};

const LEVEL_VARIANT: Record<ResultLevelKey, React.ComponentProps<typeof Badge>["variant"]> = {
  reactive: "destructive",
  structuring: "warning",
  professionalizing: "secondary",
  scalable: "signal",
};

function isResultLevelKey(value: string): value is ResultLevelKey {
  return RESULT_LEVELS.some((level) => level.key === value);
}

export function shortResultLevelLabel(key: string): string {
  return isResultLevelKey(key) ? SHORT_LEVEL_LABELS[key] : key;
}

/** Mini celda 0-100 con tono según madurez (menos madurez = más oportunidad, pero peor situación). */
function ScoreCell({ value }: { value: number }) {
  const tone =
    value >= 76
      ? "bg-signal-light text-signal-dark"
      : value >= 56
        ? "bg-navy-50 text-navy-800"
        : value >= 36
          ? "bg-amber-50 text-amber-800"
          : "bg-red-50 text-red-800";
  return (
    <span className={cn("tabular inline-flex min-w-9 items-center justify-center rounded px-1.5 py-0.5 text-xs font-semibold", tone)}>
      {value}
    </span>
  );
}

const DIMENSION_COLUMNS: { key: keyof Pick<
  DiagnosticRow,
  "financeScore" | "operationsScore" | "peopleScore" | "dataScore" | "scalabilityScore"
>; short: string; title: string }[] = [
  { key: "financeScore", short: "F", title: DIMENSION_LABELS.finance },
  { key: "operationsScore", short: "O", title: DIMENSION_LABELS.operations },
  { key: "peopleScore", short: "P", title: DIMENSION_LABELS.people },
  { key: "dataScore", short: "D", title: DIMENSION_LABELS.data },
  { key: "scalabilityScore", short: "E", title: DIMENSION_LABELS.scalability },
];

/** Tabla de diagnósticos completados con detalle por bloque y datos del lead. */
export function DiagnosticsTable({ rows }: { rows: DiagnosticRow[] }) {
  if (rows.length === 0) return <EmptyHint>Todavía no se ha completado ningún diagnóstico.</EmptyHint>;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Fecha</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Centros</TableHead>
          <TableHead className="text-right">Madurez</TableHead>
          {DIMENSION_COLUMNS.map((column) => (
            <TableHead key={column.key} className="text-center" title={column.title}>
              <abbr title={column.title} className="no-underline">
                {column.short}
              </abbr>
            </TableHead>
          ))}
          <TableHead>Nivel</TableHead>
          <TableHead className="text-right">Lead score</TableHead>
          <TableHead>HOT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="tabular text-gray-500">{formatDate(row.createdAt)}</TableCell>
            <TableCell>
              <Link
                href={`/admin/leads/${row.leadId}`}
                className="block max-w-[220px] truncate font-medium text-navy-900 underline-offset-4 hover:underline"
              >
                {row.company}
              </Link>
            </TableCell>
            <TableCell className="text-gray-700">
              {row.firstName} {row.lastName}
            </TableCell>
            <TableCell className="max-w-[180px] truncate text-gray-600">{labelFor(SECTORS, row.sector)}</TableCell>
            <TableCell className="text-gray-600">{labelFor(NUMBER_LOCATIONS, row.numberLocations)}</TableCell>
            <TableCell className="tabular text-right font-semibold text-navy-900">{row.totalScore}</TableCell>
            {DIMENSION_COLUMNS.map((column) => (
              <TableCell key={column.key} className="text-center">
                <ScoreCell value={row[column.key]} />
              </TableCell>
            ))}
            <TableCell>
              <Badge variant={isResultLevelKey(row.resultLevel) ? LEVEL_VARIANT[row.resultLevel] : "muted"}>
                {shortResultLevelLabel(row.resultLevel)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <ScorePill score={row.score} />
            </TableCell>
            <TableCell>
              <HotBadge isHot={row.isHot} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
