import "server-only";

import { and, count, countDistinct, desc, eq, gte, sql } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { diagnosticResults, leadEvents, leads } from "@/db/schema";

export interface OverviewStats {
  totalLeads: number;
  leads7d: number;
  leads30d: number;
  hotLeads: number;
  avgScore: number;
  meetings: number;
  won: number;
  diagnosticsStarted30d: number;
  diagnosticsCompleted30d: number;
  diagnosticLeads30d: number;
  /** % de diagnósticos iniciados (30 d) que acaban en lead. */
  diagnosticConversion: number;
  visitors30d: number;
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const db = requireDb();
  const d7 = daysAgo(7);
  const d30 = daysAgo(30);

  const [totals, l7, l30, hot, avg, meetings, won, started, completed, diagLeads, visitors] =
    await Promise.all([
      db.select({ value: count() }).from(leads),
      db.select({ value: count() }).from(leads).where(gte(leads.createdAt, d7)),
      db.select({ value: count() }).from(leads).where(gte(leads.createdAt, d30)),
      db.select({ value: count() }).from(leads).where(eq(leads.isHot, true)),
      db.select({ value: sql<number>`coalesce(avg(${leads.score}), 0)` }).from(leads),
      db
        .select({ value: count() })
        .from(leads)
        .where(sql`${leads.status} in ('MEETING', 'PROPOSAL', 'WON')`),
      db.select({ value: count() }).from(leads).where(eq(leads.status, "WON")),
      db
        .select({ value: count() })
        .from(leadEvents)
        .where(and(eq(leadEvents.eventType, "diagnostic_started"), gte(leadEvents.createdAt, d30))),
      db
        .select({ value: count() })
        .from(leadEvents)
        .where(and(eq(leadEvents.eventType, "diagnostic_completed"), gte(leadEvents.createdAt, d30))),
      db
        .select({ value: count() })
        .from(leads)
        .where(and(gte(leads.createdAt, d30), sql`${leads.source} in ('diagnostic', 'linkedin')`)),
      db
        .select({ value: countDistinct(leadEvents.visitorId) })
        .from(leadEvents)
        .where(and(eq(leadEvents.eventType, "page_view"), gte(leadEvents.createdAt, d30))),
    ]);

  const startedN = Number(started[0]?.value ?? 0);
  const completedN = Number(completed[0]?.value ?? 0);
  const diagLeadsN = Number(diagLeads[0]?.value ?? 0);

  return {
    totalLeads: Number(totals[0]?.value ?? 0),
    leads7d: Number(l7[0]?.value ?? 0),
    leads30d: Number(l30[0]?.value ?? 0),
    hotLeads: Number(hot[0]?.value ?? 0),
    avgScore: Math.round(Number(avg[0]?.value ?? 0)),
    meetings: Number(meetings[0]?.value ?? 0),
    won: Number(won[0]?.value ?? 0),
    diagnosticsStarted30d: startedN,
    diagnosticsCompleted30d: completedN,
    diagnosticLeads30d: diagLeadsN,
    diagnosticConversion: startedN > 0 ? Math.round((diagLeadsN / startedN) * 100) : 0,
    visitors30d: Number(visitors[0]?.value ?? 0),
  };
}

export interface WeekPoint {
  week: string;
  leads: number;
  hot: number;
}

export async function getLeadsPerWeek(weeks = 12): Promise<WeekPoint[]> {
  const db = requireDb();
  const since = daysAgo(weeks * 7);
  const rows = await db
    .select({
      week: sql<string>`to_char(date_trunc('week', ${leads.createdAt}), 'YYYY-MM-DD')`,
      leads: count(),
      hot: sql<number>`sum(case when ${leads.isHot} then 1 else 0 end)`,
    })
    .from(leads)
    .where(gte(leads.createdAt, since))
    .groupBy(sql`date_trunc('week', ${leads.createdAt})`)
    .orderBy(sql`date_trunc('week', ${leads.createdAt})`);

  // Rellena semanas sin leads para que el gráfico sea continuo.
  const byWeek = new Map(rows.map((r) => [r.week, r]));
  const out: WeekPoint[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  // Lunes de la semana actual
  const day = (cursor.getDay() + 6) % 7;
  cursor.setDate(cursor.getDate() - day);
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(cursor);
    d.setDate(d.getDate() - i * 7);
    const key = d.toISOString().slice(0, 10);
    const r = byWeek.get(key);
    out.push({ week: key, leads: Number(r?.leads ?? 0), hot: Number(r?.hot ?? 0) });
  }
  return out;
}

