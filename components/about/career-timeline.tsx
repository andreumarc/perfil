import { cn } from "@/lib/utils";

/**
 * Hitos cualitativos de la trayectoria. Sin nombres de empresas ni fechas:
 * describen responsabilidades reales, no un currículum.
 */
export const CAREER_MILESTONES = [
  {
    title: "Dirección de redes multicentro en healthcare, dental, veterinaria y retail",
    description:
      "Responsabilidad directa sobre la operación, el P&L y los equipos de redes de hasta 25 centros. Decisiones con consecuencias en la cuenta de resultados, no recomendaciones desde fuera.",
  },
  {
    title: "Integración de centros adquiridos",
    description:
      "Incorporación operativa de centros comprados al modelo del grupo: personas, reporting, sistemas, compras y procesos. Una sola forma de operar sin perder facturación ni equipo durante la transición.",
  },
  {
    title: "Estandarización de operaciones",
    description:
      "Diseño e implantación de un modelo operativo único: protocolos, agendas, roles y estándares de servicio replicables en cada centro existente y en cada apertura nueva.",
  },
  {
    title: "Dirección regional",
    description:
      "Dirección de zonas con varios centros y de sus responsables: objetivos, rutinas de seguimiento, desarrollo de managers y corrección de desviaciones antes del cierre mensual.",
  },
  {
    title: "Optimización de costes y rentabilidad por centro",
    description:
      "Dimensionamiento de plantillas, productividad por profesional, compras y estructura central. El P&L por centro como herramienta de dirección semanal, no como informe trimestral.",
  },
  {
    title: "Planificación operativa y control de KPIs",
    description:
      "Presupuestos por centro, cuadro de mando, una única definición de cada indicador y rutinas de revisión que permiten decidir con información de la semana anterior.",
  },
  {
    title: "Entornos Private Equity y Buy & Build",
    description:
      "Trabajo con equipos de inversión y consejos: reporting para inversores, planes de creación de valor, due diligence operativa e integración de add-ons sobre una plataforma.",
  },
] as const;

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Trayectoria en forma de línea de hitos numerados (sin fechas). */
export function CareerTimeline({ className }: { className?: string }) {
  return (
    <ol className={cn("relative border-l border-gray-200", className)}>
      {CAREER_MILESTONES.map((item, index) => (
        <li key={item.title} className="relative pb-10 pl-8 last:pb-0 md:pl-10">
          <span
            aria-hidden
            className="absolute top-1.5 left-[-0.3125rem] size-2.5 rounded-full bg-signal ring-4 ring-white"
          />
          <p className="tabular text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Hito {pad(index)}</p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-navy-900 md:text-xl">{item.title}</h3>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-gray-600">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
