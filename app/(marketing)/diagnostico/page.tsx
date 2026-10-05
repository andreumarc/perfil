import { DiagnosticWizard } from "@/components/diagnostic/diagnostic-wizard";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { Faq, type FaqItem } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { DIMENSIONS, DIMENSION_DESCRIPTIONS, DIMENSION_LABELS } from "@/lib/diagnostic/questions";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { credentials, site } from "@/lib/site";

const PATH = "/diagnostico";

export const metadata = pageMetadata({
  title: "Diagnóstico Multisite gratuito: madurez operativa de tu red de centros",
  description:
    "15 preguntas, 3 minutos. Puntuación 0-100 en finanzas, operaciones, personas, datos y escalabilidad, con 3 problemas, 3 oportunidades y 3 acciones prioritarias para tu red de centros.",
  path: PATH,
  keywords: [
    "diagnóstico operativo multicentro",
    "madurez operativa",
    "rentabilidad por centro",
    "P&L por centro",
    "KPIs multicentro",
    "gestión multicentro",
  ],
});

const AUDIENCES = [
  {
    role: "CEO · Director General",
    title: "Redes de 5 a 100 centros",
    body:
      "Si tienes 15 centros y no puedes comparar su rentabilidad en menos de cinco minutos, tienes un problema de gestión. El diagnóstico lo sitúa en cinco bloques y te dice por dónde empezar.",
  },
  {
    role: "CFO · COO",
    title: "Contabilidad al día, P&L operativo a medias",
    body:
      "Cierres correctos pero sin un P&L por centro con criterios homogéneos, sin plantilla objetivo y con KPIs que cada unidad define a su manera. El resultado señala qué falta para dirigir con datos.",
  },
  {
    role: "Inversor · Operating Partner",
    title: "Participadas y targets multicentro",
    body:
      "Una fotografía rápida de la madurez operativa de una plataforma, un add-on o un target: qué palancas de EBITDA están sin ejecutar y qué formato de intervención encaja.",
  },
] as const;

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Cuánto tarda y qué necesito tener a mano?",
    answer:
      "Unos tres minutos. Son quince preguntas de respuesta cerrada sobre cómo se gestiona hoy la red: P&L por centro, KPIs, procedimientos, productividad, responsables de centro y plan de EBITDA. No necesitas cifras ni documentos; basta con conocer cómo funciona tu organización.",
  },
  {
    question: "¿Qué pasa con mis datos?",
    answer:
      "Tus respuestas y tus datos de contacto se utilizan para calcular el resultado, enviarte una copia por email y, solo si lo solicitas, concertar una sesión. No se ceden a terceros ni se usan para publicidad. El detalle está en la política de privacidad y puedes ejercer tus derechos en cualquier momento.",
  },
  {
    question: "¿El resultado es una auditoría?",
    answer:
      "No. Es un autodiagnóstico orientativo basado en tus respuestas: sirve para situar la madurez operativa de la red y priorizar por dónde empezar. El análisis real, con P&L por centro, ranking y plan de acción cuantificado, es el Multisite Performance Audit.",
  },
];

export default function DiagnosticoPage() {
  return (
    <>
      <Section size="compact" className="pb-0 md:pb-0">
        <Breadcrumbs items={[{ name: "Diagnóstico Multisite", path: PATH }]} />
        <div className="mt-8">
          <SectionHeading
            as="h1"
            eyebrow="Diagnóstico Multisite · gratuito"
            title="Mide la madurez operativa de tu red de centros en 3 minutos."
            description="Quince preguntas sobre P&L, KPIs, procesos, equipos y capacidad de crecer. Resultado inmediato, sin coste y pensado para CEOs, directores generales, COOs, CFOs e inversores."
          />
          <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-gray-500">
            {credentials.map((c, index) => (
              <li key={c.label} className="flex items-center gap-3">
                {index > 0 ? <span className="text-gray-300">·</span> : null}
                <span>
                  <span className="font-semibold text-navy-900">
                    {c.value}
                    {c.suffix}
                  </span>{" "}
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="muted" containerSize="wide" className="mt-12 md:mt-16">
        <div className="mx-auto max-w-5xl">
          <DiagnosticWizard />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Cinco bloques"
          title="Lo que un comité de dirección debería poder responder sobre su red."
          description="Cada bloque puntúa de 0 a 100. El resultado no compara tu red con un sector: compara cómo se gestiona hoy con cómo se gestiona una red que escala sin perder control."
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {DIMENSIONS.map((dim, index) => (
            <li key={dim} className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="tabular text-sm font-semibold text-signal">0{index + 1}</p>
              <h3 className="mt-3 text-lg font-semibold text-navy-900">{DIMENSION_LABELS[dim]}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{DIMENSION_DESCRIPTIONS[dim]}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Para quién es"
          title="Para quien tiene que responder por el EBITDA de varios centros."
          description="El diagnóstico está pensado para quien dirige, financia o invierte en una red de centros y necesita saber dónde está el potencial antes de decidir."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {AUDIENCES.map((item) => (
            <article key={item.role} className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="eyebrow">{item.role}</p>
              <h3 className="mt-3 text-xl font-semibold text-navy-900">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section containerSize="narrow">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de empezar" />
        <Faq items={FAQ_ITEMS} className="mt-10" />
        <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Diagnóstico Multisite",
          url: `${site.url}${PATH}`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          inLanguage: "es-ES",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" },
          description:
            "Autodiagnóstico gratuito de madurez operativa para redes de centros: puntuación 0-100 en finanzas, operaciones, personas, datos y escalabilidad, con problemas, oportunidades y acciones prioritarias.",
          provider: { "@id": `${site.url}/#organization` },
        }}
      />
    </>
  );
}
