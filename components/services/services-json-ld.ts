import type { Service } from "@/content/services";
import { site } from "@/lib/site";

/** Ruta pública de la página de un servicio. */
export function servicePath(slug: Service["slug"]) {
  return `/servicios/${slug}`;
}

/** Enlace al formulario de contacto con el interés preseleccionado. */
export function serviceContactHref(slug: Service["slug"]) {
  return `/contacto?interes=${slug}`;
}

/** ItemList de schema.org para el índice de servicios. */
export function servicesItemListJsonLd(services: readonly Service[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios para empresas multicentro",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.name,
      description: service.summary,
      url: `${site.url}${servicePath(service.slug)}`,
    })),
  };
}
