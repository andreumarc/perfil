import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Section, SectionHeading } from "@/components/layout/section";
import { ProblemList } from "@/components/sections/problem-list";
import { primaryCta } from "@/lib/site";

/** Sección de dolores del CEO con cierre hacia el diagnóstico gratuito. */
export function Problems() {
  return (
    <Section>
      <SectionHeading
        eyebrow="¿Te resulta familiar?"
        title="Si tienes 15 centros y no puedes comparar su rentabilidad en menos de cinco minutos, tienes un problema de gestión."
        description="No es un problema de esfuerzo ni de talento. Es un problema de modelo operativo: cada centro mide, opera y reporta a su manera, y la dirección decide con información tardía e incompleta."
      />

      <ProblemList className="mt-12" />

      <div className="mt-14 max-w-3xl border-l-2 border-signal pl-5 md:pl-6">
        <p className="text-base leading-relaxed text-gray-700 md:text-lg">
          Ninguno de estos problemas se resuelve con más reuniones ni con otro informe. Se resuelven con un P&amp;L
          por centro comparable, un ranking honesto de la red y cinco palancas bien elegidas. El diagnóstico
          gratuito te dice en tres minutos cuál es el nivel de madurez operativa de tu organización y por dónde
          empezar.
        </p>
        <TrackedLink
          href={primaryCta.href}
          event="cta_clicked"
          props={{ location: "problems" }}
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-base font-semibold text-navy-900 underline-offset-4 hover:underline"
        >
          {primaryCta.label}
          <ArrowRightIcon className="size-4" />
        </TrackedLink>
      </div>
    </Section>
  );
}
