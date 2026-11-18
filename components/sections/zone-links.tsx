import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import type { LocalAreaContent } from "@/content/types";
import { cn } from "@/lib/utils";

/** Lista de enlaces a páginas de zona en forma de chips (enlazado interno hacia las páginas locales). */
export function ZoneChips({ zones, className, size = "md" }: { zones: Pick<LocalAreaContent, "slug" | "name">[]; className?: string; size?: "sm" | "md" }) {
  if (!zones.length) return null;
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {zones.map((z) => (
        <li key={z.slug}>
          <Link
            href={`/zonas/${z.slug}`}
            className={cn(
              "inline-flex rounded-full border border-gray-300 bg-white text-ink-900 hover:border-copper-400 hover:bg-copper-50",
              size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
            )}
          >
            {z.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Bloque de portada: toda España y toda Cataluña, con enlace a cada página local. */
export function ZonesSection({ zones, city }: { zones: LocalAreaContent[]; city: string }) {
  if (!zones.length) return null;
  return (
    <Section tone="white" id="zonas">
      <SectionHeading
        eyebrow="Zonas de actuación"
        title="Reformas en toda España y, sobre todo, en toda Cataluña"
        description={`Oficina en ${city}. Trabajamos a diario en Barcelona y el Baix Llobregat, con desplazamiento corto al Garraf, el Alt Penedès y l'Anoia, y organizamos obras en el resto de Cataluña y de España según el proyecto. Cada municipio tiene su página con el tipo de vivienda, los trámites y la logística de obra.`}
      />
      <ZoneChips zones={zones} className="mt-8" />
      <div className="mt-6">
        <Link href="/zonas" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
          Ver todas las zonas <ArrowRightIcon className="size-4" aria-hidden />
        </Link>
      </div>
    </Section>
  );
}
