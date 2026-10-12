import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, CalculatorIcon, FileCheckIcon, SlidersHorizontalIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { IllustrativeBadge } from "@/components/sections/illustrative-badge";
import { CALCULATORS } from "@/lib/calculators/definitions";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Calculadoras de precios de reformas e instalaciones",
    description:
      "Calcula cuánto cuesta una reforma integral, pintar, poner pladur, reformar baño o cocina, renovar la instalación eléctrica, climatizar, cambiar el suelo o reformar un local. Estimación orientativa al instante.",
    path: "/calculadoras",
    siteName: s.company.name,
    keywords: ["calculadora reforma", "precio reforma m2", "calculadora pintura", "calculadora pladur", "presupuesto reforma online"],
  });
}

const STEPS = [
  { icon: SlidersHorizontalIcon, title: "Ajusta los datos", description: "Metros cuadrados, calidades y partidas que quieres incluir. La estimación se recalcula al instante." },
  { icon: CalculatorIcon, title: "Revisa el desglose", description: "Verás un rango por partidas con rangos de mercado orientativos, siempre sin IVA y con sus notas." },
  { icon: FileCheckIcon, title: "Pide el presupuesto real", description: "Envíanos el cálculo con tus datos y lo convertimos en un presupuesto cerrado tras una visita sin compromiso." },
];

export default async function CalculatorsPage() {
  const settings = await getSettings();
  if (!settings.calculators.enabled) notFound();
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Calculadoras", path: "/calculadoras" }]} />
          <p className="eyebrow mt-6">Calculadoras de precios</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">Calcula cuánto cuesta tu reforma antes de pedir presupuesto</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
            Nueve calculadoras con rangos de mercado orientativos para viviendas, instalaciones y locales. Sirven para orientarte y para que, cuando nos pidas presupuesto, ya partamos de tus datos.
          </p>
        </Container>
      </section>

      <Section tone="muted">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
          {CALCULATORS.map((c, i) => (
            <RevealItem key={c.id}>
              <Link
                href={`/calculadoras/${c.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-[0_12px_32px_rgba(23,25,29,0.10)] focus-visible:outline-2 focus-visible:outline-copper-500"
              >
                <div className="relative aspect-[16/9] bg-ink-900">
                  {c.imagePath ? (
                    <>
                      <Image src={c.imagePath} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" priority={i < 3} className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                      <IllustrativeBadge className="absolute top-3 left-3" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-ink-grid" aria-hidden />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-copper-600">{c.shortName}</p>
                  <h2 className="font-display mt-2 text-lg leading-snug text-ink-900">{c.name}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">{c.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-900">
                    Calcular ahora <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-gray-500">{settings.calculators.disclaimer}</p>
      </Section>

      <Section tone="white">
        <SectionHeading eyebrow="Cómo funcionan" title="Tres pasos para pasar de una idea a un presupuesto" />
        <RevealGroup className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <RevealItem key={s.title} className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="font-display tabular text-2xl text-copper-500">{String(i + 1).padStart(2, "0")}</span>
                <s.icon className="size-5 text-ink-900" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand
        location="calculators_footer"
        whatsappHref={wa}
        title="¿Prefieres que calculemos nosotros?"
        description="Cuéntanos tu proyecto y te preparamos un presupuesto detallado por partidas tras una visita sin compromiso."
      />
    </>
  );
}
