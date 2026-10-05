import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { meetingCta, meetingHref } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Principios de trabajo. Cinco frases que un CEO puede comprobar en la primera reunión. */
export const WORK_PRINCIPLES = [
  {
    title: "Medir antes de opinar",
    description:
      "Sin un P&L comparable por centro y KPIs con una sola definición, cualquier diagnóstico es una opinión. Primero los datos, después el debate.",
  },
  {
    title: "Una sola forma de operar",
    description:
      "Las excepciones por centro son el coste oculto de las redes. Se define un modelo operativo único en lo que importa y se respeta lo que hace valioso a cada centro.",
  },
  {
    title: "El manager de centro es la palanca",
    description:
      "Ningún plan funciona sin el responsable que lo ejecuta cada día. Objetivos claros, rutinas de seguimiento y formación: ahí se gana o se pierde el margen.",
  },
  {
    title: "Ejecución antes que informes",
    description:
      "Cinco acciones ejecutadas valen más que cuarenta recomendaciones en un documento. Responsables, fechas y seguimiento semanal hasta que el cambio se sostiene solo.",
  },
  {
    title: "El EBITDA se construye centro a centro",
    description:
      "El resultado del grupo es la suma de decisiones locales: agendas, plantillas, compras, precios. Mejorar el EBITDA es mejorar cada centro con el mismo método.",
  },
] as const;

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Rejilla de principios con una sexta celda de conversión. */
export function Principles({ className }: { className?: string }) {
  return (
    <ol className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {WORK_PRINCIPLES.map((item, index) => (
        <li key={item.title} className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 md:p-7">
          <span className="font-display tabular text-3xl text-navy-300">{pad(index)}</span>
          <h3 className="mt-4 text-lg font-semibold tracking-tight text-navy-900">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[15px]">{item.description}</p>
        </li>
      ))}
      <li className="flex h-full flex-col justify-between rounded-lg border border-navy-900 bg-navy-900 p-6 text-white md:p-7">
        <div>
          <p className="eyebrow text-navy-200">¿Encaja con tu forma de dirigir?</p>
          <p className="font-display mt-3 text-xl leading-snug md:text-2xl">
            En 30 minutos revisamos tu red con estos cinco principios y vemos si tiene sentido trabajar juntos.
          </p>
        </div>
        <TrackedLink
          href={meetingHref}
          event="meeting_clicked"
          props={{ location: "about_principles" }}
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-white underline-offset-4 hover:underline"
        >
          {meetingCta.label}
          <ArrowRightIcon aria-hidden className="size-4" />
        </TrackedLink>
      </li>
    </ol>
  );
}
