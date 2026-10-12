import type { Metadata } from "next";
import { ClockIcon, MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { QuoteForm } from "@/components/forms/quote-form";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { getSettings } from "@/lib/cms/settings";
import { formatPhone, telHref, whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Contacto",
    description: `Contacta con ${s.company.name}: teléfono, WhatsApp, email y formulario. Reformas e instalaciones en ${s.company.zones.join(", ")}.`,
    path: "/contacto",
    siteName: s.company.name,
  });
}

export default async function ContactPage() {
  const settings = await getSettings();
  const { company } = settings;
  const phone = telHref(company.phone);
  const wa = whatsappHref(company.whatsapp, company.whatsappMessage);
  const address = [company.address, [company.postalCode, company.city].filter(Boolean).join(" "), company.province].filter(Boolean).join(", ");
  const mapsUrl = settings.integrations.mapsUrl || (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "");

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Contacto", path: "/contacto" }]} />
          <p className="eyebrow mt-6">Contacto</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">Hablemos de tu reforma</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
            Escríbenos, llámanos o deja tus datos y te contactamos en horario comercial. Para proyectos concretos, el{" "}
            <a href="/presupuesto" className="underline underline-offset-4 hover:text-ink-900">formulario de presupuesto</a> nos permite prepararte una primera estimación más ajustada.
          </p>
        </Container>
      </section>

      <section className="py-12 md:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div className="space-y-6">
              <ul className="space-y-4">
                {phone ? (
                  <li className="flex items-start gap-3">
                    <PhoneIcon className="mt-1 size-5 shrink-0 text-copper-500" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Teléfono</p>
                      <TrackedLink href={phone} event="phone_clicked" props={{ location: "contact_page" }} className="tabular text-lg font-semibold text-ink-900 hover:underline">
                        {formatPhone(company.phone)}
                      </TrackedLink>
                    </div>
                  </li>
                ) : null}
                {wa ? (
                  <li className="flex items-start gap-3">
                    <MessageCircleIcon className="mt-1 size-5 shrink-0 text-copper-500" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">WhatsApp</p>
                      <TrackedLink href={wa} event="whatsapp_clicked" props={{ location: "contact_page" }} className="text-lg font-semibold text-ink-900 hover:underline">
                        Escríbenos por WhatsApp
                      </TrackedLink>
                    </div>
                  </li>
                ) : null}
                {company.email ? (
                  <li className="flex items-start gap-3">
                    <MailIcon className="mt-1 size-5 shrink-0 text-copper-500" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Email</p>
                      <TrackedLink href={`mailto:${company.email}`} event="email_clicked" props={{ location: "contact_page" }} className="text-lg font-semibold text-ink-900 hover:underline">
                        {company.email}
                      </TrackedLink>
                    </div>
                  </li>
                ) : null}
                {address ? (
                  <li className="flex items-start gap-3">
                    <MapPinIcon className="mt-1 size-5 shrink-0 text-copper-500" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Dirección</p>
                      <p className="text-base text-ink-900">{address}</p>
                      {mapsUrl ? (
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-copper-600 underline underline-offset-4">
                          Ver en Google Maps
                        </a>
                      ) : null}
                    </div>
                  </li>
                ) : null}
                {company.hours ? (
                  <li className="flex items-start gap-3">
                    <ClockIcon className="mt-1 size-5 shrink-0 text-copper-500" aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Horario</p>
                      <p className="text-base text-ink-900">{company.hours}</p>
                    </div>
                  </li>
                ) : null}
              </ul>
              {!phone && !wa && !company.email && !address ? (
                <p className="rounded-md border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
                  Los datos de contacto se completan desde el panel de administración. Mientras tanto, usa el formulario.
                </p>
              ) : null}
              {company.zones.length ? (
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Zonas de actuación</p>
                  <p className="mt-2 text-sm text-gray-700">{company.zones.join(" · ")}</p>
                </div>
              ) : null}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.05)] md:p-8">
              <h2 className="font-display text-2xl text-ink-900">Déjanos tus datos</h2>
              <QuoteForm layout="compact" source="contacto" variant="general" submitLabel="Enviar consulta" className="mt-6" intro="Te respondemos en horario comercial. Si tu consulta es un proyecto concreto, cuéntanos qué necesitas y dónde." />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
