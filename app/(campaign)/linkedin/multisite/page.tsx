import { CampaignLanding } from "@/components/campaign/campaign-landing";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Diagnóstico Multisite gratuito para empresas multicentro",
  description:
    "¿Puedes comparar la rentabilidad de tus centros en 5 minutos? Diagnóstico operativo de 3 minutos para redes de centros: puntuación 0-100 y tres acciones prioritarias.",
  path: "/linkedin/multisite",
  noIndex: true,
});

export default function LinkedinMultisitePage() {
  return (
    <CampaignLanding
      campaign="linkedin-multisite"
      eyebrow="Empresas multicentro"
      title="Si no puedes comparar la rentabilidad de tus centros en 5 minutos, tienes un problema de gestión."
      description="Diagnóstico gratuito de 3 minutos: mide la madurez operativa de tu red en finanzas, operaciones, personas, datos y escalabilidad y recibe tres acciones prioritarias."
      problems={[
        "La facturación crece pero el EBITDA no acompaña y nadie sabe explicar por qué.",
        "Cada centro reporta distinto: consolidar un cierre lleva semanas.",
        "Los responsables de centro se gestionan por incidencias, no por indicadores.",
      ]}
      outcomes={[
        "Puntuación 0-100 y nivel de madurez de tu red.",
        "3 problemas, 3 oportunidades y 3 acciones priorizadas.",
        "Servicio recomendado y copia del resultado por email.",
      ]}
    />
  );
}
