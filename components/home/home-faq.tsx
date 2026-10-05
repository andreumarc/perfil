import { Section, SectionHeading } from "@/components/layout/section";
import { Faq, type FaqItem } from "@/components/sections/faq";

/**
 * Preguntas frecuentes sobre la forma de trabajar. Se renderizan visibles (requisito
 * de Google para FAQPage) y alimentan el JSON-LD de la home.
 */
export const HOME_FAQS: FaqItem[] = [
  {
    question: "¿Trabajas con empresas de un solo centro?",
    answer:
      "No. Mi foco son redes de 5 a 100 centros: clínicas dentales, centros veterinarios, otros servicios sanitarios, retail, fitness, franquicias y participadas de Private Equity. Los problemas de un solo centro son otros; los de una red (comparar centros, estandarizar, integrar adquisiciones, dirigir managers) son los que he dirigido durante años y en los que puedo aportar más.",
  },
  {
    question: "¿En qué se diferencia tu trabajo del de una consultora?",
    answer:
      "En la responsabilidad y en el punto de partida. He dirigido redes de hasta 25 centros, un P&L de 35 M€ y equipos de 250 personas: no analizo desde fuera, ejecuto con el equipo. Cada intervención termina con cambios implantados en agendas, plantillas, compras y procesos, con responsables y seguimiento semanal, no con un informe de recomendaciones.",
  },
  {
    question: "¿Cómo empieza una colaboración?",
    answer:
      "Con el diagnóstico gratuito de tres minutos o con una sesión estratégica de 30 minutos sin compromiso. A partir de ahí, el primer paso habitual es el Multisite Performance Audit: en 3-4 semanas tienes un P&L por centro comparable, el ranking de la red y un plan de acción priorizado. El alcance y el presupuesto se cierran antes de empezar.",
  },
  {
    question: "¿Trabajas con fondos de Private Equity y procesos Buy & Build?",
    answer:
      "Sí. Due diligence operativa de targets, planes de integración de 100 días para add-ons y dirección operativa de participadas con un objetivo de EBITDA comprometido en el plan de negocio. El reporting está pensado para que el fondo tenga visibilidad sin tener que operar.",
  },
];

export function HomeFaq() {
  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Antes de dar el primer paso."
          description="Lo que suelen preguntarme CEOs, directores generales e inversores antes de empezar a trabajar juntos."
        />
        <Faq items={HOME_FAQS} />
      </div>
    </Section>
  );
}
