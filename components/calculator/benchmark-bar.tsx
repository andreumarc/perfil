import { AlertCircleIcon, ArrowDownRightIcon, ArrowUpRightIcon, CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type CalculatorMetric, type MetricStatus } from "@/lib/ebitda-benchmark";
import { cn, formatPercent } from "@/lib/utils";

const MARKER_COLOR: Record<MetricStatus, string> = {
  attention: "bg-destructive",
  ok: "bg-navy-900",
  strong: "bg-signal",
};

const BADGE_VARIANT: Record<MetricStatus, "destructive" | "secondary" | "signal"> = {
  attention: "destructive",
  ok: "secondary",
  strong: "signal",
};

const STATUS_ICON: Record<MetricStatus, typeof CheckIcon> = {
  attention: AlertCircleIcon,
  ok: CheckIcon,
  strong: CheckIcon,
};

/**
 * Calcula el dominio del eje: la banda de referencia centrada con margen a
 * ambos lados y ampliado si el valor del usuario cae fuera.
 */
function axisDomain(value: number, [low, high]: [number, number]): [number, number] {
  const padding = Math.max(high - low, 8);
  let min = Math.max(0, low - padding);
  let max = Math.min(100, high + padding);
  if (value < min) min = Math.max(0, value - 3);
  if (value > max) max = Math.min(100, value + 3);
  if (max - min < 1) max = Math.min(100, min + 1);
  return [min, max];
}

/**
 * Barra de benchmark: banda de referencia sombreada (navy-100) y marcador con
 * el valor del usuario. El estado nunca depende solo del color: lleva badge
 * con texto e icono y una descripción accesible.
 */
export function BenchmarkBar({ metric, className }: { metric: CalculatorMetric; className?: string }) {
  const { value, range, status, direction, label } = metric;
  const [low, high] = range;
  const [min, max] = axisDomain(value, range);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const Icon = STATUS_ICON[status];
  const DirectionIcon = direction === "higher_is_better" ? ArrowUpRightIcon : ArrowDownRightIcon;

  const description = `${label}: ${formatPercent(value, 1)}. Rango de referencia ${formatPercent(low)} a ${formatPercent(high)}. ${STATUS_LABELS[status]}.`;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-navy-900">{label}</p>
          <span className="inline-flex items-center gap-0.5 text-[11px] text-gray-500">
            <DirectionIcon className="size-3" aria-hidden />
            {direction === "higher_is_better" ? "más es mejor" : "menos es mejor"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="tabular text-base font-semibold text-navy-900">{formatPercent(value, 1)}</span>
          <Badge variant={BADGE_VARIANT[status]}>
            <Icon aria-hidden />
            {STATUS_LABELS[status]}
          </Badge>
        </div>
      </div>

      <div className="mt-3" role="img" aria-label={description}>
        <div className="relative h-2.5 w-full rounded-full bg-gray-100">
          <div
            className="absolute inset-y-0 rounded-full bg-navy-100"
            style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
          />
          <div
            className={cn(
              "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(10,26,51,0.35)]",
              MARKER_COLOR[status],
            )}
            style={{ left: `${pct(value)}%` }}
          />
        </div>
        <div className="tabular relative mt-1.5 h-4 text-[11px] text-gray-500">
          <span className="absolute -translate-x-1/2" style={{ left: `${pct(low)}%` }}>
            {formatPercent(low)}
          </span>
          <span className="absolute -translate-x-1/2" style={{ left: `${pct(high)}%` }}>
            {formatPercent(high)}
          </span>
        </div>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        <span className="font-medium text-navy-900">Rango de referencia {formatPercent(low)}–{formatPercent(high)}.</span>{" "}
        {metric.comment}
      </p>
    </div>
  );
}
