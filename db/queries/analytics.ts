import "server-only";

import { and, count, countDistinct, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { followUps, leadEvents, leads } from "@/db/schema";
import { LEAD_STATUSES, type LeadStatus } from "@/types/lead";

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export interface OverviewStats {
  totalLeads: number;
  leads7d: number;
  leads30d: number;
  byStatus: Record<LeadStatus, number>;
  /** % de leads (histórico) que han llegado a WON. */
  winRate: number;
  /** % de leads 30 d que han pasado de NEW (contactados o más). */
  contactRate30d: number;
  overdueTasks: number;
  tasksToday: number;
  visitors30d: number;
  pageViews30d: number;
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const db = requireDb();
  const d7 = daysAgo(7);
  const d30 = daysAgo(30);
  const now = new Date();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [totals, l7, l30, statusRows, contacted30, overdue, today, visitors, views] = await Promise.all([
    db.select({ value: count() }).from(leads),
    db.select({ value: count() }).from(leads).where(gte(leads.createdAt, d7)),
    db.select({ value: count() }).from(leads).where(gte(leads.createdAt, d30)),
    db.select({ status: leads.status, value: count() }).from(leads).groupBy(leads.status),
    db
      .select({ value: count() })
      .from(leads)
      .where(and(gte(leads.createdAt, d30), sql`${leads.status} <> 'NEW'`)),
    db.select({ value: count() }).from(followUps).where(and(eq(followUps.done, false), lte(followUps.dueAt, now))),
    db
      .select({ value: count() })
      .from(followUps)
      .where(and(eq(followUps.done, false), gte(followUps.dueAt, now), lte(followUps.dueAt, endOfToday))),
    db
      .select({ value: countDistinct(leadEvents.visitorId) })
      .from(leadEvents)
      .where(and(eq(leadEvents.eventType, "page_view"), gte(leadEvents.createdAt, d30))),
    db
      .select({ value: count() })
      .from(leadEvents)
      .where(and(eq(leadEvents.eventType, "page_view"), gte(leadEvents.createdAt, d30))),
  ]);

  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>;
  for (const r of statusRows) byStatus[r.status] = Number(r.value);
  const total = Number(totals[0]?.value ?? 0);
  const total30 = Number(l30[0]?.value ?? 0);

  return {
    totalLeads: total,
    leads7d: Number(l7[0]?.value ?? 0),
    leads30d: total30,
    byStatus,
    winRate: total > 0 ? Math.round((byStatus.WON / total) * 100) : 0,
    contactRate30d: total30 > 0 ? Math.round((Number(contacted30[0]?.value ?? 0) / total30) * 100) : 0,
    overdueTasks: Number(overdue[0]?.value ?? 0),
    tasksToday: Number(today[0]?.value ?? 0),
    visitors30d: Number(visitors[0]?.value ?? 0),
    pageViews30d: Number(views[0]?.value ?? 0),
  };
}

export interface WeekPoint {
  week: string;
  leads: number;
  won: number;
}

export async function getLeadsPerWeek(weeks = 12): Promise<WeekPoint[]> {
  const db = requireDb();
  const since = daysAgo(weeks * 7);
  const rows = await db
    .select({
      week: sql<string>`to_char(date_trunc('week', ${leads.createdAt}), 'YYYY-MM-DD')`,
      leads: count(),
      won: sql<number>`sum(case when ${leads.status} = 'WON' then 1 else 0 end)`,
    })
    .from(leads)
    .where(gte(leads.createdAt, since))
    .groupBy(sql`date_trunc('week', ${leads.createdAt})`)
    .orderBy(sql`date_trunc('week', ${leads.createdAt})`);

  const byWeek = new Map(rows.map((r) => [r.week, r]));
  const out: WeekPoint[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  const day = (cursor.getDay() + 6) % 7;
  cursor.setDate(cursor.getDate() - day);
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(cursor);
    d.setDate(d.getDate() - i * 7);
    const key = d.toISOString().slice(0, 10);
    const r = byWeek.get(key);
    out.push({ week: key, leads: Number(r?.leads ?? 0), won: Number(r?.won ?? 0) });
  }
  return out;
}

export interface BreakdownItem {
  key: string;
  value: number;
}

export async function getSourceBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db.select({ key: leads.source, value: count() }).from(leads).groupBy(leads.source).orderBy(desc(count()));
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getUtmSourceBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: sql<string>`coalesce(${leads.utmSource}, 'directo')`, value: count() })
    .from(leads)
    .groupBy(sql`coalesce(${leads.utmSource}, 'directo')`)
    .orderBy(desc(count()));
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getServiceBreakdown(limit = 10): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: sql<string>`coalesce(${leads.serviceSlug}, 'sin-servicio')`, value: count() })
    .from(leads)
    .groupBy(sql`coalesce(${leads.serviceSlug}, 'sin-servicio')`)
    .orderBy(desc(count()))
    .limit(limit);
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getSourcePageBreakdown(limit = 10): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: sql<string>`coalesce(${leads.sourcePage}, '(desconocida)')`, value: count() })
    .from(leads)
    .groupBy(sql`coalesce(${leads.sourcePage}, '(desconocida)')`)
    .orderBy(desc(count()))
    .limit(limit);
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getArticleLeadBreakdown(limit = 10): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: leads.articleSlug, value: count() })
    .from(leads)
    .where(sql`${leads.articleSlug} is not null`)
    .groupBy(leads.articleSlug)
    .orderBy(desc(count()))
    .limit(limit);
  return rows.map((r) => ({ key: r.key ?? "", value: Number(r.value) }));
}

export async function getTopPages(days = 30, limit = 10): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: sql<string>`coalesce(${leadEvents.page}, '/')`, value: count() })
    .from(leadEvents)
    .where(and(eq(leadEvents.eventType, "page_view"), gte(leadEvents.createdAt, daysAgo(days))))
    .groupBy(sql`coalesce(${leadEvents.page}, '/')`)
    .orderBy(desc(count()))
    .limit(limit);
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getEventTypeCounts(days = 30): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: leadEvents.eventType, value: count() })
    .from(leadEvents)
    .where(gte(leadEvents.createdAt, daysAgo(days)))
    .groupBy(leadEvents.eventType)
    .orderBy(desc(count()));
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function countUnassignedNew(): Promise<number> {
  const db = requireDb();
  const rows = await db
    .select({ value: count() })
    .from(leads)
    .where(and(eq(leads.status, "NEW"), isNull(leads.assignedTo)));
  return Number(rows[0]?.value ?? 0);
}
