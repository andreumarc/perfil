"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import type { LeadFormProps } from "./lead-form";

/**
 * Versión diferida del formulario: su código (react-hook-form, Zod, selects,
 * Turnstile…) solo se descarga cuando el bloque se acerca al viewport o cuando
 * el componente se monta ya visible (popup). Así no compite con el primer
 * pintado en las páginas donde el formulario va al final.
 */
const LeadForm = dynamic(() => import("./lead-form").then((m) => m.LeadForm), { ssr: false, loading: Skeleton });

// Una pantalla y media por encima y por debajo: carga antes de llegar y también si el usuario ya lo ha pasado de largo.
const ROOT_MARGIN = "150% 0px";

function Skeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Cargando formulario" className="space-y-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-11 animate-pulse rounded-md bg-gray-100" />
      ))}
      <div className="h-12 animate-pulse rounded-md bg-gray-200" />
    </div>
  );
}

export function LeadFormLazy(props: LeadFormProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [near, setNear] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={props.layout === "compact" ? "min-h-[26rem]" : "min-h-[40rem]"}>
      {near ? (
        <LeadForm {...props} />
      ) : (
        <>
          <Skeleton />
          <noscript>
            <p className="mt-4 text-sm text-gray-600">
              <a href="/presupuesto" className="font-semibold text-ink-900 underline underline-offset-4">
                Pedir presupuesto sin compromiso
              </a>
            </p>
          </noscript>
        </>
      )}
    </div>
  );
}
