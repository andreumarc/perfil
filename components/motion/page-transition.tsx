"use client";

import * as m from "motion/react-m";

/** Fundido suave al cambiar de página (se monta de nuevo con cada navegación vía template.tsx). */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </m.div>
  );
}
