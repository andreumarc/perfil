import Link from "next/link";

import { Section } from "@/components/layout/section";
import { formatPhone } from "@/lib/phone";
import type { SiteSettings } from "@/lib/validation/settings";

/**
 * Ficha breve de la empresa: nombre, oficina, zonas, servicios y contacto en una
 * lista de definiciones. Da a usuarios y a buscadores con IA los datos de
 * identidad de forma literal y consistente en toda la web.
 */
export function CompanyFactsheet({ settings, className }: { settings: SiteSettings; className?: string }) {
  const c = settings.company;
  const zones = c.zones.filter((z) => !/^toda\s/i.test(z));
  const rows: { term: string; value: React.ReactNode }[] = [
    { term: "Empresa", value: c.legalName || c.name },
    { term: "Qué hacemos", value: "Reformas integrales e instalaciones para viviendas y negocios: pisos, casas, locales, oficinas, gimnasios, restaurantes, clínicas y naves. Las instalaciones las ejecutan y certifican profesionales habilitados." },
    { term: "Dónde", value: `Toda España y, sobre todo, toda Cataluña. Oficina en ${c.city || "L'Hospitalet de Llobregat"}${zones.length ? `; obra habitual en ${zones.join(", ")}` : ""}.` },
    { term: "Cómo", value: "Visita y medición, presupuesto por partidas sin compromiso, un único responsable de obra, calendario por fases y gestión de licencias." },
    ...(c.phone ? [{ term: "Contacto", value: `${formatPhone(c.phone)} (teléfono y WhatsApp)${c.email ? `, ${c.email}` : ""}${c.hours ? `. ${c.hours}` : ""}` }] : []),
  ];
  return (
    <Section tone="muted" size="compact" className={className}>
      <dl className="grid gap-x-10 gap-y-4 rounded-lg border border-gray-200 bg-white p-6 text-sm md:grid-cols-[auto_1fr] md:p-8">
        {rows.map((r) => (
          <div key={r.term} className="contents">
            <dt className="font-semibold text-ink-900">{r.term}</dt>
            <dd className="text-gray-600">{r.value}</dd>
          </div>
        ))}
        <div className="contents">
          <dt className="font-semibold text-ink-900">Más</dt>
          <dd className="text-gray-600">
            <Link href="/empresa" className="underline underline-offset-4 hover:text-ink-900">Quiénes somos</Link>,{" "}
            <Link href="/zonas" className="underline underline-offset-4 hover:text-ink-900">zonas</Link> y{" "}
            <Link href="/presupuesto" className="underline underline-offset-4 hover:text-ink-900">presupuesto sin compromiso</Link>.
          </dd>
        </div>
      </dl>
    </Section>
  );
}
