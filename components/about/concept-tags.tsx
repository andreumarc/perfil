import { cn } from "@/lib/utils";

/** Conceptos clave del posicionamiento (también útiles como términos de búsqueda). */
export const KEY_CONCEPTS = [
  "Multisite Performance",
  "P&L",
  "EBITDA",
  "Operations",
  "Value Creation",
  "Post-Merger Integration",
  "Buy & Build",
  "Scalability",
  "Operational Excellence",
] as const;

/** Lista de etiquetas, sin enlaces: lectura rápida del campo de trabajo. */
export function ConceptTags({ className }: { className?: string }) {
  return (
    <ul aria-label="Conceptos clave" className={cn("flex flex-wrap gap-2.5", className)}>
      {KEY_CONCEPTS.map((concept) => (
        <li
          key={concept}
          className="rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-medium tracking-tight text-navy-900"
        >
          {concept}
        </li>
      ))}
    </ul>
  );
}
