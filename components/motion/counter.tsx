"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

function parse(value: string | number): { numeric: number | null; decimals: number } {
  if (typeof value === "number") return { numeric: value, decimals: 0 };
  const trimmed = value.trim();
  const decimals = /,\d+$/.test(trimmed) ? (trimmed.split(",")[1]?.length ?? 0) : 0;
  const raw = Number(trimmed.replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
  return { numeric: Number.isFinite(raw) && trimmed !== "" ? raw : null, decimals };
}

/**
 * Contador animado: cuenta desde 0 hasta `value` al entrar en pantalla.
 * Se renderiza con el valor final (SSR y sin JS) y solo anima cuando hay JS y
 * no está activo prefers-reduced-motion. Escribe en el DOM sin estado React.
 */
export function Counter({ value, className, duration = 1.4 }: { value: string | number; className?: string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const { numeric, decimals } = parse(value);
  const format = React.useCallback(
    (n: number) => new Intl.NumberFormat("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n),
    [decimals],
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el || numeric === null || !inView || reduce) return;
    el.textContent = format(0);
    const controls = animate(0, numeric, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, numeric, duration, reduce, format]);

  return (
    <span ref={ref} className={className}>
      {numeric === null ? String(value) : format(numeric)}
    </span>
  );
}
