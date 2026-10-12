"use client";

import * as m from "motion/react-m";
import type { HTMLMotionProps, Variants } from "motion/react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const itemScale: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Contenedor que revela a sus hijos `RevealItem` en cascada al entrar en el viewport.
 * Los elementos nacen visibles si JS no carga (SSR) y solo se ocultan al animar.
 */
export function RevealGroup({ className, children, amount = 0.15, ...props }: HTMLMotionProps<"div"> & { amount?: number }) {
  return (
    <m.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount }} className={cn(className)} {...props}>
      {children}
    </m.div>
  );
}

export function RevealItem({ className, children, scale = false, ...props }: HTMLMotionProps<"div"> & { scale?: boolean }) {
  return (
    <m.div data-reveal variants={scale ? itemScale : item} className={cn(className)} {...props}>
      {children}
    </m.div>
  );
}

/** Reveal individual (sin cascada). */
export function Reveal({ className, children, delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <m.div
      data-reveal
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </m.div>
  );
}
