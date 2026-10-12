import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  ACTIVITY_TYPES,
  BUDGET_RANGE_VALUES,
  CONTENT_STATUSES,
  DATA_REQUEST_STATUSES,
  DATA_REQUEST_TYPES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  MEDIA_KINDS,
  PROPERTY_TYPE_VALUES,
  TIMELINE_VALUES,
  USER_ROLES,
} from "@/types/lead";

/* ------------------------------------------------------------------ */
/* enums                                                               */
/* ------------------------------------------------------------------ */
export const userRoleEnum = pgEnum("user_role", USER_ROLES);
export const leadStatusEnum = pgEnum("lead_status", LEAD_STATUSES);
export const leadSourceEnum = pgEnum("lead_source", LEAD_SOURCES);
export const propertyTypeEnum = pgEnum("property_type", PROPERTY_TYPE_VALUES);
export const budgetRangeEnum = pgEnum("budget_range", BUDGET_RANGE_VALUES);
export const timelineEnum = pgEnum("timeline", TIMELINE_VALUES);
export const contentStatusEnum = pgEnum("content_status", CONTENT_STATUSES);
export const mediaKindEnum = pgEnum("media_kind", MEDIA_KINDS);
export const dataRequestTypeEnum = pgEnum("data_request_type", DATA_REQUEST_TYPES);
export const dataRequestStatusEnum = pgEnum("data_request_status", DATA_REQUEST_STATUSES);
export const activityTypeEnum = pgEnum("activity_type", ACTIVITY_TYPES);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

/* ------------------------------------------------------------------ */
/* users                                                               */
/* ------------------------------------------------------------------ */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 254 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("editor"),
    isActive: boolean("is_active").notNull().default(true),
    /** Se incrementa al cambiar la contraseña o desactivar: invalida todas las sesiones. */
    sessionVersion: integer("session_version").notNull().default(1),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdBy: uuid("created_by"),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_lower_idx").on(sql`lower(${t.email})`)],
);

/* ------------------------------------------------------------------ */
/* media_assets                                                        */
/* ------------------------------------------------------------------ */
export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storageKey: varchar("storage_key", { length: 500 }).notNull(),
    url: varchar("url", { length: 1000 }).notNull(),
    filename: varchar("filename", { length: 255 }).notNull(),
    mime: varchar("mime", { length: 100 }).notNull(),
    sizeBytes: integer("size_bytes").notNull().default(0),
    width: integer("width"),
    height: integer("height"),
    alt: varchar("alt", { length: 300 }).notNull().default(""),
    /** `illustrative` = imagen generada o de recurso; nunca se presenta como obra real. */
    kind: mediaKindEnum("kind").notNull().default("illustrative"),
    uploadedBy: uuid("uploaded_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("media_assets_created_at_idx").on(t.createdAt)],
);

