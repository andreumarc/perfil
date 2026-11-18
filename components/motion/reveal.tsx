"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Animaciones de entrada al hacer scroll, sin ocultar nada en el HTML inicial.
 *
 * Todo se renderiza visible en servidor (SEO, sin JavaScript y LCP sin esperar
 * a la hidratación). Al montarse en el cliente, solo los bloques que quedan por
 * debajo de la pantalla pasan a `data-reveal="pending"` (ocultos por CSS) y se
 * muestran con una transición cuando entran en el viewport. Con
 * `prefers-reduced-motion` no se oculta nada.
 *
 * `RevealGroup` revela a sus `RevealItem` en cascada; `Reveal` es individual.
 */

type RevealState = "idle" | "pending" | "shown";

const STAGGER_S = 0.08;
const BASE_DELAY_S = 0.05;

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Oculta el elemento si queda fuera de la pantalla y lo muestra cuando entra en el viewport. */
function useReveal(ref: React.RefObject<HTMLElement | null>, amount: number): RevealState {
  const [state, setState] = React.useState<RevealState>("idle");

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || typeof IntersectionObserver === "undefined") return;
    // Lo que ya está en pantalla (o por encima) no se toca.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState("pending");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: Math.min(Math.max(amount, 0), 1) },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount]);

  return state;
}

const GroupContext = React.createContext<RevealState>("idle");

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function RevealGroup({ className, children, amount = 0.15, ...props }: DivProps & { amount?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const state = useReveal(ref, amount);

  // Cascada: retardo creciente por hijo, asignado en el DOM al ocultar el grupo.
  React.useEffect(() => {
    const el = ref.current;
    if (!el || state !== "pending") return;
    let i = 0;
    for (const child of Array.from(el.children)) {
      if (child instanceof HTMLElement && child.hasAttribute("data-reveal")) {
        child.style.transitionDelay = `${BASE_DELAY_S + i * STAGGER_S}s`;
        i += 1;
      }
    }
  }, [state]);

  return (
    <GroupContext.Provider value={state}>
      <div ref={ref} className={cn(className)} {...props}>
        {children}
      </div>
    </GroupContext.Provider>
  );
}

export function RevealItem({ className, children, scale = false, ...props }: DivProps & { scale?: boolean }) {
  const state = React.useContext(GroupContext);
  return (
    <div data-reveal={state === "idle" ? undefined : state} data-reveal-scale={scale ? "" : undefined} className={cn(className)} {...props}>
      {children}
    </div>
  );
}

/** Reveal individual (sin cascada). */
export function Reveal({ className, children, delay = 0, style, ...props }: DivProps & { delay?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const state = useReveal(ref, 0.2);
  return (
    <div
      ref={ref}
      data-reveal={state === "idle" ? undefined : state}
      className={cn(className)}
      style={state === "idle" || !delay ? style : { ...style, transitionDelay: `${delay}s` }}
      {...props}
    >
      {children}
    </div>
  );
}
