import { site } from "@/lib/site";

/**
 * ProfilePage de schema.org para /sobre-mi. La entidad Person ya se declara en
 * el layout (`personJsonLd`), aquí solo se referencia por @id.
 */
export function profilePageJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${site.url}/sobre-mi#profile`,
    url: `${site.url}/sobre-mi`,
    name: `Sobre ${site.name}`,
    inLanguage: "es-ES",
    mainEntity: { "@id": `${site.url}/#person` },
    isPartOf: { "@id": `${site.url}/#website` },
  };
}