/* ------------------------------------------------------------------ */
/* leads                                                               */
/* ------------------------------------------------------------------ */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ...timestamps,

    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    phone: varchar("phone", { length: 30 }),
    locality: varchar("locality", { length: 120 }),
    postalCode: varchar("postal_code", { length: 10 }),
    propertyType: propertyTypeEnum("property_type"),
    serviceSlug: varchar("service_slug", { length: 120 }),
    sectorSlug: varchar("sector_slug", { length: 120 }),
    squareMeters: integer("square_meters"),
    budgetRange: budgetRangeEnum("budget_range"),
    timeline: timelineEnum("timeline"),
    message: text("message"),
    /** Campos contextuales del formulario (actividad, estado del local, sistema…). */
    context: jsonb("context").notNull().default(sql`'{}'::jsonb`),
    formVariant: varchar("form_variant", { length: 40 }),
    articleSlug: varchar("article_slug", { length: 160 }),

    source: leadSourceEnum("source").notNull().default("presupuesto"),
    sourcePage: varchar("source_page", { length: 500 }),
    campaign: varchar("campaign", { length: 200 }),
    utmSource: varchar("utm_source", { length: 120 }),
    utmMedium: varchar("utm_medium", { length: 120 }),
    utmCampaign: varchar("utm_campaign", { length: 200 }),
    utmContent: varchar("utm_content", { length: 200 }),
    utmTerm: varchar("utm_term", { length: 200 }),
    referrer: varchar("referrer", { length: 500 }),

    privacyConsent: boolean("privacy_consent").notNull().default(false),
    marketingConsent: boolean("marketing_consent").notNull().default(false),
    consentAt: timestamp("consent_at", { withTimezone: true }),
    consentTextVersion: varchar("consent_text_version", { length: 20 }),

    status: leadStatusEnum("status").notNull().default("NEW"),
    assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
    nextFollowUpAt: timestamp("next_follow_up_at", { withTimezone: true }),
    internalNotes: text("internal_notes"),

    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 400 }),
    device: varchar("device", { length: 20 }),
    country: varchar("country", { length: 2 }),
    visitorId: varchar("visitor_id", { length: 64 }),
    turnstileOk: boolean("turnstile_ok"),
  },
  (t) => [
    index("leads_created_at_idx").on(t.createdAt),
    index("leads_status_idx").on(t.status),
    index("leads_email_idx").on(t.email),
    index("leads_assigned_to_idx").on(t.assignedTo),
    index("leads_source_idx").on(t.source),
  ],
);

export const leadActivities = pgTable(
  "lead_activities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    type: activityTypeEnum("type").notNull(),
    payload: jsonb("payload").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("lead_activities_lead_idx").on(t.leadId), index("lead_activities_created_at_idx").on(t.createdAt)],
);

export const leadAttachments = pgTable(
  "lead_attachments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    storageKey: varchar("storage_key", { length: 500 }).notNull(),
    filename: varchar("filename", { length: 255 }).notNull(),
    mime: varchar("mime", { length: 100 }).notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    uploadedByLead: boolean("uploaded_by_lead").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("lead_attachments_lead_idx").on(t.leadId)],
);

export const followUps = pgTable(
  "follow_ups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
    title: varchar("title", { length: 200 }).notNull(),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    done: boolean("done").notNull().default(false),
    doneAt: timestamp("done_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("follow_ups_lead_idx").on(t.leadId), index("follow_ups_due_at_idx").on(t.dueAt)],
);

/* ------------------------------------------------------------------ */
/* contenido                                                           */
/* ------------------------------------------------------------------ */
const seoColumns = {
  metaTitle: varchar("meta_title", { length: 120 }),
  metaDescription: varchar("meta_description", { length: 320 }),
};

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    groupSlug: varchar("group_slug", { length: 60 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    shortName: varchar("short_name", { length: 80 }).notNull(),
    headline: varchar("headline", { length: 200 }).notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull().default(""),
    features: jsonb("features").notNull().default(sql`'[]'::jsonb`),
    forWhom: jsonb("for_whom").notNull().default(sql`'[]'::jsonb`),
    process: jsonb("process").notNull().default(sql`'[]'::jsonb`),
    requiresLicensedPro: boolean("requires_licensed_pro").notNull().default(false),
    licenseNote: text("license_note"),
    imageId: uuid("image_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    imagePath: varchar("image_path", { length: 300 }),
    order: integer("order").notNull().default(0),
    status: contentStatusEnum("status").notNull().default("published"),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [index("services_group_idx").on(t.groupSlug), index("services_status_idx").on(t.status)],
);

export const sectors = pgTable(
  "sectors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    headline: varchar("headline", { length: 200 }).notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull().default(""),
    serviceSlugs: jsonb("service_slugs").notNull().default(sql`'[]'::jsonb`),
    imageId: uuid("image_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    imagePath: varchar("image_path", { length: 300 }),
    order: integer("order").notNull().default(0),
    status: contentStatusEnum("status").notNull().default("published"),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [index("sectors_status_idx").on(t.status)],
);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    serviceSlug: varchar("service_slug", { length: 120 }),
    sectorSlug: varchar("sector_slug", { length: 120 }),
    locality: varchar("locality", { length: 120 }),
    summary: text("summary").notNull(),
    scope: text("scope").notNull().default(""),
    body: text("body").notNull().default(""),
    coverImageId: uuid("cover_image_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    coverImagePath: varchar("cover_image_path", { length: 300 }),
    /** true = las imágenes son ilustrativas (no fotografías de obra ejecutada). */
    isIllustrative: boolean("is_illustrative").notNull().default(true),
    /** Solo con fotos reales verificadas se activa el comparador antes/después. */
    hasVerifiedBeforeAfter: boolean("has_verified_before_after").notNull().default(false),
    order: integer("order").notNull().default(0),
    status: contentStatusEnum("status").notNull().default("draft"),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [index("projects_status_idx").on(t.status)],
);

export const projectImages = pgTable(
  "project_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaAssets.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).notNull().default("gallery"),
    caption: varchar("caption", { length: 300 }),
    order: integer("order").notNull().default(0),
  },
  (t) => [index("project_images_project_idx").on(t.projectId)],
);

export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  description: text("description").notNull().default(""),
  order: integer("order").notNull().default(0),
});

export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 160 }).notNull().default(""),
  bio: text("bio").notNull().default(""),
  avatarPath: varchar("avatar_path", { length: 300 }),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});

