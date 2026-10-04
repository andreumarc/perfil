import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { LEAD_LEVELS, LEAD_SOURCES, LEAD_STATUSES } from "@/types/lead";

export const leadLevelEnum = pgEnum("lead_level", LEAD_LEVELS);
export const leadStatusEnum = pgEnum("lead_status", LEAD_STATUSES);
export const leadSourceEnum = pgEnum("lead_source", LEAD_SOURCES);

/* ------------------------------------------------------------------ */
/* leads                                                               */
/* ------------------------------------------------------------------ */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

    firstName: varchar("first_name", { length: 80 }).notNull(),
    lastName: varchar("last_name", { length: 120 }).notNull(),
    company: varchar("company", { length: 160 }).notNull(),
    jobTitle: varchar("job_title", { length: 60 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 30 }),

    sector: varchar("sector", { length: 60 }),
    companyRevenue: varchar("company_revenue", { length: 20 }),
    numberLocations: varchar("number_locations", { length: 20 }),
    mainProblem: varchar("main_problem", { length: 60 }),

    score: integer("score").notNull().default(0),
    leadLevel: leadLevelEnum("lead_level").notNull().default("low"),
    isHot: boolean("is_hot").notNull().default(false),
    status: leadStatusEnum("status").notNull().default("NEW"),
    source: leadSourceEnum("source").notNull().default("diagnostic"),
    notes: text("notes"),
    /** Mensaje libre del formulario de contacto. */
    message: text("message"),

    utmSource: varchar("utm_source", { length: 120 }),
    utmMedium: varchar("utm_medium", { length: 120 }),
    utmCampaign: varchar("utm_campaign", { length: 200 }),
    utmContent: varchar("utm_content", { length: 200 }),
    utmTerm: varchar("utm_term", { length: 200 }),
    referrer: varchar("referrer", { length: 500 }),
    landingPage: varchar("landing_page", { length: 500 }),

    /** Token no adivinable para consultar el resultado del diagnóstico. */
    resultToken: varchar("result_token", { length: 64 }),

    gdprConsent: boolean("gdpr_consent").notNull().default(false),
    consentAt: timestamp("consent_at", { withTimezone: true }),
    consentTextVersion: varchar("consent_text_version", { length: 20 }),

    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 400 }),
    device: varchar("device", { length: 20 }),
    country: varchar("country", { length: 2 }),
    visitorId: varchar("visitor_id", { length: 64 }),
  },
  (t) => [
    index("leads_created_at_idx").on(t.createdAt),
    index("leads_email_idx").on(t.email),
    index("leads_status_idx").on(t.status),
    index("leads_score_idx").on(t.score),
    index("leads_result_token_idx").on(t.resultToken),
  ],
);

/* ------------------------------------------------------------------ */
/* diagnostic_answers                                                  */
/* ------------------------------------------------------------------ */
export const diagnosticAnswers = pgTable(
  "diagnostic_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    questionId: varchar("question_id", { length: 20 }).notNull(),
    answer: varchar("answer", { length: 40 }).notNull(),
    points: integer("points").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("diagnostic_answers_lead_idx").on(t.leadId)],
);

/* ------------------------------------------------------------------ */
/* diagnostic_results                                                  */
/* ------------------------------------------------------------------ */
export const diagnosticResults = pgTable(
  "diagnostic_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    totalScore: integer("total_score").notNull(),
    financeScore: integer("finance_score").notNull(),
    operationsScore: integer("operations_score").notNull(),
    peopleScore: integer("people_score").notNull(),
    dataScore: integer("data_score").notNull(),
    scalabilityScore: integer("scalability_score").notNull(),
    resultLevel: varchar("result_level", { length: 40 }).notNull(),
    recommendations: jsonb("recommendations").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("diagnostic_results_lead_idx").on(t.leadId)],
);

/* ------------------------------------------------------------------ */
/* lead_events — eventos del funnel (anónimos o asociados a lead)      */
/* ------------------------------------------------------------------ */
export const leadEvents = pgTable(
  "lead_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    visitorId: varchar("visitor_id", { length: 64 }),
    sessionId: varchar("session_id", { length: 64 }),
    eventType: varchar("event_type", { length: 60 }).notNull(),
    page: varchar("page", { length: 500 }),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("lead_events_type_idx").on(t.eventType),
    index("lead_events_created_at_idx").on(t.createdAt),
    index("lead_events_lead_idx").on(t.leadId),
    index("lead_events_visitor_idx").on(t.visitorId),
  ],
);

/* ------------------------------------------------------------------ */
/* lead_notes                                                          */
/* ------------------------------------------------------------------ */
export const leadNotes = pgTable(
  "lead_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    note: text("note").notNull(),
    author: varchar("author", { length: 120 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("lead_notes_lead_idx").on(t.leadId)],
);

/* ------------------------------------------------------------------ */
/* rate_limits — ventana fija por clave (IP + acción)                  */
/* ------------------------------------------------------------------ */
export const rateLimits = pgTable("rate_limits", {
  key: varchar("key", { length: 160 }).primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* relations                                                           */
/* ------------------------------------------------------------------ */
export const leadsRelations = relations(leads, ({ many }) => ({
  answers: many(diagnosticAnswers),
  results: many(diagnosticResults),
  events: many(leadEvents),
  leadNotes: many(leadNotes),
}));

export const diagnosticAnswersRelations = relations(diagnosticAnswers, ({ one }) => ({
  lead: one(leads, { fields: [diagnosticAnswers.leadId], references: [leads.id] }),
}));

export const diagnosticResultsRelations = relations(diagnosticResults, ({ one }) => ({
  lead: one(leads, { fields: [diagnosticResults.leadId], references: [leads.id] }),
}));

export const leadEventsRelations = relations(leadEvents, ({ one }) => ({
  lead: one(leads, { fields: [leadEvents.leadId], references: [leads.id] }),
}));

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
  lead: one(leads, { fields: [leadNotes.leadId], references: [leads.id] }),
}));

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type DiagnosticAnswerRow = typeof diagnosticAnswers.$inferSelect;
export type DiagnosticResultRow = typeof diagnosticResults.$inferSelect;
export type LeadEvent = typeof leadEvents.$inferSelect;
export type NewLeadEvent = typeof leadEvents.$inferInsert;
export type LeadNote = typeof leadNotes.$inferSelect;
