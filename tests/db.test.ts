import { eq, isNull } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  articles,
  auditLogs,
  consentRecords,
  followUps,
  leadActivities,
  leadAttachments,
  leadEvents,
  leads,
  rateLimits,
  siteSettings,
  users,
} from "@/db/schema";
import { LEAD_STATUSES } from "@/types/lead";

import { createTestDb, loadMigrationStatements, type TestClient, type TestDb } from "./helpers/pglite";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const BASE_LEAD = { name: "Laura Pérez", email: "laura@example.com", phone: "+34600123456" } as const;

let client: TestClient;
let db: TestDb;

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

beforeAll(async () => {
  ({ client, db } = await createTestDb());
});

afterAll(async () => {
  await client?.close();
});

describe("migración 0000_init.sql en PGlite", () => {
  it("crea todas las tablas y enums del modelo", async () => {
    const statements = loadMigrationStatements();
    expect(statements.length).toBeGreaterThan(40);
    expect(statements.every((s) => !s.includes("statement-breakpoint"))).toBe(true);

    const tables = await client.query<{ table_name: string }>(
      "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
    );
    expect(tables.rows.map((r) => r.table_name)).toEqual([
      "articles",
      "audit_logs",
      "authors",
      "blog_categories",
      "consent_records",
      "data_requests",
      "faqs",
      "follow_ups",
      "lead_activities",
      "lead_attachments",
      "lead_events",
      "leads",
      "local_areas",
      "media_assets",
      "project_images",
      "projects",
      "rate_limits",
      "sectors",
      "services",
      "site_settings",
      "users",
    ]);

    const enums = await client.query<{ typname: string }>("select typname from pg_type where typtype = 'e' order by typname");
    expect(enums.rows.map((r) => r.typname)).toEqual([
      "activity_type",
      "budget_range",
      "content_status",
      "data_request_status",
      "data_request_type",
      "lead_source",
      "lead_status",
      "media_kind",
      "property_type",
      "timeline",
      "user_role",
    ]);
  });

  it("gen_random_uuid() está disponible en PGlite", async () => {
    const r = await client.query<{ id: string }>("select gen_random_uuid()::text as id");
    expect(r.rows[0].id).toMatch(UUID_RE);
  });
});

describe("users", () => {
  it("el email es único sin distinguir mayúsculas", async () => {
    await db.insert(users).values({ email: "Admin@Empresa.com", name: "Admin", passwordHash: "x", role: "admin" });
    await expectDbError(db.insert(users).values({ email: "admin@empresa.COM", name: "Otro", passwordHash: "y" }), /unique|duplicate/i);
  });
  it("aplica defaults de rol, activo y versión de sesión", async () => {
    const [u] = await db.insert(users).values({ email: "editor@empresa.com", name: "Editora", passwordHash: "h" }).returning();
    expect(u.role).toBe("editor");
    expect(u.isActive).toBe(true);
    expect(u.sessionVersion).toBe(1);
  });
});

describe("leads", () => {
  it("inserta un lead con los campos obligatorios y defaults", async () => {
    const [lead] = await db.insert(leads).values(BASE_LEAD).returning();
    expect(lead.id).toMatch(UUID_RE);
    expect(lead.status).toBe("NEW");
    expect(lead.source).toBe("presupuesto");
    expect(lead.privacyConsent).toBe(false);
    expect(lead.marketingConsent).toBe(false);
    expect(lead.context).toEqual({});
  });

  it("acepta todos los estados y rechaza valores fuera del enum", async () => {
    for (const status of LEAD_STATUSES) {
      const [row] = await db.insert(leads).values({ ...BASE_LEAD, status }).returning();
      expect(row.status).toBe(status);
    }
    await expectDbError(
      client.query("insert into leads (name, email, phone, status) values ('x','x@x.com','+34600000000','INVENTADO')"),
      /invalid input value for enum/i,
    );
  });

  it("el borrado de un lead elimina actividades, adjuntos y tareas, y anonimiza eventos", async () => {
    const [lead] = await db.insert(leads).values(BASE_LEAD).returning();
    await db.insert(leadActivities).values({ leadId: lead.id, type: "note", payload: { note: "hola" } });
    await db.insert(leadAttachments).values({ leadId: lead.id, storageKey: "k", filename: "f.pdf", mime: "application/pdf", sizeBytes: 10 });
    await db.insert(followUps).values({ leadId: lead.id, title: "Llamar", dueAt: new Date() });
    const [event] = await db.insert(leadEvents).values({ leadId: lead.id, eventType: "lead_created" }).returning();
    const [consent] = await db.insert(consentRecords).values({ leadId: lead.id, analytics: false, marketing: true }).returning();

    await db.delete(leads).where(eq(leads.id, lead.id));

    expect(await db.select().from(leadActivities).where(eq(leadActivities.leadId, lead.id))).toHaveLength(0);
    expect(await db.select().from(leadAttachments).where(eq(leadAttachments.leadId, lead.id))).toHaveLength(0);
    expect(await db.select().from(followUps).where(eq(followUps.leadId, lead.id))).toHaveLength(0);
    const [orphanEvent] = await db.select().from(leadEvents).where(eq(leadEvents.id, event.id));
    expect(orphanEvent.leadId).toBeNull();
    const [orphanConsent] = await db.select().from(consentRecords).where(eq(consentRecords.id, consent.id));
    expect(orphanConsent.leadId).toBeNull();
  });

  it("desasigna el lead al borrar el usuario asignado", async () => {
    const [u] = await db.insert(users).values({ email: "comercial@empresa.com", name: "Comercial", passwordHash: "h" }).returning();
    const [lead] = await db.insert(leads).values({ ...BASE_LEAD, assignedTo: u.id }).returning();
    await db.delete(users).where(eq(users.id, u.id));
    const [row] = await db.select().from(leads).where(eq(leads.id, lead.id));
    expect(row.assignedTo).toBeNull();
    expect(await db.select().from(leads).where(isNull(leads.assignedTo))).not.toHaveLength(0);
  });
});

describe("site_settings", () => {
  it("solo admite la fila id = 1", async () => {
    await db.insert(siteSettings).values({ id: 1, data: { company: { name: "X" } } }).onConflictDoNothing();
    await expectDbError(db.insert(siteSettings).values({ id: 2, data: {} }), /check constraint|site_settings_singleton/i);
  });
});

describe("articles y auditoría", () => {
  it("un artículo nace como borrador con listas vacías", async () => {
    const [a] = await db
      .insert(articles)
      .values({ slug: "prueba", title: "Prueba", excerpt: "x", categorySlug: "costes" })
      .returning();
    expect(a.status).toBe("draft");
    expect(a.faqs).toEqual([]);
    expect(a.sources).toEqual([]);
    expect(a.formVariant).toBe("general");
  });
  it("audit_logs guarda acción, entidad y diff", async () => {
    const [log] = await db.insert(auditLogs).values({ action: "update", entity: "settings", entityId: "1", diff: { phone: ["", "600"] } }).returning();
    expect(log.diff).toEqual({ phone: ["", "600"] });
  });
});

describe("rate_limits", () => {
  it("el upsert incrementa el contador dentro de la ventana", async () => {
    await db.insert(rateLimits).values({ key: "k1", count: 1, windowStart: new Date() });
    await db
      .insert(rateLimits)
      .values({ key: "k1", count: 1, windowStart: new Date() })
      .onConflictDoUpdate({ target: rateLimits.key, set: { count: 2 } });
    const [row] = await db.select().from(rateLimits).where(eq(rateLimits.key, "k1"));
    expect(row.count).toBe(2);
  });
});