export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    excerpt: text("excerpt").notNull(),
    body: text("body").notNull().default(""),
    categorySlug: varchar("category_slug", { length: 120 }).notNull(),
    tags: jsonb("tags").notNull().default(sql`'[]'::jsonb`),
    relatedServiceSlugs: jsonb("related_service_slugs").notNull().default(sql`'[]'::jsonb`),
    coverImageId: uuid("cover_image_id").references(() => mediaAssets.id, { onDelete: "set null" }),
    coverImagePath: varchar("cover_image_path", { length: 300 }),
    authorId: uuid("author_id").references(() => authors.id, { onDelete: "set null" }),
    authorName: varchar("author_name", { length: 120 }),
    readingMinutes: integer("reading_minutes").notNull().default(5),
    status: contentStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    /** Fecha real de la última revisión editorial (se muestra en el artículo). */
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    canonicalUrl: varchar("canonical_url", { length: 500 }),
    /** Palabra clave principal y secundarias (matriz SEO editable). */
    keywordPrimary: varchar("keyword_primary", { length: 120 }),
    keywordsSecondary: jsonb("keywords_secondary").notNull().default(sql`'[]'::jsonb`),
    /** FAQs propias del artículo: [{question, answer}]. */
    faqs: jsonb("faqs").notNull().default(sql`'[]'::jsonb`),
    /** Fuentes citadas: [{title, url}]. */
    sources: jsonb("sources").notNull().default(sql`'[]'::jsonb`),
    /** Variante del formulario contextual: vivienda | local | gimnasio | restaurante | instalaciones | general. */
    formVariant: varchar("form_variant", { length: 40 }).notNull().default("general"),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [index("articles_status_idx").on(t.status), index("articles_category_idx").on(t.categorySlug)],
);

