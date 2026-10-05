import { site } from "@/lib/site";

export const CONTACT_PATH = "/contacto";

/** Schema.org ContactPage para /contacto (enlazado a la organización global). */
export function contactPageJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${site.url}${CONTACT_PATH}#contactpage`,
    name: `Contacto · ${site.name}`,
    url: `${site.url}${CONTACT_PATH}`,
    description:
      "Formulario de contacto para CEOs, directores generales, COOs, CFOs e inversores de empresas multicentro. Respuesta personal en menos de 48 horas.",
    inLanguage: "es-ES",
    isPartOf: { "@id": `${site.url}/#website` },
    mainEntity: { "@id": `${site.url}/#organization` },
    about: { "@id": `${site.url}/#person` },
  };
}
