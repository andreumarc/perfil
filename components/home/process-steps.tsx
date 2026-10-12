import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { SiteSettings } from "@/lib/validation/settings";

export function ProcessSteps({ steps }: { steps: SiteSettings["process"] }) {
  if (!steps.length) return null;
  return (
    <Section tone="dark-grid" id="proceso">
      <SectionHeading
        eyebrow="Cómo trabajamos"
        tone="dark"
        title="Un proceso claro, de la primera visita a la entrega"
        description="Sabrás en todo momento qué se hace, quién lo hace y cuándo. Sin sorpresas en el presupuesto ni en el calendario."
      />
      <RevealGroup className="mt-12 grid gap-6 md:grid-cols-5">
        {steps.map((step, index) => (
          <RevealItem key={step.title} className="relative rounded-lg border border-white/10 bg-white/5 p-5">
            <span className="font-display tabular text-3xl text-copper-400">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-200">{step.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
