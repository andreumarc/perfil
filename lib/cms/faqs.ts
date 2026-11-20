import "server-only";

import { asc } from "drizzle-orm";
import { cache } from "react";

import { GLOBAL_FAQS } from "@/content/faqs";
import { SERVICES } from "@/content/services";
import { SECTORS } from "@/content/sectors";
import { LOCAL_AREAS } from "@/content/zones";
import type { FaqItem } from "@/content/types";
import { getDb } from "@/db/client";
import { cmsCache } from "@/lib/cms/cached";
import { faqs } from "@/db/schema";

type Scope = "global" | "service" | "sector" | "area" | "article";

function fallback(scope: Scope, slug?: string): FaqItem[] {
  if (scope === "global") return GLOBAL_FAQS;
  if (scope === "service") return SERVICES.find((s) => s.slug === slug)?.faqs ?? [];
  if (scope === "sector") return SECTORS.find((s) => s.slug === slug)?.faqs ?? [];
  if (scope === "area") return LOCAL_AREAS.find((z) => z.slug === slug)?.faqs ?? [];
  return [];
}

type FaqRow = { scope: string; scopeSlug: string | null; question: string; answer: string };

/** Todas las FAQs en una sola lectura (caché compartida); null si no hay BD o falla. */
const fetchAllFaqs = cmsCache("faqs", async (): Promise<FaqRow[] | null> => {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db.select().from(faqs).orderBy(asc(faqs.scope), asc(faqs.scopeSlug), asc(faqs.order));
    return rows.map((r) => ({ scope: r.scope, scopeSlug: r.scopeSlug, question: r.question, answer: r.answer }));
  } catch (error) {
    console.error("[cms] error leyendo faqs:", error);
    return null;
  }
});

/** FAQs por ámbito. Sin BD, devuelve las definidas en content/. */
export const getFaqs = cache(async (scope: Scope, slug?: string): Promise<FaqItem[]> => {
  const all = await fetchAllFaqs();
  if (!all) return fallback(scope, slug);
  return all.filter((r) => r.scope === scope && (slug ? r.scopeSlug === slug : true)).map((r) => ({ question: r.question, answer: r.answer }));
});
