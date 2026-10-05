import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { meetingHref, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Caja de autor al final del artículo. Credenciales verificables (sin clientes ni
 * porcentajes) y dos salidas: trayectoria completa y sesión de 30 minutos.
 */
export function AuthorBox({ className }: { className?: string }) {
  return (
    <aside
      aria-label="Sobre el autor"
      className={cn("rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8", className)}
    >
      <div className="flex flex-col gap-6 sm:flex-row">
        <div
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-md bg-navy-900 text-lg font-bold text-white"
        >
          MA
        </div>
        <div className="flex-1">
          <p className="eyebrow">Sobre el autor</p>
          <p className="mt-2 text-lg font-semibold text-navy-900">{site.name}</p>
          <p className="text-sm text-gray-500">{site.role}</p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            He dirigido redes de hasta 25 centros, con un P&L de 35 M€ y equipos de 250 personas en healthcare,
            dental, veterinaria y retail. He liderado integraciones post-adquisición y hoy ayudo a CEOs, CFOs e
            inversores a convertir redes de centros en operaciones más rentables, medibles y escalables.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/sobre-mi"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900 underline-offset-4 hover:underline"
            >
              Conocer mi trayectoria
              <ArrowRightIcon className="size-4" />
            </Link>
            <TrackedLink
              href={meetingHref}
              event="meeting_clicked"
              props={{ location: "insight_author" }}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900 underline-offset-4 hover:underline"
            >
              Reservar sesión de 30 min
            </TrackedLink>
          </div>
        </div>
      </div>
    </aside>
  );
}
