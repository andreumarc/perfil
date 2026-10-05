import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Section, SectionHeading } from "@/components/layout/section";
import { StatGrid } from "@/components/sections/stat-grid";
import { Button } from "@/components/ui/button";
import { meetingCta, meetingHref } from "@/lib/site";

/** Credenciales cualitativas verificables. Sin porcentajes de mejora ni clientes inventados. */
const CREDENTIALS = [
  {
    title: "Dirección de redes de hasta 25 centros",
    text: "Responsable directo de la operación, el P&L y los equipos de redes de centros en healthcare, dental, veterinaria y retail. Decisiones con consecuencias en la cuenta de resultados, no recomendaciones desde fuera.",
  },
  {
    title: "P&L de hasta 35 M€ y equipos de 250 personas",
    text: "Presupuesto, seguimiento de desviaciones, dimensionamiento de plantilla y dirección de managers de centro. El cuadro de mando semanal como herramienta de gestión, no como informe para el consejo.",
  },
  {
    title: "Integración de centros adquiridos y dirección regional",
    text: "Integración operativa de centros comprados, estandarización de procesos y dirección de zonas con varios centros: una sola forma de operar en redes que crecen por apertura y por adquisición.",
  },
] as const;

export function Impact() {
  return (
    <Section tone="navy">
      <SectionHeading
        tone="dark"
        eyebrow="Experiencia"
        title="Experiencia directiva, no teoría de consultor."
        description="He estado al otro lado de la mesa: responsable del P&L, de los equipos y de los resultados de redes de centros. Eso cambia la forma de diagnosticar y, sobre todo, la forma de ejecutar con los managers que tienen que sostener el cambio."
      />

      <StatGrid tone="dark" className="mt-14" />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {CREDENTIALS.map((item) => (
          <div key={item.title} className="rounded-lg border border-white/15 bg-white/[0.04] p-6 md:p-7">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-100/80 md:text-[15px]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button asChild size="lg" variant="outline-light" className="w-full sm:w-auto">
          <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location: "impact" }}>
            {meetingCta.label}
          </TrackedLink>
        </Button>
        <Link
          href="/sobre-mi"
          className="inline-flex min-h-11 items-center justify-center gap-2 px-2 text-base font-medium text-white/90 underline-offset-4 hover:underline"
        >
          Conocer mi trayectoria
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </Section>
  );
}
