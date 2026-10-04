import { cn } from "@/lib/utils";

export const HOME_PROBLEMS = [
  "Cada centro funciona de una forma distinta y hay tantas excepciones como responsables.",
  "Los datos llegan tarde: cuando cierras el mes ya no puedes corregir nada.",
  "No sabes qué centros destruyen margen y cuáles sostienen al resto.",
  "El coste de personal se dispara y no está claro si es plantilla, agenda o ventas.",
  "Los managers gestionan por intuición y por incidencias, no por indicadores.",
  "Las adquisiciones no terminan de integrarse: siguen operando como empresas aparte.",
] as const;

/** Lista de dolores del CEO en dos columnas, con numeración discreta. */
export function ProblemList({ items = HOME_PROBLEMS, className }: { items?: readonly string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-x-10 gap-y-5 md:grid-cols-2", className)}>
      {items.map((item, index) => (
        <li key={item} className="flex gap-4 border-t border-gray-200 pt-5">
          <span className="tabular shrink-0 text-sm font-semibold text-signal">{String(index + 1).padStart(2, "0")}</span>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg">{item}</p>
        </li>
      ))}
    </ul>
  );
}
