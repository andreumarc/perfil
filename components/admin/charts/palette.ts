/**
 * Paleta y ajustes compartidos de los gráficos del admin (Recharts 3).
 * Misma paleta que --chart-1..5 en globals.css.
 */
export const CHART_COLORS = {
  navy: "#0a1a33",
  teal: "#0f766e",
  blue: "#4f78b5",
  gold: "#b98a2c",
  gray: "#98a2b3",
} as const;

/**
 * Orden categórico fijo. Navy → teal → oro → azul → gris: los pares adyacentes
 * se distinguen también con visión reducida al color; el gris queda para el
 * último segmento ("otros").
 */
export const CATEGORICAL_COLORS: readonly string[] = [
  CHART_COLORS.navy,
  CHART_COLORS.teal,
  CHART_COLORS.gold,
  CHART_COLORS.blue,
  CHART_COLORS.gray,
];

/** Escala secuencial navy (oscuro → claro) para embudos y rankings. */
export const SEQUENTIAL_NAVY: readonly string[] = ["#0a1a33", "#10264a", "#163463", "#2b589b", "#4f78b5"];

export const AXIS_TICK = { fontSize: 11, fill: "#667085" } as const;
export const AXIS_LINE = { stroke: "#e4e8ee" } as const;
export const GRID_STROKE = "#eef1f5";
export const CURSOR_FILL = "#f2f5fa";

/** Parsea "YYYY-MM-DD" como fecha local (evita el salto de día por zona horaria). */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return new Date(iso);
  return new Date(y, m - 1, d);
}

const shortDateFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" });

/** "2026-09-28" → "28 sept". */
export function shortDate(iso: string): string {
  return shortDateFormatter.format(parseLocalDate(iso)).replace(".", "");
}

export function percentOf(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}
