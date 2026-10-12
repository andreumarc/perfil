"use client";

import * as React from "react";
import * as m from "motion/react-m";

/** Solo anima en navegaciones del cliente: la primera carga se renderiza visible (SSR sin opacidad 0). */
let firstMount = true;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [animateIn] = React.useState(() => {
    if (firstMount) {
      firstMount = false;
      return false;
    }
    return true;
  });
  return (
    <m.div initial={animateIn ? { opacity: 0, y: 8 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </m.div>
  );
}
