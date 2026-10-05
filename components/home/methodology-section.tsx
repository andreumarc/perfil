import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Section, SectionHeading } from "@/components/layout/section";
import { Methodology } from "@/components/sections/methodology";
import { meetingHref } from "@/lib/site";

/** Metodología en cinco pasos. Ancla #metodologia (destino del CTA secundario del hero). */
export function MethodologySection() {
  return (
    <Section id="metodologia" tone="muted" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Cómo trabajo"
        title="Medir, comparar, priorizar, ejecutar, escalar."
        description="Cinco pasos, siempre en este orden. Es el método con el que he dirigido redes de hasta 25 centros y el que aplico en cada intervención, sea un diagnóstico de tres semanas o una dirección de operaciones continuada. Sin medida comparable no hay comparación; sin comparación no hay prioridad; sin prioridad, la ejecución se dispersa."
      />

      <Methodology className="mt-12" />

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-base text-gray-600">
          Cada paso deja algo tangible: un P&amp;L por centro, un ranking, una lista corta de palancas, cambios
          implantados y un playbook. Nada de recomendaciones que se quedan en un informe.
        </p>
        <TrackedLink
          href={meetingHref}
          event="meeting_clicked"
          props={{ location: "methodology" }}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-navy-900 underline-offset-4 hover:underline"
        >
          Hablar de cómo se aplicaría a tu red · 30 min
          <ArrowRightIcon className="size-4" />
        </TrackedLink>
      </div>
    </Section>
  );
}
