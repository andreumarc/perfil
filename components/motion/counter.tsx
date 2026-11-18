"use client";

import * as React from "react";

function parse(value: string | number): { numeric: number | null; decimals: number } {
  if (typeof value === "number") return { numeric: value, decimals: 0 };
  const trimmed = value.trim();
  const decimals = /,\d+$/.test(trimmed) ? (trimmed.split(",")[1]?.length ?? 0) : 0;
  const raw = Number(trimmed.replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
  return { numeric: Number.isFinite(raw) && trimmed !== "" ? raw : null, decimals };
}

/** Curva de salida suave (equivalente a cubic-bezier(0.22, 1, 0.36, 1) aproximada). */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Contador animado: cuenta desde 0 hasta `value` al entrar en pantalla.
 * Se renderiza con el valor final (SSR y sin JS) y solo anima cuando hay JS y
 * no está activo prefers-reduced-motion. Escribe en el DOM con requestAnimationFrame,
 * sin estado React ni librerías de animación.
 */
export function Counter({ value, className, duration = 1.4 }: { value: string | number; className?: string; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const { numeric, decimals } = parse(value);
  const format = React.useCallback(
    (n: number) => new Intl.NumberFormat("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n),
    [decimals],
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el || numeric === null || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const total = duration * 1000;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / total);
          el.textContent = format(numeric * easeOut(t));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        el.textContent = format(0);
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [numeric, duration, format]);

  return (
    <span ref={ref} className={className}>
      {numeric === null ? String(value) : format(numeric)}
    </span>
  );
}
