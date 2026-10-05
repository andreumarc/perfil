import { getService, type ServiceSlug } from "@/content/services";
import type { MainProblem, Sector } from "@/types/lead";

/**
 * Resuelve el parámetro `?interes=` de /contacto a un interés conocido.
 * Solo se aceptan slugs del catálogo de servicios y "private-equity": cualquier
 * otro valor se ignora para no reflejar texto arbitrario de la URL en la página
 * ni en el contexto enviado al CRM.
 */
export interface Interest {
  slug: ServiceSlug | typeof PRIVATE_EQUITY_SLUG;
  /** Nombre que se muestra ("Interés: …"). */
  label: string;
  /** Prioridad principal coherente con el interés. */
  mainProblem: MainProblem;
  /** Sector preseleccionado cuando el interés lo determina. */
  sector?: Sector;
}

export const PRIVATE_EQUITY_SLUG = "private-equity";

const MAIN_PROBLEM_BY_SLUG: Record<ServiceSlug, MainProblem> = {
  "integration-100": "integracion",
  "multisite-performance-audit": "rentabilidad",
  "ebitda-improvement": "rentabilidad",
  "fractional-coo": "equipos",
};

export function resolveInterest(raw: string | null | undefined): Interest | null {
  if (!raw) return null;
  const slug = raw.trim().toLowerCase();
  if (!slug) return null;

  if (slug === PRIVATE_EQUITY_SLUG) {
    return {
      slug: PRIVATE_EQUITY_SLUG,
      label: "Private Equity · Buy & Build",
      mainProblem: "integracion",
      sector: "private_equity",
    };
  }

  const service = getService(slug);
  if (!service) return null;
  return {
    slug: service.slug,
    label: service.name,
    mainProblem: MAIN_PROBLEM_BY_SLUG[service.slug],
  };
}
