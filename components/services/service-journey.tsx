import Link from "next/link";
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";

import { getService, type ServiceSlug } from "@/content/services";
import { cn } from "@/lib/utils";

import { servicePath } from "./services-json-ld";

const SEQUENCE: readonly ServiceSlug[] = ["multisite-performance-audit", "ebitda-improvement", "fractional-coo"];

/**
 * Itinerario habitual entre servicios (medir → ejecutar → dirigir) y el caso aparte
 * de una adquisición. Visual con CSS, sin ilustraciones.
 */
export function ServiceJourney({ className }: { className?: string }) {
  const steps = SEQUENCE.map((slug) => getService(slug)).filter((s) => s !== undefined);
  const integration = getService("integration-100");

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Itinerario habitual</p>
      <ol className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-stretch">
        {steps.map((service, index) => (
          <li
            key={service.slug}
            className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-stretch"
          >
            <Link
              href={servicePath(service.slug)}
              className="flex flex-1 flex-col rounded-md border border-gray-200 bg-white p-4 transition-colors hover:border-navy-300"
            >
              <span className="tabular text-xs font-semibold text-signal">{String(index + 1).padStart(2, "0")}</span>
              <span className="mt-2 text-sm font-semibold tracking-tight text-navy-900">{service.shortName}</span>
              <span className="mt-1 text-xs text-gray-600">{service.format.split(" · ")[0]}</span>
            </Link>
            {index < steps.length - 1 ? (
              <span aria-hidden className="flex items-center justify-center text-gray-400">
                <ArrowDownIcon className="size-4 lg:hidden" />
                <ArrowRightIcon className="hidden size-4 lg:block" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-gray-600">
        Medir primero, ejecutar después y, si la red lo necesita, dirección operativa continua. Cada paso es
        independiente: se puede empezar por cualquiera.
      </p>
      {integration ? (
        <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Si hay una adquisición en marcha</p>
            <p className="mt-1 text-sm font-semibold tracking-tight text-navy-900">
              {integration.name}{" "}
              <span className="font-normal text-gray-600">· {integration.format.split(" · ")[0]}</span>
            </p>
          </div>
          <Link
            href={servicePath(integration.slug)}
            className="inline-flex items-center gap-1 text-sm font-medium text-navy-900 transition-all hover:gap-2"
          >
            Ver servicio
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
