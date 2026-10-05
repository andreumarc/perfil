import { cn } from "@/lib/utils";

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Indicador circular de madurez operativa (0-100). SVG puro, sin JS ni hooks:
 * se renderiza igual en cliente (wizard) y en servidor (página de resultado).
 */
export function ScoreGauge({ value, size = 168, className }: { value: number; size?: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div
      role="img"
      aria-label={`Madurez operativa: ${clamped} sobre 100`}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden className="-rotate-90">
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="var(--navy-100)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="var(--navy-900)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <p className="font-display tabular leading-none text-navy-900">
          <span className="text-5xl">{clamped}</span>
          <span className="text-lg text-gray-400"> / 100</span>
        </p>
      </div>
    </div>
  );
}
