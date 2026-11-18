"use client";

import * as React from "react";

/**
 * Fundido suave entre páginas públicas, solo en navegaciones del cliente: la
 * primera carga (y el HTML de servidor) se renderiza visible, sin opacidad 0.
 * Animación en CSS (`rf-page-in`, globals.css): respeta prefers-reduced-motion.
 */
let firstMount = true;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [animateIn] = React.useState(() => {
    if (typeof window === "undefined") return false;
    if (firstMount) {
      firstMount = false;
      return false;
    }
    return true;
  });
  return <div className={animateIn ? "rf-page-in" : undefined}>{children}</div>;
}
