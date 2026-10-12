import "server-only";

import { and, asc, count, desc, eq, gte, ilike, isNull, lte, or, sql, type SQL } from "drizzle-orm";

import { getDb, requireDb } from "@/db/client";
import {
  consentRecords,
  followUps,
  leadActivities,
  leadAttachments,
  leadEvents,
  leads,
  users,
  type Lead,
  type NewLead,
} from "@/db/schema";
import type { LeadsFilter } from "@/lib/validation/admin";
import type { ActivityType, LeadStatus } from "@/types/lead";

export interface CreateLeadInput {
  lead: Omit<NewLead, "id" | "createdAt" | "updatedAt">;
  consent: { analytics: boolean; marketing: boolean; version: number; source: string };
}

/**
 * Inserta el lead, su actividad inicial, el registro de consentimiento y el
 * evento `lead_created`. neon-http no soporta transacciones interactivas, así
 * que las escrituras secundarias van en un `batch` tras obtener el id.
 * Devuelve `null` si no hay base de datos.
 */
export async function createLead(input: CreateLeadInput): Promise<Lead | null> {
  const db = getDb();
  if (!db) return null;

  const [lead] = await db.insert(leads).values(input.lead).returning();
  if (!lead) return null;

  await db.batch([
    db.insert(leadActivities).values({
      leadId: lead.id,
      type: "system",
      payload: { event: "created", source: lead.source, formVariant: lead.formVariant ?? "general", articleSlug: lead.articleSlug ?? null },
    }),
    db.insert(consentRecords).values({
      leadId: lead.id,
      visitorId: lead.visitorId,
      necessary: true,
      analytics: input.consent.analytics,
      marketing: input.consent.marketing,
      version: input.consent.version,
      source: input.consent.source,
      ipHash: lead.ipHash,
      userAgent: lead.userAgent,
    }),
    db.insert(leadEvents).values({
      leadId: lead.id,
      visitorId: lead.visitorId,
      eventType: "lead_created",
      page: lead.sourcePage,
      metadata: { source: lead.source, serviceSlug: lead.serviceSlug ?? null, articleSlug: lead.articleSlug ?? null },
    }),
    ...(lead.visitorId
      ? [
          db
            .update(leadEvents)
            .set({ leadId: lead.id })
            .where(and(eq(leadEvents.visitorId, lead.visitorId), isNull(leadEvents.leadId))),
        ]
      : []),
  ]);

  return lead;
}