export interface BreakdownItem {
  key: string;
  value: number;
}

export async function getSourceBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: sql<string>`coalesce(${leads.utmSource}, 'directo')`, value: count() })
    .from(leads)
    .groupBy(sql`coalesce(${leads.utmSource}, 'directo')`)
    .orderBy(desc(count()));
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getFormSourceBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: leads.source, value: count() })
    .from(leads)
    .groupBy(leads.source)
    .orderBy(desc(count()));
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getSectorBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: sql<string>`coalesce(${leads.sector}, 'otros')`, value: count() })
    .from(leads)
    .groupBy(sql`coalesce(${leads.sector}, 'otros')`)
    .orderBy(desc(count()));
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getRevenueBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: sql<string>`coalesce(${leads.companyRevenue}, 'n/d')`, value: count() })
    .from(leads)
    .groupBy(sql`coalesce(${leads.companyRevenue}, 'n/d')`);
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getLocationsBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: sql<string>`coalesce(${leads.numberLocations}, 'n/d')`, value: count() })
    .from(leads)
    .groupBy(sql`coalesce(${leads.numberLocations}, 'n/d')`);
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getStatusBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db.select({ key: leads.status, value: count() }).from(leads).groupBy(leads.status);
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getLevelBreakdown(): Promise<BreakdownItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ key: leads.leadLevel, value: count() })
    .from(leads)
    .groupBy(leads.leadLevel);
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export interface FunnelStep {
  key: "visitors" | "diagnostic_started" | "diagnostic_completed" | "leads" | "meetings";
  label: string;
  value: number;
}

export async function getFunnel(days = 30): Promise<FunnelStep[]> {
  const db = requireDb();
  const since = daysAgo(days);
  const [visitors, started, completed, leadsN, meetings] = await Promise.all([
    db
      .select({ value: countDistinct(leadEvents.visitorId) })
      .from(leadEvents)
      .where(and(eq(leadEvents.eventType, "page_view"), gte(leadEvents.createdAt, since))),
    db
      .select({ value: count() })
      .from(leadEvents)
      .where(and(eq(leadEvents.eventType, "diagnostic_started"), gte(leadEvents.createdAt, since))),
    db
      .select({ value: count() })
      .from(leadEvents)
      .where(and(eq(leadEvents.eventType, "diagnostic_completed"), gte(leadEvents.createdAt, since))),
    db.select({ value: count() }).from(leads).where(gte(leads.createdAt, since)),
    db
      .select({ value: count() })
      .from(leads)
      .where(and(gte(leads.createdAt, since), sql`${leads.status} in ('MEETING', 'PROPOSAL', 'WON')`)),
  ]);
  return [
    { key: "visitors", label: "Visitantes", value: Number(visitors[0]?.value ?? 0) },
    { key: "diagnostic_started", label: "Diagnósticos iniciados", value: Number(started[0]?.value ?? 0) },
    { key: "diagnostic_completed", label: "Diagnósticos completados", value: Number(completed[0]?.value ?? 0) },
    { key: "leads", label: "Leads", value: Number(leadsN[0]?.value ?? 0) },
    { key: "meetings", label: "Reuniones", value: Number(meetings[0]?.value ?? 0) },
  ];
}

export interface DayPoint {
  day: string;
  pageViews: number;
  diagnosticsStarted: number;
  leads: number;
}

