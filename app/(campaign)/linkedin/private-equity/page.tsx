import { CampaignLanding } from "@/components/campaign/campaign-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Diagnóstico operativo para participadas multicentro de Private Equity",
  description:
    "¿Cuánto EBITDA hay sin capturar en tu participada multicentro? Diagnóstico de 3 minutos para situar a la plataforma o al add-on en cinco bloques y priorizar palancas de value creation.",
  path: "/linkedin/private-equity",
  noIndex: true,
});

export default function LinkedinPrivateEquityPage() {
  return (
    <CampaignLanding
      campaign="linkedin-private-equity"
      eyebrow="Private Equity · Buy & Build"
      title="¿Cuánto EBITDA hay sin capturar en tu participada multicentro?"
      description="Un diagnóstico operativo de 3 minutos para situar a la plataforma o al add-on en cinco bloques y saber qué palancas de value creation están sin ejecutar."
      problemsTitle="Tres síntomas que vemos en participadas multicentro"
      problems={[
        "La participada reporta facturación, no EBITDA por centro con criterios homogéneos.",
        "La última adquisición sigue operando como una empresa aparte seis meses después.",
        "Las sinergias del plan de inversión no tienen responsable, calendario ni seguimiento.",
      ]}
      outcomes={[
        "Nivel de madurez operativa comparable entre participadas.",
        "Palancas priorizadas por impacto en EBITDA.",
        "Formato de intervención recomendado: audit, sprint, integración a 100 días o COO fraccional.",
      ]}
    />
  );
}
