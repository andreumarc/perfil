import { Section, SectionHeading } from "@/components/layout/section";
import { Faq, type FaqItem } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd } from "@/lib/seo";

/**
 * Bloque de preguntas frecuentes de landing. Las preguntas se renderizan visibles
 * (requisito de Google para FAQPage) y alimentan el JSON-LD de la página.
 */
export function LandingFaq({
  items,
  eyebrow = "Preguntas frecuentes",
  title,
  description,
  tone = "white",
}: {
  items: readonly FaqItem[];
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "white" | "muted";
}) {
  return (
    <Section tone={tone}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <Faq items={[...items]} />
      </div>
      <JsonLd data={faqJsonLd([...items])} />
    </Section>
  );
}
