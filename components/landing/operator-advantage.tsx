import { TrackedLink } from "@/components/analytics/tracked-link";
import { Section, SectionHeading } from "@/components/layout/section";
import { StatGrid } from "@/components/sections/stat-grid";
import { Button } from "@/components/ui/button";
import { meetingCta, meetingHref } from "@/lib/site";

export interface Advantage {
  title: string;
  text: string;
}

/**
 * Sección navy "por qué un operador y no una consultora": credenciales reales en
 * cifras + diferencias concretas + CTA de reunión. Sin resultados económicos inventados.
 */
export function OperatorAdvantage({
  eyebrow = "Experiencia directiva",
  title,
  description,
  items,
  location,
  ctaLabel = meetingCta.label,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  items: readonly Advantage[];
  location: string;
  ctaLabel?: string;
}) {
  return (
    <Section tone="navy">
      <SectionHeading tone="dark" eyebrow={eyebrow} title={title} description={description} />

      <StatGrid tone="dark" className="mt-14" />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg border border-white/15 bg-white/[0.04] p-6 md:p-7">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-100/80 md:text-[15px]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <Button asChild size="lg" variant="outline-light" className="w-full sm:w-auto">
          <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location }}>
            {ctaLabel}
          </TrackedLink>
        </Button>
      </div>
    </Section>
  );
}
