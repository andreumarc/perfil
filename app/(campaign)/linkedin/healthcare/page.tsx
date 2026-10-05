import { CampaignLanding } from "@/components/campaign/campaign-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Diagnóstico operativo gratuito para grupos de clínicas",
  description:
    "¿Sabes qué clínicas de tu grupo destruyen margen? Diagnóstico de 3 minutos para grupos de clínicas dentales, veterinarias y healthcare: P&L por clínica, productividad y una única forma de operar.",
  path: "/linkedin/healthcare",
  noIndex: true,
});

export default function LinkedinHealthcarePage() {
  return (
    <CampaignLanding
      campaign="linkedin-healthcare"
      eyebrow="Grupos de clínicas · healthcare, dental, veterinaria"
      title="¿Sabes qué clínicas de tu grupo destruyen margen?"
      description="Diagnóstico gratuito de 3 minutos para grupos de clínicas: P&L por clínica, productividad por profesional, agendas y una única forma de operar."
      problemsTitle="Tres síntomas que vemos en grupos de clínicas"
      problems={[
        "Dos o tres clínicas arrastran el margen del grupo y no hay datos para decidir qué hacer con ellas.",
        "El coste de personal se dispara en algunas clínicas sin que la agenda lo justifique.",
        "Cada clínica mide cosas distintas: el ranking interno no existe.",
      ]}
      outcomes={[
        "Madurez operativa del grupo en cinco bloques.",
        "Tres acciones prioritarias sobre P&L, agendas y equipos.",
        "Servicio recomendado y resultado por email.",
      ]}
    />
  );
}
