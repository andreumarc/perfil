import { cn } from "@/lib/utils";

export const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "Medir",
    description:
      "P&L por centro con criterios homogéneos, KPIs con una sola definición y datos que llegan a tiempo. Sin medida comparable no hay gestión posible.",
  },
  {
    step: "02",
    title: "Comparar",
    description:
      "Ranking de centros, cuartiles y análisis de las diferencias entre los mejores y los peores. Las mejores prácticas ya existen dentro de la red.",
  },
  {
    step: "03",
    title: "Priorizar",
    description:
      "Palancas ordenadas por impacto en EBITDA y esfuerzo de implantación. Cinco acciones bien elegidas valen más que un plan de cuarenta.",
  },
  {
    step: "04",
    title: "Ejecutar",
    description:
      "Responsables, calendario y seguimiento semanal. Cambios reales en agendas, plantillas, compras y procesos, no recomendaciones en un informe.",
  },
  {
    step: "05",
    title: "Escalar",
    description:
      "Una única forma de operar documentada, managers formados y un playbook para abrir o integrar centros sin perder control.",
  },
] as const;

/** Metodología en 5 pasos. Se usa en home y en la landing multisite. */
export function Methodology({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <ol className={cn("grid gap-px overflow-hidden rounded-lg border md:grid-cols-5", dark ? "border-white/15 bg-white/15" : "border-gray-200 bg-gray-200", className)}>
      {METHODOLOGY_STEPS.map((item) => (
        <li key={item.step} className={cn("flex flex-col p-6", dark ? "bg-navy-900" : "bg-white")}>
          <span className={cn("font-display tabular text-3xl", dark ? "text-navy-300" : "text-navy-300")}>{item.step}</span>
          <h3 className={cn("mt-4 text-lg font-semibold", dark ? "text-white" : "text-navy-900")}>{item.title}</h3>
          <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-navy-100/80" : "text-gray-600")}>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
