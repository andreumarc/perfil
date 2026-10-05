import { and, eq, isNull, sql } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { diagnosticAnswers, diagnosticResults, leadEvents, leadNotes, leads, rateLimits } from "@/db/schema";
import { LEAD_STATUSES } from "@/types/lead";

import { createTestDb, loadMigrationStatements, type TestClient, type TestDb } from "./helpers/pglite";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const BASE_LEAD = {
  firstName: "Marc",
  lastName: "Andreu",
  company: "Grupo Dental Norte",
  jobTitle: "ceo",
  email: "marc@grupodentalnorte.com",
} as const;

let client: TestClient;
let db: TestDb;

/**
 * Drizzle envuelve los errores del driver en DrizzleQueryError ("Failed query: …")
 * y deja el error original de Postgres en `cause`. Comprobamos el mensaje real.
 */
async function expectDbError(promise: Promise<unknown>, pattern: RegExp) {
  let caught: unknown;
  try {
    await promise;
  } catch (err) {
    caught = err;
  }
  expect(caught, "se esperaba que la consulta fallase").toBeInstanceOf(Error);
  const error = caught as Error & { cause?: unknown };
  const cause = error.cause instanceof Error ? error.cause.message : String(error.cause ?? "");
  expect(`${error.message}\n${cause}`).toMatch(pattern);
}

async function insertLead(overrides: Partial<typeof leads.$inferInsert> = {}) {
  const [row] = await db
    .insert(leads)
    .values({ ...BASE_LEAD, ...overrides })
    .returning();
  return row;
}

beforeAll(async () => {
  ({ client, db } = await createTestDb());
});

afterAll(async () => {
  await client?.close();
});

describe("migración 0000_init.sql en PGlite", () => {
  it("se divide en sentencias y crea las 6 tablas y los 3 enums", async () => {
    const statements = loadMigrationStatements();
    expect(statements.length).toBeGreaterThan(20);
    expect(statements.every((s) => !s.includes("statement-breakpoint"))).toBe(true);

    const tables = await client.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
    );
    expect(tables.rows.map((r) => r.table_name)).toEqual([
      "diagnostic_answers",
      "diagnostic_results",
      "lead_events",
      "lead_notes",
      "leads",
      "rate_limits",
    ]);

    const enums = await client.query<{ typname: string }>(
      "select typname from pg_type where typtype = 'e' order by typname",
    );
    expect(enums.rows.map((r) => r.typname)).toEqual(["lead_level", "lead_source", "lead_status"]);
  });

  it("gen_random_uuid() está disponible en PGlite", async () => {
    const r = await client.query<{ id: string }>("select gen_random_uuid()::text as id");
    expect(r.rows[0].id).toMatch(UUID_RE);
  });
});

