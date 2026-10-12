"use client";

import * as React from "react";

import type { ContextInput } from "@/lib/validation/lead";

/**
 * Datos adicionales que un componente envolvente (p. ej. una calculadora)
 * inyecta en el formulario de presupuesto sin acoplar ambos componentes.
 */
export interface LeadExtra {
  /** Campos contextuales que se fusionan en `leads.context`. */
  context?: ContextInput;
  /** Metros cuadrados a usar si el usuario no los indica en el formulario. */
  squareMeters?: number;
}

const LeadExtraContext = React.createContext<LeadExtra | null>(null);

export function LeadExtraProvider({ value, children }: { value: LeadExtra; children: React.ReactNode }) {
  return <LeadExtraContext.Provider value={value}>{children}</LeadExtraContext.Provider>;
}

export function useLeadExtra(): LeadExtra | null {
  return React.useContext(LeadExtraContext);
}
