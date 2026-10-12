/**
 * Paleta y ajustes compartidos de los gráficos del admin (Recharts 3).
 * Misma paleta que --chart-1..5 en globals.css.
 */
export const CHART_COLORS = {
  ink: "#17191d",
  copper: "#d3620f",
  olive: "#6b7a3a",
  sand: "#efab75",
  gray: "#9d978f",
} as const;

/**
 * Orden categórico fijo. Carbón → cobre → oliva → arena → gris: los pares adyacentes
 * se distinguen también con visión reducida al color; el gris queda para el
 * último segmento ("otros").
 */
export const CATEGORICAL_COLORS: readonly string[] = [
  CHART_COLORS.ink,
  CHART_COLORS.copper,
  CHART_COLORS.olive,
  CHART_COLORS.sand,
  CHART_COLORS.gray,
];

/** Escala secuencial carbón (oscuro → claro) para embudos y rankings. */
export const SEQUENTIAL_INK: readonly string[] = ["#17191d", "#2b2a28", "#3d3b38", "#55524e", "#7a7772"];

export const AXIS_TICK = { fontSize: 11, fill: "#6f6a63" } as const;
export const AXIS_LINE = { stroke: "#e4e1db" } as const;
export const GRID_STROKE = "#f1efeb";
export const CURSOR_FILL = "#f3f0eb";

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
