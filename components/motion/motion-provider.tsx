"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * Carga perezosa de Motion (solo las features DOM) y respeto automático de
 * prefers-reduced-motion: con "user" las animaciones se reducen a instantáneas.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
