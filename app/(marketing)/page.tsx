import { CtaBand } from "@/components/sections/cta-band";
import { Section, SectionHeading } from "@/components/layout/section";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${site.name} | Especialista en rendimiento de empresas multicentro`,
  description: site.description,
  path: "/",
});

/* Home temporal del scaffold: se sustituye por la home completa en la fase de páginas. */
export default function HomePage() {
  return (
    <>
      <Section>
        <SectionHeading as="h1" eyebrow="Multisite Performance" title={site.tagline} description={site.description} />
      </Section>
      <CtaBand location="home_final" />
    </>
  );
}