describe("leads", () => {
  it("inserta un lead con los campos obligatorios y lo lee con sus defaults", async () => {
    const inserted = await insertLead();
    expect(inserted.id).toMatch(UUID_RE);
    expect(inserted.createdAt).toBeInstanceOf(Date);
    expect(inserted.updatedAt).toBeInstanceOf(Date);

    const [read] = await db.select().from(leads).where(eq(leads.id, inserted.id));
    expect(read).toBeDefined();
    expect(read.firstName).toBe("Marc");
    expect(read.lastName).toBe("Andreu");
    expect(read.company).toBe("Grupo Dental Norte");
    expect(read.jobTitle).toBe("ceo");
    expect(read.email).toBe("marc@grupodentalnorte.com");
    expect(read.phone).toBeNull();
    expect(read.score).toBe(0);
    expect(read.leadLevel).toBe("low");
    expect(read.isHot).toBe(false);
    expect(read.status).toBe("NEW");
    expect(read.source).toBe("diagnostic");
    expect(read.gdprConsent).toBe(false);
    expect(read.notes).toBeNull();
    expect(read.resultToken).toBeNull();
  });

  it("persiste scoring, atribución y metadatos de request", async () => {
    const consentAt = new Date("2026-01-15T10:00:00.000Z");
    const inserted = await insertLead({
      email: "cfo@redvet.es",
      jobTitle: "cfo",
      sector: "veterinaria",
      numberLocations: "26-50",
      companyRevenue: "25-50M",
      mainProblem: "rentabilidad",
      score: 87,
      leadLevel: "strategic",
      isHot: true,
      source: "linkedin",
      utmSource: "linkedin",
      utmMedium: "social",
      utmCampaign: "ceo-multicentro",
      resultToken: "tok_abc123",
      gdprConsent: true,
      consentAt,
      consentTextVersion: "v1",
      ipHash: "a".repeat(32),
      device: "mobile",
      country: "ES",
    });
    const [read] = await db.select().from(leads).where(eq(leads.id, inserted.id));
    expect(read.score).toBe(87);
    expect(read.leadLevel).toBe("strategic");
    expect(read.isHot).toBe(true);
    expect(read.source).toBe("linkedin");
    expect(read.utmCampaign).toBe("ceo-multicentro");
    expect(read.resultToken).toBe("tok_abc123");
    expect(read.gdprConsent).toBe(true);
    expect(read.consentAt?.toISOString()).toBe(consentAt.toISOString());
    expect(read.country).toBe("ES");
  });

  it("actualiza el status y lo filtra por enum", async () => {
    const lead = await insertLead({ email: "update@empresa.com" });
    await db.update(leads).set({ status: "MEETING", updatedAt: new Date() }).where(eq(leads.id, lead.id));
    const rows = await db.select({ id: leads.id }).from(leads).where(eq(leads.status, "MEETING"));
    expect(rows.map((r) => r.id)).toContain(lead.id);
  });

  it("el índice de email no es único: admite dos leads con el mismo email", async () => {
    const a = await insertLead({ email: "duplicado@empresa.com" });
    const b = await insertLead({ email: "duplicado@empresa.com" });
    expect(a.id).not.toBe(b.id);
    const rows = await db.select().from(leads).where(eq(leads.email, "duplicado@empresa.com"));
    expect(rows).toHaveLength(2);
  });

  it("el enum lead_status rechaza un valor inválido", async () => {
    await expect(
      db.insert(leads).values({ ...BASE_LEAD, status: "INVALID" as (typeof LEAD_STATUSES)[number] }),
    ).rejects.toThrow();
    await expectDbError(
      db.insert(leads).values({ ...BASE_LEAD, status: "INVALID" as (typeof LEAD_STATUSES)[number] }),
      /invalid input value for enum lead_status/i,
    );
  });

  it("los enums lead_level y lead_source también rechazan valores inválidos", async () => {
    await expectDbError(
      db.insert(leads).values({ ...BASE_LEAD, leadLevel: "ultra" as "low" }),
      /invalid input value for enum lead_level/i,
    );
    await expectDbError(
      db.insert(leads).values({ ...BASE_LEAD, source: "tiktok" as "contact" }),
      /invalid input value for enum lead_source/i,
    );
  });

  it("rechaza NOT NULL violado (sin email)", async () => {
    await expectDbError(
      db.insert(leads).values({ ...BASE_LEAD, email: null as unknown as string }),
      /null value in column "email"/i,
    );
  });

  it("respeta la longitud máxima de varchar (country 2 chars)", async () => {
    await expectDbError(
      db.insert(leads).values({ ...BASE_LEAD, country: "ESP" }),
      /value too long for type character varying\(2\)/i,
    );
  });
});

