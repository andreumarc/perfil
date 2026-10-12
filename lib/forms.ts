import type { ServiceGroupSlug } from "@/content/types";
import type { FormVariantValue } from "@/lib/validation/lead";

/** Variante del formulario contextual según el grupo de servicio. */
export const VARIANT_BY_GROUP: Record<ServiceGroupSlug, FormVariantValue> = {
  viviendas: "vivienda",
  negocios: "local",
  instalaciones: "instalaciones",
  proyectos: "general",
};

const VARIANT_BY_SECTOR: Record<string, FormVariantValue> = {
  viviendas: "vivienda",
  pisos: "vivienda",
  casas: "vivienda",
  "comunidades-propietarios": "vivienda",
  gimnasios: "gimnasio",
  "centros-deportivos": "gimnasio",
  restaurantes: "restaurante",
  "bares-cafeterias": "restaurante",
  "clinicas-dentales": "clinica",
  "clinicas-medicas": "clinica",
};

/** Variante del formulario para un sector (negocios genéricos → "local"). */
export function variantForSector(slug: string): FormVariantValue {
  return VARIANT_BY_SECTOR[slug] ?? "local";
}

/** Variante para un servicio concreto: algunos servicios de negocio tienen variante propia. */
export function variantForService(slug: string, groupSlug: ServiceGroupSlug): FormVariantValue {
  if (slug === "reformas-gimnasios") return "gimnasio";
  if (slug === "reformas-restaurantes") return "restaurante";
  if (slug === "reformas-clinicas") return "clinica";
  return VARIANT_BY_GROUP[groupSlug];
}
