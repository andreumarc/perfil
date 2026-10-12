import type { Metadata } from "next";
import { ClockIcon, FileCheckIcon, MapPinIcon, PhoneIcon } from "lucide-react";

import { QuoteForm } from "@/components/forms/quote-form";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { formatPhone } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";
import type { FormVariantValue } from "@/lib/validation/lead";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Pedir presupuesto de reforma sin compromiso",
    description: "Cuéntanos tu proyecto de reforma o instalación y recibe un presupuesto detallado por partidas, sin compromiso. Viviendas, locales y negocios.",
    path: "/presupuesto",
    siteName: s.company.name,
  });
}

const VARIANT_BY_GROUP: Record<string, FormVariantValue> = {
  viviendas: "vivienda",
  negocios: "local",
  instalaciones: "instalaciones",
  proyectos: "general",
};

/** El servicio preseleccionado llega por ruta (?servicio= no se usa para mantener la página estática). */
export default async function QuotePage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  void services;
  const { company } = settings;
  void VARIANT_BY_GROUP;

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Presupuesto", path: "/presupuesto" }]} />
          <p className="eyebrow mt-6">Presupuesto sin compromiso</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">Cuéntanos tu proyecto y te preparamos un presupuesto detallado</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
            Cuanta más información nos des, más ajustada será la primera estimación. Te llamamos en horario comercial para concretar detalles y, si procede, concertar una visita gratuita.
          </p>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.05)] md:p-8">
              <QuoteForm layout="full" source="presupuesto" variant="general" />
            </div>
            <aside className="space-y-6">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-base font-semibold text-ink-900">Qué pasa después</h2>
                <ol className="mt-4 space-y-4 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <PhoneIcon className="mt-0.5 size-4 shrink-0 text-copper-500" aria-hidden />
                    <span><strong className="text-ink-900">Te llamamos</strong> para entender el proyecto y resolver dudas.</span>
                  </li>
                  <li className="flex gap-3">
                    <MapPinIcon className="mt-0.5 size-4 shrink-0 text-copper-500" aria-hidden />
                    <span><strong className="text-ink-900">Visitamos el espacio</strong> y tomamos medidas y fotografías.</span>
                  </li>
                  <li className="flex gap-3">
                    <FileCheckIcon className="mt-0.5 size-4 shrink-0 text-copper-500" aria-hidden />
                    <span><strong className="text-ink-900">Presupuesto por partidas</strong> con plazos y alternativas de materiales.</span>
                  </li>
                  <li className="flex gap-3">
                    <ClockIcon className="mt-0.5 size-4 shrink-0 text-copper-500" aria-hidden />
                    <span><strong className="text-ink-900">Sin prisas ni compromiso:</strong> lo revisamos contigo antes de decidir.</span>
                  </li>
                </ol>
              </div>
              {company.phone || company.email || company.hours ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-700">
                  <h2 className="text-base font-semibold text-ink-900">¿Prefieres hablar directamente?</h2>
                  {company.phone ? <p className="tabular mt-3">Teléfono: {formatPhone(company.phone)}</p> : null}
                  {company.email ? <p className="mt-1">Email: {company.email}</p> : null}
                  {company.hours ? <p className="mt-1 text-gray-500">{company.hours}</p> : null}
                </div>
              ) : null}
              <p className="text-xs text-gray-500">
                Tus datos se usan únicamente para gestionar tu solicitud, conforme a la{" "}
                <a href="/politica-privacidad" className="underline underline-offset-4">política de privacidad</a>.
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