describe("diagnostic_answers y diagnostic_results", () => {
  it("inserta respuestas y resultado (jsonb) y los recupera por leadId", async () => {
    const lead = await insertLead({ email: "diag@empresa.com" });

    await db.insert(diagnosticAnswers).values([
      { leadId: lead.id, questionId: "q1", answer: "11-25", points: 0 },
      { leadId: lead.id, questionId: "q2", answer: "partial", points: 5 },
      { leadId: lead.id, questionId: "q3", answer: "yes", points: 14 },
    ]);

    const recommendations = {
      headline: "Actualmente vuestro mayor potencial de mejora está en finanzas y personas.",
      focusDimensions: ["finance", "people"],
      problems: ["p1", "p2", "p3"],
      opportunities: ["o1", "o2", "o3"],
      actions: ["a1", "a2", "a3"],
      recommendedService: { slug: "ebitda-improvement", reason: "Foco en rentabilidad." },
    };

    const [result] = await db
      .insert(diagnosticResults)
      .values({
        leadId: lead.id,
        totalScore: 62,
        financeScore: 40,
        operationsScore: 70,
        peopleScore: 50,
        dataScore: 80,
        scalabilityScore: 70,
        resultLevel: "professionalizing",
        recommendations,
      })
      .returning();
    expect(result.id).toMatch(UUID_RE);

    const answers = await db
      .select()
      .from(diagnosticAnswers)
      .where(eq(diagnosticAnswers.leadId, lead.id))
      .orderBy(diagnosticAnswers.questionId);
    expect(answers).toHaveLength(3);
    expect(answers.map((a) => a.questionId)).toEqual(["q1", "q2", "q3"]);
    expect(answers.map((a) => a.points)).toEqual([0, 5, 14]);
    expect(answers.every((a) => a.leadId === lead.id)).toBe(true);

    const results = await db.select().from(diagnosticResults).where(eq(diagnosticResults.leadId, lead.id));
    expect(results).toHaveLength(1);
    expect(results[0].totalScore).toBe(62);
    expect(results[0].resultLevel).toBe("professionalizing");
    expect(results[0].recommendations).toEqual(recommendations);
  });

  it("recommendations tiene '{}' por defecto", async () => {
    const lead = await insertLead({ email: "diag-default@empresa.com" });
    const [result] = await db
      .insert(diagnosticResults)
      .values({
        leadId: lead.id,
        totalScore: 0,
        financeScore: 0,
        operationsScore: 0,
        peopleScore: 0,
        dataScore: 0,
        scalabilityScore: 0,
        resultLevel: "reactive",
      })
      .returning();
    expect(result.recommendations).toEqual({});
  });

  it("la relación `with: { answers, results }` funciona desde db.query", async () => {
    const lead = await insertLead({ email: "rel@empresa.com" });
    await db.insert(diagnosticAnswers).values({ leadId: lead.id, questionId: "q2", answer: "no", points: 0 });
    await db.insert(diagnosticResults).values({
      leadId: lead.id,
      totalScore: 10,
      financeScore: 0,
      operationsScore: 10,
      peopleScore: 10,
      dataScore: 20,
      scalabilityScore: 10,
      resultLevel: "reactive",
    });
    const full = await db.query.leads.findFirst({
      where: eq(leads.id, lead.id),
      with: { answers: true, results: true },
    });
    expect(full?.answers).toHaveLength(1);
    expect(full?.results).toHaveLength(1);
    expect(full?.answers[0].questionId).toBe("q2");
  });

  it("rechaza respuestas con lead_id inexistente (FK)", async () => {
    await expectDbError(
      db.insert(diagnosticAnswers).values({
        leadId: "00000000-0000-4000-8000-000000000000",
        questionId: "q1",
        answer: "1",
      }),
      /violates foreign key constraint/i,
    );
  });
});

describe("lead_events", () => {
  it("admite eventos anónimos (leadId null) y asociados a un lead", async () => {
    const lead = await insertLead({ email: "events@empresa.com" });

    const [anonymous] = await db
      .insert(leadEvents)
      .values({
        visitorId: "visitor_anon",
        sessionId: "sess_1",
        eventType: "page_view",
        page: "/diagnostico",
        metadata: { referrer: "https://linkedin.com", utm_source: "linkedin" },
      })
      .returning();
    expect(anonymous.leadId).toBeNull();
    expect(anonymous.metadata).toEqual({ referrer: "https://linkedin.com", utm_source: "linkedin" });

    const [attached] = await db
      .insert(leadEvents)
      .values({ leadId: lead.id, visitorId: "visitor_anon", eventType: "lead_created", page: "/diagnostico/resultado" })
      .returning();
    expect(attached.leadId).toBe(lead.id);
    expect(attached.metadata).toEqual({});

    const byLead = await db.select().from(leadEvents).where(eq(leadEvents.leadId, lead.id));
    expect(byLead).toHaveLength(1);
    expect(byLead[0].eventType).toBe("lead_created");

    const anonymousRows = await db
      .select()
      .from(leadEvents)
      .where(and(isNull(leadEvents.leadId), eq(leadEvents.visitorId, "visitor_anon")));
    expect(anonymousRows).toHaveLength(1);
    expect(anonymousRows[0].eventType).toBe("page_view");

    const byVisitor = await db.select().from(leadEvents).where(eq(leadEvents.visitorId, "visitor_anon"));
    expect(byVisitor).toHaveLength(2);
  });

  it("agrega eventos por tipo", async () => {
    await db.insert(leadEvents).values([
      { eventType: "cta_clicked", metadata: { location: "hero" } },
      { eventType: "cta_clicked", metadata: { location: "footer" } },
      { eventType: "meeting_clicked" },
    ]);
    const rows = await db
      .select({ eventType: leadEvents.eventType, count: sql<number>`count(*)::int` })
      .from(leadEvents)
      .where(eq(leadEvents.eventType, "cta_clicked"))
      .groupBy(leadEvents.eventType);
    expect(rows).toHaveLength(1);
    expect(rows[0].count).toBe(2);
  });
});

