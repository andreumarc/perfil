import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ServiceCard } from "@/components/home/services-overview";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { getServicesByGroup } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Servicios de reformas e instalaciones",
    description:
      "Reformas integrales de viviendas, locales, oficinas, gimnasios, restaurantes y clínicas, e instalaciones de electricidad, fontanería, climatización, aerotermia, ventilación y más. Presupuesto sin compromiso.",
    path: "/servicios",
    siteName: s.company.name,
    keywords: ["servicios de reformas", "empresa de reformas e instalaciones", "reformas integrales", "instalaciones eléctricas", "climatización"],
  });
}

export default async function ServicesPage() {
  const [settings, groups] = await Promise.all([getSettings(), getServicesByGroup()]);
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Servicios", path: "/servicios" }]} />
          <p className="eyebrow mt-6">Servicios</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">Reformas integrales e instalaciones, de la obra a la última conexión</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
            Un único equipo coordina diseño, licencias, albañilería, instalaciones y acabados. Elige el servicio que necesitas o cuéntanos tu proyecto y te orientamos.
          </p>
          <nav aria-label="Grupos de servicios" className="mt-6 flex flex-wrap gap-2">
            {groups.map(({ group }) => (
              <a key={group.slug} href={`#${group.slug}`} className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-ink-900 hover:border-copper-400 hover:bg-copper-50">
                {group.name}
              </a>
            ))}
            <Link href="/calculadoras" className="inline-flex items-center gap-1 rounded-full border border-copper-300 bg-copper-50 px-3.5 py-1.5 text-sm font-medium text-copper-700 hover:bg-copper-100">
              Calculadoras de precios <ArrowRightIcon className="size-3.5" aria-hidden />
            </Link>
          </nav>
        </Container>
      </section>

      {groups.map(({ group, services }, index) =>
        services.length ? (
          <Section key={group.slug} id={group.slug} tone={index % 2 === 0 ? "white" : "muted"} className="scroll-mt-20">
            <div className="flex flex-col gap-2 border-l-2 border-copper-500 pl-4 md:flex-row md:items-baseline md:justify-between">
              <h2 className="font-display text-2xl text-ink-900 md:text-3xl">{group.name}</h2>
              <p className="max-w-xl text-sm text-gray-600 md:text-base">{group.description}</p>
            </div>
            <RevealGroup className={group.slug === "instalaciones" ? "mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" : "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"} amount={0.05}>
              {services.map((s, i) => (
                <RevealItem key={s.slug} scale={group.slug === "instalaciones"}>
                  <ServiceCard service={s} compact={group.slug === "instalaciones"} priority={index === 0 && i < 2} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Section>
        ) : null,
      )}

      <CtaBand location="services_footer" whatsappHref={wa} title="¿No encuentras exactamente lo que necesitas?" description="Cuéntanos tu proyecto: combinamos los servicios que haga falta y te damos un presupuesto único por partidas." />
    </>
  );
}
