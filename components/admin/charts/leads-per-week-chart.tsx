"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "./chart-tooltip";
import { AXIS_LINE, AXIS_TICK, CHART_COLORS, CURSOR_FILL, GRID_STROKE, shortDate } from "./palette";

export interface WeekDatum {
  /** Lunes de la semana en formato YYYY-MM-DD. */
  week: string;
  leads: number;
  hot: number;
}

/** Leads por semana (barras dobles: total y HOT). 12 semanas por defecto. */
export function LeadsPerWeekChart({ data, height = 280 }: { data: WeekDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap="28%" barGap={3}>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} />
        <XAxis
          dataKey="week"
          tickFormatter={(value: string) => shortDate(value)}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={AXIS_LINE}
          interval="preserveStartEnd"
          minTickGap={18}
          tickMargin={8}
        />
        <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          cursor={{ fill: CURSOR_FILL }}
          content={<ChartTooltip formatLabel={(label) => `Semana del ${shortDate(String(label))}`} />}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="square"
          iconSize={10}
          wrapperStyle={{ fontSize: 12, color: "#475467", paddingBottom: 12 }}
        />
        <Bar dataKey="leads" name="Leads" fill={CHART_COLORS.navy} radius={[3, 3, 0, 0]} maxBarSize={26} isAnimationActive={false} />
        <Bar dataKey="hot" name="HOT leads" fill={CHART_COLORS.teal} radius={[3, 3, 0, 0]} maxBarSize={26} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