export async function getEventsByDay(days = 30): Promise<DayPoint[]> {
  const db = requireDb();
  const since = daysAgo(days);
  const rows = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${leadEvents.createdAt}), 'YYYY-MM-DD')`,
      pageViews: sql<number>`sum(case when ${leadEvents.eventType} = 'page_view' then 1 else 0 end)`,
      diagnosticsStarted: sql<number>`sum(case when ${leadEvents.eventType} = 'diagnostic_started' then 1 else 0 end)`,
      leads: sql<number>`sum(case when ${leadEvents.eventType} = 'lead_created' then 1 else 0 end)`,
    })
    .from(leadEvents)
    .where(gte(leadEvents.createdAt, since))
    .groupBy(sql`date_trunc('day', ${leadEvents.createdAt})`)
    .orderBy(sql`date_trunc('day', ${leadEvents.createdAt})`);

  const byDay = new Map(rows.map((r) => [r.day, r]));
  const out: DayPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    const r = byDay.get(key);
    out.push({
      day: key,
      pageViews: Number(r?.pageViews ?? 0),
      diagnosticsStarted: Number(r?.diagnosticsStarted ?? 0),
      leads: Number(r?.leads ?? 0),
    });
  }
  return out;
}

export async function getEventTypeCounts(days = 30): Promise<BreakdownItem[]> {
  const db = requireDb();
  const since = daysAgo(days);
  const rows = await db
    .select({ key: leadEvents.eventType, value: count() })
    .from(leadEvents)
    .where(gte(leadEvents.createdAt, since))
    .groupBy(leadEvents.eventType)
    .orderBy(desc(count()));
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export async function getTopPages(days = 30, limit = 10): Promise<BreakdownItem[]> {
  const db = requireDb();
  const since = daysAgo(days);
  const rows = await db
    .select({ key: sql<string>`coalesce(${leadEvents.page}, '/')`, value: count() })
    .from(leadEvents)
    .where(and(eq(leadEvents.eventType, "page_view"), gte(leadEvents.createdAt, since)))
    .groupBy(sql`coalesce(${leadEvents.page}, '/')`)
    .orderBy(desc(count()))
    .limit(limit);
  return rows.map((r) => ({ key: r.key, value: Number(r.value) }));
}

export interface DiagnosticStats {
  total: number;
  avgTotal: number;
  avgFinance: number;
  avgOperations: number;
  avgPeople: number;
  avgData: number;
  avgScalability: number;
  levels: BreakdownItem[];
}

export async function getDiagnosticStats(): Promise<DiagnosticStats> {
  const db = requireDb();
  const [agg] = await db
    .select({
      total: count(),
      avgTotal: sql<number>`coalesce(avg(${diagnosticResults.totalScore}), 0)`,
      avgFinance: sql<number>`coalesce(avg(${diagnosticResults.financeScore}), 0)`,
      avgOperations: sql<number>`coalesce(avg(${diagnosticResults.operationsScore}), 0)`,
      avgPeople: sql<number>`coalesce(avg(${diagnosticResults.peopleScore}), 0)`,
      avgData: sql<number>`coalesce(avg(${diagnosticResults.dataScore}), 0)`,
      avgScalability: sql<number>`coalesce(avg(${diagnosticResults.scalabilityScore}), 0)`,
    })
    .from(diagnosticResults);
  const levels = await db
    .select({ key: diagnosticResults.resultLevel, value: count() })
    .from(diagnosticResults)
    .groupBy(diagnosticResults.resultLevel);
  return {
    total: Number(agg?.total ?? 0),
    avgTotal: Math.round(Number(agg?.avgTotal ?? 0)),
    avgFinance: Math.round(Number(agg?.avgFinance ?? 0)),
    avgOperations: Math.round(Number(agg?.avgOperations ?? 0)),
    avgPeople: Math.round(Number(agg?.avgPeople ?? 0)),
    avgData: Math.round(Number(agg?.avgData ?? 0)),
    avgScalability: Math.round(Number(agg?.avgScalability ?? 0)),
    levels: levels.map((r) => ({ key: r.key, value: Number(r.value) })),
  };
}

export interface DiagnosticRow {
  id: string;
  createdAt: Date;
  totalScore: number;
  financeScore: number;
  operationsScore: number;
  peopleScore: number;
  dataScore: number;
  scalabilityScore: number;
  resultLevel: string;
  leadId: string;
  company: string;
  firstName: string;
  lastName: string;
  score: number;
  isHot: boolean;
  sector: string | null;
  numberLocations: string | null;
}

export async function listDiagnostics(limit = 100): Promise<DiagnosticRow[]> {
  const db = requireDb();
  return db
    .select({
      id: diagnosticResults.id,
      createdAt: diagnosticResults.createdAt,
      totalScore: diagnosticResults.totalScore,
      financeScore: diagnosticResults.financeScore,
      operationsScore: diagnosticResults.operationsScore,
      peopleScore: diagnosticResults.peopleScore,
      dataScore: diagnosticResults.dataScore,
      scalabilityScore: diagnosticResults.scalabilityScore,
      resultLevel: diagnosticResults.resultLevel,
      leadId: leads.id,
      company: leads.company,
      firstName: leads.firstName,
      lastName: leads.lastName,
      score: leads.score,
      isHot: leads.isHot,
      sector: leads.sector,
      numberLocations: leads.numberLocations,
    })
    .from(diagnosticResults)
    .innerJoin(leads, eq(diagnosticResults.leadId, leads.id))
    .orderBy(desc(diagnosticResults.createdAt))
    .limit(limit);
}