describe("lead_notes", () => {
  it("inserta y lee notas de un lead", async () => {
    const lead = await insertLead({ email: "notes@empresa.com" });
    await db.insert(leadNotes).values([
      { leadId: lead.id, note: "Primera llamada realizada.", author: "marc" },
      { leadId: lead.id, note: "Enviada propuesta." },
    ]);
    const notes = await db.select().from(leadNotes).where(eq(leadNotes.leadId, lead.id)).orderBy(leadNotes.createdAt);
    expect(notes).toHaveLength(2);
    expect(notes.map((n) => n.note)).toEqual(["Primera llamada realizada.", "Enviada propuesta."]);
    expect(notes[0].author).toBe("marc");
    expect(notes[1].author).toBeNull();
    expect(notes[0].id).toMatch(UUID_RE);
  });

  it("exige nota no nula", async () => {
    const lead = await insertLead({ email: "notes-null@empresa.com" });
    await expectDbError(
      db.insert(leadNotes).values({ leadId: lead.id, note: null as unknown as string }),
      /null value in column "note"/i,
    );
  });
});

describe("borrado en cascada", () => {
  it("borrar un lead elimina answers/results/notes y deja lead_id null en events", async () => {
    const lead = await insertLead({ email: "cascade@empresa.com" });
    const survivor = await insertLead({ email: "survivor@empresa.com" });

    await db.insert(diagnosticAnswers).values([
      { leadId: lead.id, questionId: "q1", answer: "1" },
      { leadId: survivor.id, questionId: "q1", answer: "2-5" },
    ]);
    await db.insert(diagnosticResults).values({
      leadId: lead.id,
      totalScore: 10,
      financeScore: 10,
      operationsScore: 10,
      peopleScore: 10,
      dataScore: 10,
      scalabilityScore: 10,
      resultLevel: "reactive",
    });
    await db.insert(leadNotes).values({ leadId: lead.id, note: "Se borrará en cascada." });
    const [event] = await db
      .insert(leadEvents)
      .values({ leadId: lead.id, eventType: "lead_created", visitorId: "cascade_visitor" })
      .returning();
    const [survivorEvent] = await db
      .insert(leadEvents)
      .values({ leadId: survivor.id, eventType: "lead_created" })
      .returning();

    const deleted = await db.delete(leads).where(eq(leads.id, lead.id)).returning({ id: leads.id });
    expect(deleted).toEqual([{ id: lead.id }]);

    expect(await db.select().from(leads).where(eq(leads.id, lead.id))).toHaveLength(0);
    expect(await db.select().from(diagnosticAnswers).where(eq(diagnosticAnswers.leadId, lead.id))).toHaveLength(0);
    expect(await db.select().from(diagnosticResults).where(eq(diagnosticResults.leadId, lead.id))).toHaveLength(0);
    expect(await db.select().from(leadNotes).where(eq(leadNotes.leadId, lead.id))).toHaveLength(0);

    const [orphan] = await db.select().from(leadEvents).where(eq(leadEvents.id, event.id));
    expect(orphan).toBeDefined();
    expect(orphan.leadId).toBeNull();
    expect(orphan.visitorId).toBe("cascade_visitor");
    expect(orphan.eventType).toBe("lead_created");

    // El otro lead y sus filas no se ven afectados.
    expect(await db.select().from(diagnosticAnswers).where(eq(diagnosticAnswers.leadId, survivor.id))).toHaveLength(1);
    const [stillAttached] = await db.select().from(leadEvents).where(eq(leadEvents.id, survivorEvent.id));
    expect(stillAttached.leadId).toBe(survivor.id);
  });
});

describe("rate_limits", () => {
  it("usa key como clave primaria y permite upsert del contador", async () => {
    await db.insert(rateLimits).values({ key: "ip:1.2.3.4:diagnostic", count: 1 });
    await db
      .insert(rateLimits)
      .values({ key: "ip:1.2.3.4:diagnostic", count: 1 })
      .onConflictDoUpdate({ target: rateLimits.key, set: { count: sql`${rateLimits.count} + 1` } });
    const [row] = await db.select().from(rateLimits).where(eq(rateLimits.key, "ip:1.2.3.4:diagnostic"));
    expect(row.count).toBe(2);
    expect(row.windowStart).toBeInstanceOf(Date);

    await expectDbError(
      db.insert(rateLimits).values({ key: "ip:1.2.3.4:diagnostic" }),
      /duplicate key value violates unique constraint/i,
    );
  });
});