export async function addAttachment(input: {
  leadId: string;
  storageKey: string;
  filename: string;
  mime: string;
  sizeBytes: number;
}) {
  const db = getDb();
  if (!db) return null;
  const [row] = await db.insert(leadAttachments).values({ ...input, uploadedByLead: true }).returning();
  return row ?? null;
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

const SORT_COLUMNS = {
  createdAt: leads.createdAt,
  name: leads.name,
  status: leads.status,
  source: leads.source,
  nextFollowUpAt: leads.nextFollowUpAt,
} as const;

export function buildLeadsWhere(filter: Partial<LeadsFilter>): SQL | undefined {
  const conditions: SQL[] = [];
  if (filter.q) {
    const term = `%${filter.q}%`;
    conditions.push(or(ilike(leads.name, term), ilike(leads.email, term), ilike(leads.phone, term), ilike(leads.locality, term))!);
  }
  if (filter.status && filter.status !== "ALL") conditions.push(eq(leads.status, filter.status));
  if (filter.source && filter.source !== "ALL") conditions.push(eq(leads.source, filter.source));
  if (filter.service) conditions.push(eq(leads.serviceSlug, filter.service));
  if (filter.assigned === "none") conditions.push(isNull(leads.assignedTo));
  else if (filter.assigned && filter.assigned !== "ALL") conditions.push(eq(leads.assignedTo, filter.assigned));
  if (filter.from) conditions.push(gte(leads.createdAt, new Date(filter.from)));
  if (filter.to) {
    const to = new Date(filter.to);
    to.setDate(to.getDate() + 1);
    conditions.push(lte(leads.createdAt, to));
  }
  if (filter.article) conditions.push(eq(leads.articleSlug, filter.article));
  return conditions.length ? and(...conditions) : undefined;
}

export interface LeadListItem extends Lead {
  assigneeName: string | null;
}

export interface LeadsPage {
  items: LeadListItem[];
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

  const [rows, totalRows] = await Promise.all([
    db
      .select({ lead: leads, assigneeName: users.name })
      .from(leads)
      .leftJoin(users, eq(leads.assignedTo, users.id))
      .where(where)
      .orderBy(orderBy, desc(leads.createdAt))
      .limit(filter.pageSize)
      .offset(offset),
    db.select({ value: count() }).from(leads).where(where),
  ]);
  const total = Number(totalRows[0]?.value ?? 0);
  return {
    items: rows.map((r) => ({ ...r.lead, assigneeName: r.assigneeName ?? null })),
    total,
    page: filter.page,
    pageSize: filter.pageSize,
    pageCount: Math.max(1, Math.ceil(total / filter.pageSize)),
  };
}

export async function countLeads(filter: Partial<LeadsFilter>): Promise<number> {
  const db = requireDb();
  const rows = await db.select({ value: count() }).from(leads).where(buildLeadsWhere(filter));
  return Number(rows[0]?.value ?? 0);
}

/** Exportación CSV: hasta 5000 filas con el mismo filtro del listado. */
export async function listAllLeads(filter: LeadsFilter, limit = 5000): Promise<LeadListItem[]> {
  const db = requireDb();
  const rows = await db
    .select({ lead: leads, assigneeName: users.name })
    .from(leads)
    .leftJoin(users, eq(leads.assignedTo, users.id))
    .where(buildLeadsWhere(filter))
    .orderBy(desc(leads.createdAt))
    .limit(limit);
  return rows.map((r) => ({ ...r.lead, assigneeName: r.assigneeName ?? null }));
}

export interface LeadDetail {
  lead: Lead;
  assignee: { id: string; name: string; email: string } | null;
  activities: (typeof leadActivities.$inferSelect & { userName: string | null })[];
  attachments: (typeof leadAttachments.$inferSelect)[];
  followUps: (typeof followUps.$inferSelect & { assigneeName: string | null })[];
  events: (typeof leadEvents.$inferSelect)[];
}

export async function getLeadDetail(id: string): Promise<LeadDetail | null> {
  const db = requireDb();
  const lead = await db.query.leads.findFirst({ where: eq(leads.id, id) });
  if (!lead) return null;
  const [assignee, activities, attachments, tasks, events] = await Promise.all([
    lead.assignedTo
      ? db.query.users.findFirst({ where: eq(users.id, lead.assignedTo), columns: { id: true, name: true, email: true } })
      : Promise.resolve(undefined),
    db
      .select({ activity: leadActivities, userName: users.name })
      .from(leadActivities)
      .leftJoin(users, eq(leadActivities.userId, users.id))
      .where(eq(leadActivities.leadId, id))
      .orderBy(desc(leadActivities.createdAt))
      .limit(200),
    db.select().from(leadAttachments).where(eq(leadAttachments.leadId, id)).orderBy(asc(leadAttachments.createdAt)),
    db
      .select({ followUp: followUps, assigneeName: users.name })
      .from(followUps)
      .leftJoin(users, eq(followUps.assignedTo, users.id))
      .where(eq(followUps.leadId, id))
      .orderBy(asc(followUps.done), asc(followUps.dueAt)),
    db.select().from(leadEvents).where(eq(leadEvents.leadId, id)).orderBy(desc(leadEvents.createdAt)).limit(100),
  ]);
  return {
    lead,
    assignee: assignee ?? null,
    activities: activities.map((a) => ({ ...a.activity, userName: a.userName ?? null })),
    attachments,
    followUps: tasks.map((t) => ({ ...t.followUp, assigneeName: t.assigneeName ?? null })),
    events,
  };
}

export async function updateLeadStatus(id: string, status: LeadStatus, userId: string | null): Promise<Lead | null> {
  const db = requireDb();
  const current = await db.query.leads.findFirst({ where: eq(leads.id, id), columns: { status: true } });
  if (!current) return null;
  const [row] = await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
  if (row) {
    await db.insert(leadActivities).values({ leadId: id, userId, type: "status_change", payload: { from: current.status, to: status } });
  }
  return row ?? null;
}

export async function assignLead(id: string, assignedTo: string | null, userId: string | null): Promise<Lead | null> {
  const db = requireDb();
  const [row] = await db.update(leads).set({ assignedTo, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
  if (row) await db.insert(leadActivities).values({ leadId: id, userId, type: "assignment", payload: { assignedTo } });
  return row ?? null;
}

export async function updateInternalNotes(id: string, notes: string) {
  const db = requireDb();
  await db.update(leads).set({ internalNotes: notes, updatedAt: new Date() }).where(eq(leads.id, id));
}

export async function addActivity(id: string, userId: string | null, type: ActivityType, payload: Record<string, unknown>) {
  const db = requireDb();
  const [row] = await db.insert(leadActivities).values({ leadId: id, userId, type, payload }).returning();
  return row ?? null;
}

export async function deleteActivity(activityId: string, leadId: string) {
  const db = requireDb();
  await db.delete(leadActivities).where(and(eq(leadActivities.id, activityId), eq(leadActivities.leadId, leadId)));
}

export async function createFollowUp(input: { leadId: string; title: string; dueAt: Date; assignedTo: string | null; createdBy: string | null }) {
  const db = requireDb();
  const [row] = await db.insert(followUps).values(input).returning();
  await db.update(leads).set({ nextFollowUpAt: input.dueAt, updatedAt: new Date() }).where(eq(leads.id, input.leadId));
  return row ?? null;
}

export async function toggleFollowUp(id: string, done: boolean) {
  const db = requireDb();
  const [row] = await db
    .update(followUps)
    .set({ done, doneAt: done ? new Date() : null })
    .where(eq(followUps.id, id))
    .returning();
  if (row) {
    // Recalcula la próxima tarea pendiente del lead.
    const next = await db.query.followUps.findFirst({
      where: and(eq(followUps.leadId, row.leadId), eq(followUps.done, false)),
      orderBy: asc(followUps.dueAt),
    });
    await db.update(leads).set({ nextFollowUpAt: next?.dueAt ?? null }).where(eq(leads.id, row.leadId));
  }
  return row ?? null;
}

export async function listPendingFollowUps(limit = 50) {
  const db = requireDb();
  return db
    .select({ followUp: followUps, leadName: leads.name, leadId: leads.id, assigneeName: users.name })
    .from(followUps)
    .innerJoin(leads, eq(followUps.leadId, leads.id))
    .leftJoin(users, eq(followUps.assignedTo, users.id))
    .where(eq(followUps.done, false))
    .orderBy(asc(followUps.dueAt))
    .limit(limit);
}

/** Borra definitivamente un lead: cascada en actividades, adjuntos y tareas; los eventos quedan anonimizados (lead_id = NULL). */
export async function deleteLead(id: string): Promise<boolean> {
  const db = requireDb();
  const rows = await db.delete(leads).where(eq(leads.id, id)).returning({ id: leads.id });
  return rows.length > 0;
}

export async function listAttachmentById(attachmentId: string) {
  const db = requireDb();
  return db.query.leadAttachments.findFirst({ where: eq(leadAttachments.id, attachmentId) });
}

/** Leads por artículo de origen (para el panel de blog). */
export async function countLeadsByArticle(): Promise<Record<string, number>> {
  const db = requireDb();
  const rows = await db
    .select({ slug: leads.articleSlug, value: count() })
    .from(leads)
    .where(sql`${leads.articleSlug} is not null`)
    .groupBy(leads.articleSlug);
  return Object.fromEntries(rows.map((r) => [r.slug ?? "", Number(r.value)]));
}
