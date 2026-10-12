import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { cache } from "react";

import { GLOBAL_FAQS } from "@/content/faqs";
import { SERVICES } from "@/content/services";
import { SECTORS } from "@/content/sectors";
import type { FaqItem } from "@/content/types";
import { getDb } from "@/db/client";
import { faqs } from "@/db/schema";

type Scope = "global" | "service" | "sector" | "area" | "article";

function fallback(scope: Scope, slug?: string): FaqItem[] {
  if (scope === "global") return GLOBAL_FAQS;
  if (scope === "service") return SERVICES.find((s) => s.slug === slug)?.faqs ?? [];
  if (scope === "sector") return SECTORS.find((s) => s.slug === slug)?.faqs ?? [];
  return [];
}

/** FAQs por ámbito. Sin BD, devuelve las definidas en content/. */
export const getFaqs = cache(async (scope: Scope, slug?: string): Promise<FaqItem[]> => {
  const db = getDb();
  if (!db) return fallback(scope, slug);
  try {
    const where = slug ? and(eq(faqs.scope, scope), eq(faqs.scopeSlug, slug)) : eq(faqs.scope, scope);
    const rows = await db.select().from(faqs).where(where).orderBy(asc(faqs.order));
    return rows.map((r) => ({ question: r.question, answer: r.answer }));
  } catch (error) {
    console.error("[cms] error leyendo faqs:", error);
    return fallback(scope, slug);
  }
});
