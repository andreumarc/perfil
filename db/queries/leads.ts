import "server-only";

import { randomBytes } from "node:crypto";

import { and, asc, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";

import { getDb, requireDb } from "@/db/client";
import {
  diagnosticAnswers,
  diagnosticResults,
  leadEvents,
  leadNotes,
  leads,
  type Lead,
  type NewLead,
} from "@/db/schema";
import type { DiagnosticAnswers, DiagnosticResult } from "@/lib/diagnostic/calculate";
import { pointsForAnswer } from "@/lib/diagnostic/calculate";
import type { LeadsFilter } from "@/lib/validation/admin";
import type { LeadStatus } from "@/types/lead";

export function generateResultToken(): string {
  return randomBytes(24).toString("base64url");
}

export interface CreateLeadInput {
  lead: Omit<NewLead, "id" | "createdAt" | "updatedAt">;
  answers?: DiagnosticAnswers;
  result?: DiagnosticResult;
}

/**
 * Inserta el lead y, si procede, sus respuestas y resultado del diagnóstico.
 * Devuelve `null` si no hay base de datos (la app sigue funcionando).
 */
export async function createLead(input: CreateLeadInput): Promise<Lead | null> {
  const db = getDb();
  if (!db) return null;

  const [lead] = await db.insert(leads).values(input.lead).returning();
  if (!lead) return null;

  if (input.answers && Object.keys(input.answers).length > 0) {
    await db.insert(diagnosticAnswers).values(
      Object.entries(input.answers).map(([questionId, answer]) => ({
        leadId: lead.id,
        questionId,
        answer,
        points: pointsForAnswer(questionId, answer),
      })),
    );
  }

  if (input.result) {
    const r = input.result;
    await db.insert(diagnosticResults).values({
      leadId: lead.id,
      totalScore: r.totalScore,
      financeScore: r.scores.finance,
      operationsScore: r.scores.operations,
      peopleScore: r.scores.people,
      dataScore: r.scores.data,
      scalabilityScore: r.scores.scalability,
      resultLevel: r.level,
      recommendations: r.recommendations,
    });
  }

  await db.insert(leadEvents).values({
    leadId: lead.id,
    visitorId: lead.visitorId,
    eventType: "lead_created",
    page: lead.landingPage,
    metadata: { source: lead.source, score: lead.score, level: lead.leadLevel },
  });

  // Vincula eventos anónimos previos del mismo visitante al lead.
  if (lead.visitorId) {
    await db
      .update(leadEvents)
      .set({ leadId: lead.id })
      .where(and(eq(leadEvents.visitorId, lead.visitorId), sql`${leadEvents.leadId} IS NULL`));
  }

  return lead;
}

export async function findRecentLeadByEmail(email: string, withinHours = 24): Promise<Lead | null> {
  const db = getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(leads)
    .where(
      and(
        eq(leads.email, email.toLowerCase()),
        sql`${leads.createdAt} > now() - ${`${withinHours} hours`}::interval`,
      ),
    )
    .orderBy(desc(leads.createdAt))
    .limit(1);
  return rows[0] ?? null;
}

export interface LeadResultView {
  lead: Lead;
  result: typeof diagnosticResults.$inferSelect | null;
  answers: (typeof diagnosticAnswers.$inferSelect)[];
}

export async function getLeadByResultToken(token: string): Promise<LeadResultView | null> {
  const db = getDb();
  if (!db || !token || token.length > 64) return null;
  const lead = await db.query.leads.findFirst({ where: eq(leads.resultToken, token) });
  if (!lead) return null;
  const [result, answers] = await Promise.all([
    db.query.diagnosticResults.findFirst({
      where: eq(diagnosticResults.leadId, lead.id),
      orderBy: desc(diagnosticResults.createdAt),
    }),
    db.query.diagnosticAnswers.findMany({ where: eq(diagnosticAnswers.leadId, lead.id) }),
  ]);
  return { lead, result: result ?? null, answers };
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

const SORT_COLUMNS = {
  createdAt: leads.createdAt,
  score: leads.score,
  company: leads.company,
  status: leads.status,
  numberLocations: leads.numberLocations,
  companyRevenue: leads.companyRevenue,
} as const;

export function buildLeadsWhere(filter: Partial<LeadsFilter>): SQL | undefined {
  const conditions: SQL[] = [];
  if (filter.q) {
    const term = `%${filter.q}%`;
    conditions.push(
      or(
        ilike(leads.company, term),
        ilike(leads.firstName, term),
        ilike(leads.lastName, term),
        ilike(leads.email, term),
      )!,
    );
  }
  if (filter.status && filter.status !== "ALL") conditions.push(eq(leads.status, filter.status));
  if (filter.level && filter.level !== "ALL") conditions.push(eq(leads.leadLevel, filter.level));
  if (filter.source) {
    conditions.push(
      or(eq(leads.utmSource, filter.source), sql`${leads.source}::text = ${filter.source}`)!,
    );
  }
  if (filter.sector) conditions.push(eq(leads.sector, filter.sector));
  if (filter.hot === "1") conditions.push(eq(leads.isHot, true));
  return conditions.length ? and(...conditions) : undefined;
}

export interface LeadsPage {
  items: Lead[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export async function listLeads(filter: LeadsFilter): Promise<LeadsPage> {
  const db = requireDb();
  const where = buildLeadsWhere(filter);
  const sortColumn = SORT_COLUMNS[filter.sort] ?? leads.createdAt;
  const orderBy = filter.dir === "asc" ? asc(sortColumn) : desc(sortColumn);
  const offset = (filter.page - 1) * filter.pageSize;

  const [items, totalRows] = await Promise.all([
    db.select().from(leads).where(where).orderBy(orderBy, desc(leads.createdAt)).limit(filter.pageSize).offset(offset),
    db.select({ value: count() }).from(leads).where(where),
  ]);
  const total = Number(totalRows[0]?.value ?? 0);
  return {
    items,
    total,
    page: filter.page,
    pageSize: filter.pageSize,
    pageCount: Math.max(1, Math.ceil(total / filter.pageSize)),
  };
}

/** Número de leads que cumplen el filtro (sin traer filas). */
export async function countLeads(filter: Partial<LeadsFilter>): Promise<number> {
  const db = requireDb();
  const rows = await db.select({ value: count() }).from(leads).where(buildLeadsWhere(filter));
  return Number(rows[0]?.value ?? 0);
}

/** Todos los leads que cumplen el filtro (para exportación CSV). */
export async function listAllLeads(filter: Partial<LeadsFilter>): Promise<Lead[]> {
  const db = requireDb();
  return db.select().from(leads).where(buildLeadsWhere(filter)).orderBy(desc(leads.createdAt)).limit(5000);
}

export interface LeadDetail {
  lead: Lead;
  result: typeof diagnosticResults.$inferSelect | null;
  answers: (typeof diagnosticAnswers.$inferSelect)[];
  events: (typeof leadEvents.$inferSelect)[];
  notes: (typeof leadNotes.$inferSelect)[];
}

export async function getLeadDetail(id: string): Promise<LeadDetail | null> {
  const db = requireDb();
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, id) });
  if (!lead) return null;
  const [result, answers, events, notes] = await Promise.all([
    db.query.diagnosticResults.findFirst({
      where: eq(diagnosticResults.leadId, id),
      orderBy: desc(diagnosticResults.createdAt),
    }),
    db.query.diagnosticAnswers.findMany({ where: eq(diagnosticAnswers.leadId, id) }),
    db.query.leadEvents.findMany({
      where: eq(leadEvents.leadId, id),
      orderBy: desc(leadEvents.createdAt),
      limit: 100,
    }),
    db.query.leadNotes.findMany({ where: eq(leadNotes.leadId, id), orderBy: desc(leadNotes.createdAt) }),
  ]);
  return { lead, result: result ?? null, answers, events, notes };
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | null> {
  const db = requireDb();
  const [row] = await db
    .update(leads)
    .set({ status, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .returning();
  return row ?? null;
}

export async function updateLeadNotes(id: string, notes: string): Promise<Lead | null> {
  const db = requireDb();
  const [row] = await db
    .update(leads)
    .set({ notes: notes || null, updatedAt: new Date() })
    .where(eq(leads.id, id))
    .returning();
  return row ?? null;
}

export async function addLeadNote(id: string, note: string, author?: string) {
  const db = requireDb();
  const [row] = await db.insert(leadNotes).values({ leadId: id, note, author }).returning();
  await db.update(leads).set({ updatedAt: new Date() }).where(eq(leads.id, id));
  return row ?? null;
}

export async function deleteLeadNote(noteId: string) {
  const db = requireDb();
  await db.delete(leadNotes).where(eq(leadNotes.id, noteId));
}
