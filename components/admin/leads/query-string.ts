import type { LeadsFilter } from "@/lib/validation/admin";

/**
 * Utilidades para serializar el filtro de leads en la URL.
 * Omite los valores por defecto para mantener URLs limpias y compartibles.
 */

export const LEADS_PATH = "/admin/leads";
export const DEFAULT_SORT: LeadsFilter["sort"] = "createdAt";
export const DEFAULT_DIR: LeadsFilter["dir"] = "desc";
export const DEFAULT_PAGE_SIZE = 25;

export type FilterOverrides = Partial<LeadsFilter>;

export function filterToSearchParams(filter: Partial<LeadsFilter>, overrides: FilterOverrides = {}): URLSearchParams {
  const merged: Partial<LeadsFilter> = { ...filter, ...overrides };
  const sp = new URLSearchParams();
  if (merged.q) sp.set("q", merged.q);
  if (merged.status && merged.status !== "ALL") sp.set("status", merged.status);
  if (merged.level && merged.level !== "ALL") sp.set("level", merged.level);
  if (merged.source) sp.set("source", merged.source);
  if (merged.sector) sp.set("sector", merged.sector);
  if (merged.hot === "1") sp.set("hot", "1");
  if (merged.sort && merged.sort !== DEFAULT_SORT) sp.set("sort", merged.sort);
  if (merged.dir && merged.dir !== DEFAULT_DIR) sp.set("dir", merged.dir);
  if (merged.page && merged.page > 1) sp.set("page", String(merged.page));
  if (merged.pageSize && merged.pageSize !== DEFAULT_PAGE_SIZE) sp.set("pageSize", String(merged.pageSize));
  return sp;
}

/** Enlace a /admin/leads con el filtro actual más los cambios indicados. */
export function leadsHref(filter: Partial<LeadsFilter>, overrides: FilterOverrides = {}): string {
  const qs = filterToSearchParams(filter, overrides).toString();
  return qs ? `${LEADS_PATH}?${qs}` : LEADS_PATH;
}

/** True si hay algún filtro de contenido activo (no cuenta orden ni paginación). */
export function hasActiveFilters(filter: Partial<LeadsFilter>): boolean {
  return Boolean(
    filter.q ||
      (filter.status && filter.status !== "ALL") ||
      (filter.level && filter.level !== "ALL") ||
      filter.source ||
      filter.sector ||
      filter.hot === "1",
  );
}
