"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { SECTORS, labelFor, type Sector } from "@/types/lead";

import { ChartTooltip } from "./chart-tooltip";
import { AXIS_TICK, CHART_COLORS, CURSOR_FILL, GRID_STROKE } from "./palette";

export interface SectorDatum {
  key: string;
  value: number;
}

const ROW_HEIGHT = 34;

/** Etiquetas cortas para el eje (las de SECTORS son demasiado largas para móvil). */
const SHORT_SECTOR_LABELS: Record<Sector, string> = {
  dental: "Dental",
  veterinaria: "Veterinaria",
  healthcare: "Healthcare",
  retail: "Retail",
  fitness: "Fitness",
  automocion: "Automoción",
  franquicias: "Franquicias",
  restauracion: "Restauración",
  private_equity: "Private Equity",
  otros: "Otros",
};

function sectorLabel(key: string): string {
  return key in SHORT_SECTOR_LABELS ? SHORT_SECTOR_LABELS[key as Sector] : labelFor(SECTORS, key);
}

/** Barras horizontales de leads por sector, con etiquetas de SECTORS. */
export function SectorBarChart({ data }: { data: SectorDatum[] }) {
  const rows = [...data]
    .sort((a, b) => b.value - a.value)
    .map((item) => ({ key: item.key, label: sectorLabel(item.key), value: item.value }));

  if (rows.length === 0 || rows.every((row) => row.value === 0)) {
    return <p className="py-10 text-center text-sm text-gray-500">Sin leads con sector informado.</p>;
  }

  const height = Math.max(200, rows.length * ROW_HEIGHT + 24);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 32, left: 0, bottom: 0 }} barCategoryGap="32%">
        <CartesianGrid horizontal={false} stroke={GRID_STROKE} />
        <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={112}
          tick={{ ...AXIS_TICK, fill: "#344054" }}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <Tooltip cursor={{ fill: CURSOR_FILL }} content={<ChartTooltip />} />
        <Bar dataKey="value" name="Leads" fill={CHART_COLORS.navy} radius={[0, 3, 3, 0]} maxBarSize={20} isAnimationActive={false}>
          <LabelList dataKey="value" position="right" fill="#475467" fontSize={11} className="tabular" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
