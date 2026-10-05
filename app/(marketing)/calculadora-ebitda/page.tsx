import Link from "next/link";
import { CheckIcon, InfoIcon } from "lucide-react";

import { EbitdaCalculator } from "@/components/calculator/ebitda-calculator";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq, type FaqItem } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const PATH = "/calculadora-ebitda";

export const metadata = pageMetadata({
  title: "Calculadora de oportunidad EBITDA para redes de centros",
  description:
    "Introduce seis datos de tu P&L y compara el margen EBITDA, el coste de personal, las compras y la ocupación de tu red de centros con rangos de referencia de gestión por sector. Sin registro.",
  path: PATH,
  keywords: ["calculadora EBITDA", "margen EBITDA por centro", "benchmark EBITDA multicentro", "mejorar EBITDA empresa"],
});

const READING_GUIDE = [
  {
    title: "Qué significa estar fuera de rango",
    body:
      "Cada métrica se compara con una banda de referencia de gestión para redes de tu sector. Un margen EBITDA o una ocupación por debajo de la banda, o un coste de personal o de compras por encima, señalan dónde se está quedando el resultado. Estar en rango no significa que no haya recorrido: la media de la red suele esconder dos o tres centros que la arrastran hacia abajo.",
  },
  {
    title: "Por qué la ocupación manda",
    body:
      "En una red de centros la mayor parte del coste es fijo: alquiler, equipamiento, equipo mínimo por turno. Cuando la ocupación está por debajo del rango, cada punto adicional de capacidad utilizada cae casi íntegro al EBITDA, porque el coste ya está pagado. Por eso agenda, horarios y demanda por centro suelen ser la primera conversación.",
  },
  {
    title: "Por qué el coste de personal es la palanca más rápida",
    body:
      "El personal es la partida más grande del P&L de un centro y la que más dispersión presenta entre unidades: horas contratadas frente a horas facturadas, turnos dimensionados por costumbre y no por demanda, productividad por profesional sin medir. Ajustarla no exige inversión ni cambiar el modelo: exige datos comparables y una decisión por centro.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿De dónde salen los rangos de referencia de la calculadora?",
    answer:
      "Son rangos orientativos de gestión construidos a partir de la experiencia operativa en redes multicentro de healthcare, dental, veterinaria, retail y otros servicios. No son estadísticas sectoriales oficiales ni proceden de ningún estudio publicado; sirven para situar tu red y detectar dónde conviene mirar, no para auditarla.",
  },
  {
    question: "¿El escenario de EBITDA es una previsión de mejora?",
    answer:
      "No. El escenario muestra qué EBITDA tendría tu red si su margen se situara dentro del rango de referencia, manteniendo la facturación actual. Es una forma de dimensionar el recorrido, no una previsión ni una promesa de ahorro. El resultado real depende de la estructura de costes fijos, el mix de servicios y la situación concreta de cada centro.",
  },
  {
    question: "¿Qué pasa con mis datos si pido el análisis?",
    answer:
      "Si solo calculas el benchmark, los datos se quedan en tu navegador y no se envían a ningún servidor. Si pides el análisis, recibo tus seis cifras junto con tus datos de contacto para prepararte una primera lectura personal en menos de 48 horas. Puedes consultar el detalle en la política de privacidad.",
  },
];

export default function CalculadoraEbitdaPage() {
  return (
    <>
      <Section size="compact" className="pb-0 md:pb-0">
        <Breadcrumbs items={[{ name: "Calculadora EBITDA", path: PATH }]} />
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeading
            as="h1"
            eyebrow="EBITDA Opportunity Calculator"
            title="¿Dónde se queda el EBITDA de tu red de centros?"
            description="Introduce seis datos de tu P&L y compara tu red con rangos de referencia de gestión. Sin registro para ver el benchmark."
          />
          <ul className="space-y-3 text-gray-700 lg:pb-2">
            {[
              "EBITDA total y por centro, al instante.",
              "Cuatro métricas frente a su rango de referencia sectorial.",
              "Escenario de margen para dimensionar el recorrido.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-signal" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="muted" size="compact" className="mt-12 md:mt-16" containerSize="wide">
        <EbitdaCalculator />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Cómo leer el resultado"
          title="El benchmark no te dice qué hacer. Te dice dónde mirar primero."
          description="Tres claves para interpretar las cuatro métricas y traducirlas en una conversación con tu equipo o tu consejo."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {READING_GUIDE.map((block, index) => (
            <article key={block.title} className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="tabular text-sm font-semibold text-signal">0{index + 1}</p>
              <h3 className="mt-3 text-xl font-semibold text-navy-900">{block.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600">{block.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex gap-4 rounded-lg border border-navy-100 bg-navy-50 p-6">
          <InfoIcon className="mt-0.5 size-5 shrink-0 text-navy-700" aria-hidden />
          <div>
            <p className="font-semibold text-navy-900">Nota de método</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              Los rangos son referencias orientativas de gestión, no datos sectoriales oficiales. El escenario de EBITDA
              dimensiona el recorrido manteniendo la facturación actual; no es una previsión ni una promesa de ahorro.
              La lectura real exige el P&amp;L centro a centro, que es exactamente lo que trabajamos en un{" "}
              <Link href="/servicios/multisite-performance-audit" className="underline underline-offset-4 hover:text-navy-900">
                Multisite Performance Audit
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted" containerSize="narrow">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de introducir tus datos" />
        <Faq items={FAQ_ITEMS} className="mt-10" />
        <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      </Section>

      <CtaBand
        location="calculator_final"
        title="¿Quieres pasar del benchmark al plan de acción?"
        description="El diagnóstico de 3 minutos sitúa la madurez operativa de tu red en cinco bloques y te devuelve las tres acciones prioritarias. Si prefieres hablar directamente, reserva 30 minutos."
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "EBITDA Opportunity Calculator",
          url: `${site.url}${PATH}`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          inLanguage: "es-ES",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" },
          description:
            "Calculadora gratuita que compara el margen EBITDA, el coste de personal, las compras y la ocupación de una red de centros con rangos de referencia de gestión por sector.",
          provider: { "@id": `${site.url}/#organization` },
        }}
      />
    </>
  );
}
