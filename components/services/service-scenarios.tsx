import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { getService, type ServiceSlug } from "@/content/services";
import { cn } from "@/lib/utils";

import { servicePath } from "./services-json-ld";

interface Scenario {
  /** Frase en boca del CEO / inversor. */
  situation: string;
  /** Por qué ese servicio y no otro. */
  rationale: string;
  slug: ServiceSlug;
}

const SCENARIOS: readonly Scenario[] = [
  {
    situation:
      "Facturamos más cada año, pero el EBITDA no acompaña y no sé en qué centros se queda el margen.",
    rationale:
      "Antes de tocar nada hace falta un P&L comparable por centro. Sin él, cualquier medida es una apuesta.",
    slug: "multisite-performance-audit",
  },
  {
    situation: "Ya sé dónde está el problema. Lo que necesito es que el EBITDA se mueva este trimestre.",
    rationale:
      "Cuando las palancas están identificadas, el cuello de botella es la ejecución: alguien que dirija el plan con el equipo semana a semana.",
    slug: "ebitda-improvement",
  },
  {
    situation: "Acabamos de comprar una red de centros y seis meses después sigue operando como una empresa aparte.",
    rationale:
      "Los 100 primeros días deciden si la adquisición crea valor. Hace falta un plan con hitos, responsables y un único modelo de reporting.",
    slug: "integration-100",
  },
  {
    situation:
      "Todas las decisiones operativas pasan por mí y los responsables de centro no tienen a nadie que los dirija.",
    rationale:
      "La empresa ha crecido más que su estructura de dirección. Un Director de Operaciones a tiempo parcial aporta dirección sin el coste fijo de un COO.",
    slug: "fractional-coo",
  },
];

/** Cuatro situaciones típicas y el servicio que encaja con cada una. */
export function ServiceScenarios({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-5 md:grid-cols-2", className)}>
      {SCENARIOS.map((scenario, index) => {
        const service = getService(scenario.slug);
        if (!service) return null;
        return (
          <li
            key={scenario.slug}
            className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 md:p-7"
          >
            <p className="eyebrow">Situación {String(index + 1).padStart(2, "0")}</p>
            <blockquote className="font-display mt-3 text-xl leading-snug text-navy-900 md:text-2xl">
              &ldquo;{scenario.situation}&rdquo;
            </blockquote>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 md:text-[15px]">{scenario.rationale}</p>
            <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Servicio recomendado</p>
                <p className="mt-1 font-semibold tracking-tight text-navy-900">{service.name}</p>
                <p className="tabular mt-0.5 text-sm text-gray-600">
                  {service.format.split(" · ")[0]} · {service.priceLabel}
                </p>
              </div>
              <Link
                href={servicePath(service.slug)}
                className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 transition-all hover:gap-2"
              >
                Ver servicio
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
