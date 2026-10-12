"use client";

import * as React from "react";

const SESSION_KEY = "rf_preloader_seen";
const DURATION_MS = 1150;

/**
 * Precargador con una casa que se construye trazo a trazo. Se muestra solo en
 * la primera carga de la sesión durante ~1,1 s y se desvanece; el contenido ya
 * está renderizado debajo, así que no bloquea el LCP ni la indexación.
 * Con prefers-reduced-motion no se muestra.
 */
export function Preloader() {
  const [state, setState] = React.useState<"hidden" | "shown" | "leaving">("hidden");

  React.useEffect(() => {
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      return;
    }
    // Se activa en un microtask tras la hidratación para no participar en el primer render.
    const show = window.setTimeout(() => setState("shown"), 0);
    const leave = window.setTimeout(() => setState("leaving"), DURATION_MS);
    const done = window.setTimeout(() => setState("hidden"), DURATION_MS + 450);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(leave);
      window.clearTimeout(done);
    };
  }, []);

  if (state === "hidden") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-ink-900 transition-opacity duration-500 ease-out"
      style={{ opacity: state === "leaving" ? 0 : 1 }}
    >
      <div className="flex flex-col items-center gap-5">
        <svg viewBox="0 0 120 110" width="120" height="110" fill="none" className="text-white">
          {/* Suelo */}
          <path d="M10 100 H110" stroke="#9d978f" strokeWidth="3" strokeLinecap="round" pathLength={1} className="rf-build" style={{ animationDelay: "0ms" }} />
          {/* Muros */}
          <path d="M28 100 V58 M92 100 V58" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" pathLength={1} className="rf-build" style={{ animationDelay: "180ms" }} />
          {/* Tejado */}
          <path d="M18 62 L60 22 L102 62" stroke="#e8781e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="rf-build" style={{ animationDelay: "380ms" }} />
          {/* Puerta y ventana */}
          <path d="M52 100 V78 H68 V100" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="rf-build" style={{ animationDelay: "620ms" }} />
          <path d="M74 66 H86 V78 H74 Z" stroke="#e8781e" strokeWidth="3" strokeLinejoin="round" pathLength={1} className="rf-build" style={{ animationDelay: "760ms" }} />
          {/* Chimenea */}
          <path d="M80 40 V30 H88 V48" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="rf-build" style={{ animationDelay: "880ms" }} />
        </svg>
        <div className="h-1 w-32 overflow-hidden rounded-full bg-white/15">
          <div className="rf-progress h-full rounded-full bg-copper-400" />
        </div>
        <style>{`
          .rf-build { stroke-dasharray: 1; stroke-dashoffset: 1; animation: rf-draw 420ms cubic-bezier(.22,1,.36,1) forwards; }
          .rf-progress { width: 0; animation: rf-fill ${DURATION_MS}ms linear forwards; }
          @keyframes rf-draw { to { stroke-dashoffset: 0; } }
          @keyframes rf-fill { to { width: 100%; } }
        `}</style>
      </div>
    </div>
  );
}
