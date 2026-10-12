import type { LeadsFilter } from "@/lib/validation/admin";

/** Serializa el filtro de leads en la URL omitiendo los valores por defecto. */
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
  if (merged.source && merged.source !== "ALL") sp.set("source", merged.source);
  if (merged.service) sp.set("service", merged.service);
  if (merged.article) sp.set("article", merged.article);
  if (merged.assigned && merged.assigned !== "ALL") sp.set("assigned", merged.assigned);
  if (merged.from) sp.set("from", merged.from);
  if (merged.to) sp.set("to", merged.to);
  if (merged.sort && merged.sort !== DEFAULT_SORT) sp.set("sort", merged.sort);
  if (merged.dir && merged.dir !== DEFAULT_DIR) sp.set("dir", merged.dir);
  if (merged.page && merged.page > 1) sp.set("page", String(merged.page));
  if (merged.pageSize && merged.pageSize !== DEFAULT_PAGE_SIZE) sp.set("pageSize", String(merged.pageSize));
  return sp;
}

export function leadsHref(filter: Partial<LeadsFilter>, overrides: FilterOverrides = {}): string {
  const qs = filterToSearchParams(filter, overrides).toString();
  return qs ? `${LEADS_PATH}?${qs}` : LEADS_PATH;
}

export function hasActiveFilters(filter: Partial<LeadsFilter>): boolean {
  return Boolean(
    filter.q ||
      (filter.status && filter.status !== "ALL") ||
      (filter.source && filter.source !== "ALL") ||
      filter.service ||
      filter.article ||
      (filter.assigned && filter.assigned !== "ALL") ||
      filter.from ||
      filter.to,
  );
}
