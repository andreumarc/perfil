"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatNumber } from "@/lib/utils";

import { ChartTooltip } from "./chart-tooltip";
import { CATEGORICAL_COLORS, percentOf } from "./palette";

export interface SourceDatum {
  key: string;
  value: number;
}

const MAX_SLICES = 5;

const SOURCE_LABELS: Record<string, string> = {
  directo: "Directo / sin UTM",
  linkedin: "LinkedIn",
  google: "Google",
  newsletter: "Newsletter",
  email: "Email",
  referral: "Referral",
};

function labelForSource(key: string): string {
  return SOURCE_LABELS[key.toLowerCase()] ?? key;
}

/**
 * Donut de leads por utm_source con leyenda a la derecha (valor y %).
 * Agrupa a partir del sexto origen en "Otros" para no reciclar colores.
 */
export function SourcePieChart({ data, size = 220 }: { data: SourceDatum[]; size?: number }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, MAX_SLICES - 1);
  const tail = sorted.slice(MAX_SLICES - 1);
  const slices =
    tail.length > 1
      ? [...head, { key: "otros", value: tail.reduce((acc, item) => acc + item.value, 0) }]
      : sorted.slice(0, MAX_SLICES);

  const total = slices.reduce((acc, item) => acc + item.value, 0);
  const items = slices.map((slice, index) => ({
    name: slice.key === "otros" ? "Otros orígenes" : labelForSource(slice.key),
    value: slice.value,
    color: CATEGORICAL_COLORS[index] ?? CATEGORICAL_COLORS[CATEGORICAL_COLORS.length - 1],
  }));

  if (total === 0) {
    return <p className="py-10 text-center text-sm text-gray-500">Sin leads con origen registrado.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height={size}>
          <PieChart>
            <Pie
              data={items}
              dataKey="value"
              nameKey="name"
              innerRadius="64%"
              outerRadius="96%"
              paddingAngle={2}
              cornerRadius={3}
              stroke="#ffffff"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {items.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              content={
                <ChartTooltip hideLabel formatValue={(value) => `${formatNumber(value)} · ${percentOf(value, total)}%`} />
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="tabular text-2xl font-semibold tracking-tight text-navy-900">{formatNumber(total)}</span>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">leads</span>
        </div>
      </div>

      <ul className="w-full min-w-0 flex-1 space-y-2.5 text-sm" aria-label="Leyenda de orígenes">
        {items.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2.5 text-gray-700">
              <span aria-hidden className="size-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
              <span className="truncate">{item.name}</span>
            </span>
            <span className="tabular shrink-0 text-right">
              <span className="font-semibold text-navy-900">{formatNumber(item.value)}</span>
              <span className="ml-2 inline-block w-9 text-gray-500">{percentOf(item.value, total)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
