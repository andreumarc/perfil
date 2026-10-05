"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "./chart-tooltip";
import { AXIS_LINE, AXIS_TICK, CHART_COLORS, GRID_STROKE, shortDate } from "./palette";

export interface DayDatum {
  /** YYYY-MM-DD */
  day: string;
  pageViews: number;
  diagnosticsStarted: number;
  leads: number;
}

/** Actividad diaria de los últimos 30 días: páginas vistas, diagnósticos iniciados y leads. */
export function EventsByDayChart({ data, height = 300 }: { data: DayDatum[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="admin-area-views" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.navy} stopOpacity={0.12} />
            <stop offset="100%" stopColor={CHART_COLORS.navy} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID_STROKE} />
        <XAxis
          dataKey="day"
          tickFormatter={(value: string) => shortDate(value)}
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={AXIS_LINE}
          interval="preserveStartEnd"
          minTickGap={28}
          tickMargin={8}
        />
        <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} />
        <Tooltip
          cursor={{ stroke: "#cbd2dc", strokeDasharray: "3 3" }}
          content={<ChartTooltip formatLabel={(label) => shortDate(String(label))} />}
        />
        <Legend
          verticalAlign="top"
          align="right"
          iconType="plainline"
          iconSize={14}
          wrapperStyle={{ fontSize: 12, color: "#475467", paddingBottom: 12 }}
        />
        <Area
          type="monotone"
          dataKey="pageViews"
          name="Páginas vistas"
          stroke={CHART_COLORS.navy}
          strokeWidth={2}
          fill="url(#admin-area-views)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#ffffff" }}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="diagnosticsStarted"
          name="Diagnósticos iniciados"
          stroke={CHART_COLORS.teal}
          strokeWidth={2}
          fill="transparent"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#ffffff" }}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="leads"
          name="Leads"
          stroke={CHART_COLORS.gold}
          strokeWidth={2}
          fill="transparent"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, stroke: "#ffffff" }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
