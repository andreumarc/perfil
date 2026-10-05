import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Honestidad comercial: en qué soy útil y en qué no. Filtra leads que no encajan. */
export const FIT_YES = [
  "Redes de 5 a 100 centros en healthcare, dental, veterinaria, retail, fitness o servicios.",
  "CEOs y directores generales que necesitan comparar la rentabilidad de sus centros y actuar sobre ella.",
  "Grupos que crecen por adquisición y tienen que integrar centros sin perder facturación ni equipo.",
  "Fondos de Private Equity y Operating Partners con participadas multicentro en fase de profesionalización.",
  "Empresas que necesitan dirección operativa sin el coste fijo de un COO a jornada completa.",
] as const;

export const FIT_NO = [
  "No soy una agencia de marketing: no capto pacientes ni clientes. Mejoro cómo se opera lo que ya entra.",
  "No hago software: trabajo con el sistema de gestión y los datos que ya tienes, y los hago comparables.",
  "No trabajo con empresas de un solo centro: el valor está en comparar, estandarizar y escalar.",
  "No entrego informes para archivar: si no hay intención de ejecutar, no tiene sentido empezar.",
] as const;

function FitColumn({
  eyebrow,
  title,
  items,
  tone,
}: {
  eyebrow: string;
  title: string;
  items: readonly string[];
  tone: "yes" | "no";
}) {
  const Icon = tone === "yes" ? CheckIcon : MinusIcon;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
      <p className={cn("eyebrow", tone === "no" && "text-gray-500")}>{eyebrow}</p>
      <h3 className="font-display mt-3 text-2xl text-navy-900">{title}</h3>
      <ul className="mt-6 divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 py-3.5">
            <Icon
              aria-hidden
              className={cn("mt-0.5 size-5 shrink-0", tone === "yes" ? "text-signal" : "text-gray-400")}
            />
            <p className="text-base leading-relaxed text-gray-700">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Dos columnas: "soy útil si…" y "no soy la persona adecuada si…". */
export function FitList({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-5 lg:grid-cols-2", className)}>
      <FitColumn eyebrow="En qué soy útil" title="Donde aporto valor" items={FIT_YES} tone="yes" />
      <FitColumn eyebrow="En qué no" title="Lo que no hago" items={FIT_NO} tone="no" />
    </div>
  );
}