export const faqs = pgTable(
  "faqs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    question: varchar("question", { length: 300 }).notNull(),
    answer: text("answer").notNull(),
    /** global | service | sector | area */
    scope: varchar("scope", { length: 20 }).notNull().default("global"),
    scopeSlug: varchar("scope_slug", { length: 120 }),
    order: integer("order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("faqs_scope_idx").on(t.scope, t.scopeSlug)],
);

export const localAreas = pgTable(
  "local_areas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 120 }).notNull(),
    province: varchar("province", { length: 120 }).notNull(),
    headline: varchar("headline", { length: 200 }).notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull().default(""),
    serviceSlugs: jsonb("service_slugs").notNull().default(sql`'[]'::jsonb`),
    order: integer("order").notNull().default(0),
    status: contentStatusEnum("status").notNull().default("draft"),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [index("local_areas_status_idx").on(t.status)],
);

/** Fila única (id = 1) con toda la configuración editable del sitio. */
export const siteSettings = pgTable(
  "site_settings",
  {
    id: integer("id").primaryKey().default(1),
    data: jsonb("data").notNull().default(sql`'{}'::jsonb`),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check("site_settings_singleton", sql`${t.id} = 1`)],
);

/* ------------------------------------------------------------------ */
/* consentimiento, auditoría, RGPD                                     */
/* ------------------------------------------------------------------ */
export const consentRecords = pgTable(
  "consent_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    visitorId: varchar("visitor_id", { length: 64 }),
    leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
    necessary: boolean("necessary").notNull().default(true),
    analytics: boolean("analytics").notNull().default(false),
    marketing: boolean("marketing").notNull().default(false),
    version: integer("version").notNull().default(1),
    /** cookie_banner | lead_form */
    source: varchar("source", { length: 30 }).notNull().default("cookie_banner"),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: varchar("user_agent", { length: 400 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("consent_records_created_at_idx").on(t.createdAt)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    userEmail: varchar("user_email", { length: 254 }),
    action: varchar("action", { length: 60 }).notNull(),
    entity: varchar("entity", { length: 60 }).notNull(),
    entityId: varchar("entity_id", { length: 120 }),
    diff: jsonb("diff").notNull().default(sql`'{}'::jsonb`),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_logs_created_at_idx").on(t.createdAt), index("audit_logs_entity_idx").on(t.entity, t.entityId)],
);

export const dataRequests = pgTable(
  "data_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: dataRequestTypeEnum("type").notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 254 }).notNull(),
    message: text("message"),
    status: dataRequestStatusEnum("status").notNull().default("new"),
    handledBy: uuid("handled_by").references(() => users.id, { onDelete: "set null" }),
    resolutionNote: text("resolution_note"),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("data_requests_status_idx").on(t.status)],
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
export const leadsRelations = relations(leads, ({ many, one }) => ({
  activities: many(leadActivities),
  attachments: many(leadAttachments),
  followUps: many(followUps),
  events: many(leadEvents),
  assignee: one(users, { fields: [leads.assignedTo], references: [users.id] }),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, { fields: [leadActivities.leadId], references: [leads.id] }),
  user: one(users, { fields: [leadActivities.userId], references: [users.id] }),
}));

export const leadAttachmentsRelations = relations(leadAttachments, ({ one }) => ({
  lead: one(leads, { fields: [leadAttachments.leadId], references: [leads.id] }),
}));

export const followUpsRelations = relations(followUps, ({ one }) => ({
  lead: one(leads, { fields: [followUps.leadId], references: [leads.id] }),
  assignee: one(users, { fields: [followUps.assignedTo], references: [users.id] }),
}));

export const leadEventsRelations = relations(leadEvents, ({ one }) => ({
  lead: one(leads, { fields: [leadEvents.leadId], references: [leads.id] }),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  images: many(projectImages),
  cover: one(mediaAssets, { fields: [projects.coverImageId], references: [mediaAssets.id] }),
}));

export const projectImagesRelations = relations(projectImages, ({ one }) => ({
  project: one(projects, { fields: [projectImages.projectId], references: [projects.id] }),
  media: one(mediaAssets, { fields: [projectImages.mediaId], references: [mediaAssets.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type LeadAttachment = typeof leadAttachments.$inferSelect;
export type FollowUp = typeof followUps.$inferSelect;
export type ServiceRow = typeof services.$inferSelect;
export type SectorRow = typeof sectors.$inferSelect;
export type ProjectRow = typeof projects.$inferSelect;
export type ProjectImageRow = typeof projectImages.$inferSelect;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type BlogCategoryRow = typeof blogCategories.$inferSelect;
export type ArticleRow = typeof articles.$inferSelect;
export type AuthorRow = typeof authors.$inferSelect;
export type FaqRow = typeof faqs.$inferSelect;
export type LocalAreaRow = typeof localAreas.$inferSelect;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type ConsentRecord = typeof consentRecords.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type DataRequest = typeof dataRequests.$inferSelect;
export type LeadEvent = typeof leadEvents.$inferSelect;
export type NewLeadEvent = typeof leadEvents.$inferInsert;
