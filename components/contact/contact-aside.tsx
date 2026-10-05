import { ArrowUpRightIcon, CalendarCheckIcon, MailIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { credentials, meetingHref, meetingIsExternal, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const LOCATION = "contact_page";

const NEXT_STEPS = [
  { title: "Leo tu mensaje personalmente", detail: "Nada de respuestas automáticas ni equipos comerciales." },
  { title: "Primera lectura en menos de 48 h", detail: "Qué miraría primero en tu red y si tiene sentido que hablemos." },
  {
    title: "Si encaja, sesión de 30 min",
    detail: "Con tus datos sobre la mesa. Sin presentación comercial.",
  },
] as const;

/** Línea de credenciales derivada de la fuente única (`lib/site.ts`). */
const CREDENTIALS_LINE = credentials.map((c) => `${c.value}${c.suffix} ${c.label}`).join(" · ");

/**
 * Columna izquierda de /contacto: titular (único h1 de la página), qué pasa
 * después, vías directas (reunión, email, LinkedIn) y credenciales verificables.
 */
export function ContactAside({ className }: { className?: string }) {
  return (
    <div className={cn("lg:sticky lg:top-28 lg:self-start", className)}>
      <p className="eyebrow">Contacto</p>
      <h1 className="font-display mt-3 text-3xl leading-[1.1] text-navy-900 sm:text-4xl md:text-[2.75rem]">
        Cuéntame tu situación en dos líneas.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
        Número de centros, sector y qué te quita el sueño. Te respondo en menos de 48 h con una primera
        lectura: qué miraría primero y si tiene sentido que hablemos.
      </p>

      <div className="mt-10">
        <p className="text-xs font-semibold tracking-[0.14em] text-gray-500 uppercase">Qué pasa después</p>
        <ol className="mt-4 space-y-4">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="tabular font-display mt-0.5 w-6 shrink-0 text-lg leading-none text-signal">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-navy-900">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10 space-y-3 border-t border-gray-200 pt-8">
        <p className="font-semibold text-navy-900">¿Prefieres hablar directamente?</p>

        {meetingIsExternal ? (
          <Button asChild size="xl" className="w-full sm:w-auto">
            <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location: LOCATION }}>
              <CalendarCheckIcon />
              Reservar sesión de 30 min
            </TrackedLink>
          </Button>
        ) : (
          <p className="text-sm leading-relaxed text-gray-600">
            Indica en el mensaje dos franjas horarias que te vengan bien y te propongo una llamada de 30
            minutos.
          </p>
        )}

        {site.contactEmail ? (
          <TrackedLink
            href={`mailto:${site.contactEmail}`}
            event="email_clicked"
            props={{ location: LOCATION }}
            className="flex min-h-11 items-center gap-2.5 text-base font-medium text-navy-900 underline-offset-4 hover:underline"
          >
            <MailIcon className="size-4 shrink-0 text-gray-500" aria-hidden />
            {site.contactEmail}
          </TrackedLink>
        ) : null}

        {site.linkedinUrl ? (
          <TrackedLink
            href={site.linkedinUrl}
            event="linkedin_clicked"
            props={{ location: LOCATION }}
            className="flex min-h-11 items-center gap-2.5 text-base font-medium text-navy-900 underline-offset-4 hover:underline"
          >
            Perfil en LinkedIn
            <ArrowUpRightIcon className="size-4 shrink-0 text-gray-500" aria-hidden />
          </TrackedLink>
        ) : null}
      </div>

      <p className="mt-10 text-sm leading-relaxed text-gray-500">{CREDENTIALS_LINE}</p>
    </div>
  );
}
