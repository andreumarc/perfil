import { Hero } from "@/components/home/hero";
import { HOME_FAQS, HomeFaq } from "@/components/home/home-faq";
import { Impact } from "@/components/home/impact";
import { LatestInsights } from "@/components/home/latest-insights";
import { MethodologySection } from "@/components/home/methodology-section";
import { Problems } from "@/components/home/problems";
import { ServicesGrid } from "@/components/home/services-grid";
import { CtaBand } from "@/components/sections/cta-band";
import { DiagnosticTeaser } from "@/components/sections/diagnostic-teaser";
import { SectorStrip } from "@/components/sections/sector-strip";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Marc Andreu Guerao | Especialista en rendimiento de empresas multicentro",
  description: site.description,
  path: "/",
  keywords: [...site.keywords],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectorStrip />
      <Problems />
      <MethodologySection />
      <ServicesGrid />
      <Impact />
      <DiagnosticTeaser location="home_mid" />
      <LatestInsights />
      <HomeFaq />
      <CtaBand location="home_final" />
      <JsonLd data={faqJsonLd(HOME_FAQS)} />
    </>
  );
}
