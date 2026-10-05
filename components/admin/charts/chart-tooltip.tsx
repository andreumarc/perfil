"use client";

import type { ReactNode } from "react";

import { formatNumber } from "@/lib/utils";

interface TooltipItem {
  name?: string | number;
  value?: unknown;
  color?: string;
  fill?: string;
  payload?: unknown;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<TooltipItem>;
  label?: ReactNode;
  /** Formatea la cabecera (p. ej. la fecha del eje X). */
  formatLabel?: (label: ReactNode, payload: ReadonlyArray<TooltipItem>) => ReactNode;
  /** Formatea cada valor. */
  formatValue?: (value: number, name: string) => string;
  /** Oculta la cabecera (gráficos de una sola serie). */
  hideLabel?: boolean;
}

/**
 * Tooltip sobrio para Recharts: fondo blanco, borde gris, cifras tabulares.
 * Se pasa como `content={<ChartTooltip />}`; Recharts inyecta active/payload/label.
 */
export function ChartTooltip({ active, payload, label, formatLabel, formatValue, hideLabel }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const heading = hideLabel ? null : formatLabel ? formatLabel(label, payload) : label;

  return (
    <div className="min-w-36 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-[0_4px_16px_rgba(16,24,40,0.08)]">
      {heading !== null && heading !== undefined && heading !== "" ? (
        <p className="mb-1.5 font-semibold text-navy-900">{heading}</p>
      ) : null}
      <ul className="space-y-1">
        {payload.map((item, index) => {
          const raw = item.value;
          const value = typeof raw === "number" ? raw : Number(raw ?? 0);
          const name = String(item.name ?? "");
          return (
            <li key={`${name}-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-gray-600">
                <span
                  aria-hidden
                  className="inline-block size-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color ?? item.fill ?? "#0a1a33" }}
                />
                {name}
              </span>
              <span className="tabular font-semibold text-navy-900">
                {formatValue ? formatValue(value, name) : formatNumber(value)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
