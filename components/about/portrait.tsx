import Image from "next/image";

import { credentials, site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface PortraitProps {
  /**
   * Ruta de la fotografía (p. ej. "/images/marc-andreu-guerao.jpg"). Mientras no
   * exista, se renderiza el retrato tipográfico. Al añadir la foto basta con
   * pasar `src`; no hay que tocar la página.
   */
  src?: string;
  className?: string;
}

/** Tres credenciales clave para el retrato: centros, P&L y personas. */
const KEY_FACTS = credentials.slice(0, 3);

/**
 * "Retrato" del perfil. Sin foto: bloque navy con iniciales y datos clave.
 * Con foto: <Image> con el mismo encuadre (4:5), preparado para sustitución directa.
 */
export function Portrait({ src, className }: PortraitProps) {
  if (src) {
    return (
      <figure className={cn("relative aspect-[4/5] overflow-hidden rounded-lg bg-navy-900", className)}>
        <Image
          src={src}
          alt={`${site.name}, ${site.role}`}
          fill
          priority
          sizes="(min-width: 1024px) 26rem, 100vw"
          className="object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-navy-950/70 px-6 py-4 text-white backdrop-blur-sm">
          <p className="text-base font-semibold">{site.name}</p>
          <p className="mt-0.5 text-sm text-navy-100/85">{site.role}</p>
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-lg bg-navy-grid p-7 text-white shadow-[0_28px_70px_-32px_rgba(10,26,51,0.45)] md:p-8",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy-200">
        <span>{site.brand}</span>
        <span>{site.location}</span>
      </div>

      <p
        aria-hidden
        className="font-display select-none text-[6.5rem] leading-none tracking-[-0.06em] text-white sm:text-[8rem] md:text-[8.5rem]"
      >
        MA
      </p>

      <div className="border-t border-white/15 pt-5">
        <p className="text-lg font-semibold tracking-tight">{site.name}</p>
        <p className="mt-1 text-sm leading-snug text-navy-100/80">{site.role}</p>
        <dl className="mt-6 grid grid-cols-3 gap-4">
          {KEY_FACTS.map((fact) => (
            <div key={fact.label}>
              <dd className="font-display tabular text-2xl leading-none md:text-3xl">
                {fact.value}
                {fact.suffix ? <span className="text-base md:text-lg">{fact.suffix}</span> : null}
              </dd>
              <dt className="mt-2 text-[11px] leading-snug text-navy-100/70">{fact.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
