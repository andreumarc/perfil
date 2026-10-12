CREATE TYPE "public"."activity_type" AS ENUM('status_change', 'note', 'email_sent', 'call', 'visit', 'quote', 'assignment', 'system');--> statement-breakpoint
CREATE TYPE "public"."budget_range" AS ENUM('lt10k', '10k-25k', '25k-50k', '50k-100k', 'gt100k', 'no_se');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."data_request_status" AS ENUM('new', 'in_progress', 'closed');--> statement-breakpoint
CREATE TYPE "public"."data_request_type" AS ENUM('access', 'rectification', 'erasure', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('presupuesto', 'contacto', 'servicio', 'sector', 'zona', 'proyecto', 'blog', 'whatsapp', 'telefono', 'otro');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'QUOTE_SENT', 'WON', 'LOST');--> statement-breakpoint
CREATE TYPE "public"."media_kind" AS ENUM('real', 'illustrative');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('piso', 'casa', 'local', 'oficina', 'nave', 'comunidad', 'otro');--> statement-breakpoint
CREATE TYPE "public"."timeline" AS ENUM('inmediato', '1-3m', '3-6m', 'gt6m', 'sin_fecha');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor');--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"excerpt" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"category_slug" varchar(120) NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_service_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cover_image_id" uuid,
	"cover_image_path" varchar(300),
	"author_id" uuid,
	"author_name" varchar(120),
	"reading_minutes" integer DEFAULT 5 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"canonical_url" varchar(500),
	"keyword_primary" varchar(120),
	"keywords_secondary" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"faqs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"form_variant" varchar(40) DEFAULT 'general' NOT NULL,
	"meta_title" varchar(120),
	"meta_description" varchar(320),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"user_email" varchar(254),
	"action" varchar(60) NOT NULL,
	"entity" varchar(60) NOT NULL,
	"entity_id" varchar(120),
	"diff" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ip_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" varchar(160) DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"avatar_path" varchar(300),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "authors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "consent_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visitor_id" varchar(64),
	"lead_id" uuid,
	"necessary" boolean DEFAULT true NOT NULL,
	"analytics" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"source" varchar(30) DEFAULT 'cookie_banner' NOT NULL,
	"ip_hash" varchar(64),
	"user_agent" varchar(400),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "data_request_type" NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(254) NOT NULL,
	"message" text,
	"status" "data_request_status" DEFAULT 'new' NOT NULL,
	"handled_by" uuid,
	"resolution_note" text,
	"closed_at" timestamp with time zone,
	"ip_hash" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" varchar(300) NOT NULL,
	"answer" text NOT NULL,
	"scope" varchar(20) DEFAULT 'global' NOT NULL,
	"scope_slug" varchar(120),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follow_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"assigned_to" uuid,
	"title" varchar(200) NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"done_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"user_id" uuid,
	"type" "activity_type" NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime" varchar(100) NOT NULL,
	"size_bytes" integer NOT NULL,
	"uploaded_by_lead" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid,
	"visitor_id" varchar(64),
	"session_id" varchar(64),
	"event_type" varchar(60) NOT NULL,
	"page" varchar(500),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(254) NOT NULL,
	"phone" varchar(30),
	"locality" varchar(120),
	"postal_code" varchar(10),
	"property_type" "property_type",
	"service_slug" varchar(120),
	"sector_slug" varchar(120),
	"square_meters" integer,
	"budget_range" "budget_range",
	"timeline" timeline,
	"message" text,
	"context" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"form_variant" varchar(40),
	"article_slug" varchar(160),
	"source" "lead_source" DEFAULT 'presupuesto' NOT NULL,
	"source_page" varchar(500),
	"campaign" varchar(200),
	"utm_source" varchar(120),
	"utm_medium" varchar(120),
	"utm_campaign" varchar(200),
	"utm_content" varchar(200),
	"utm_term" varchar(200),
	"referrer" varchar(500),
	"privacy_consent" boolean DEFAULT false NOT NULL,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"consent_at" timestamp with time zone,
	"consent_text_version" varchar(20),
	"status" "lead_status" DEFAULT 'NEW' NOT NULL,
	"assigned_to" uuid,
	"next_follow_up_at" timestamp with time zone,
	"internal_notes" text,
	"ip_hash" varchar(64),
	"user_agent" varchar(400),
	"device" varchar(20),
	"country" varchar(2),
	"visitor_id" varchar(64),
	"turnstile_ok" boolean
);
--> statement-breakpoint
CREATE TABLE "local_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(120) NOT NULL,
	"province" varchar(120) NOT NULL,
	"headline" varchar(200) NOT NULL,
	"summary" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"service_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"meta_title" varchar(120),
	"meta_description" varchar(320),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "local_areas_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_key" varchar(500) NOT NULL,
	"url" varchar(1000) NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime" varchar(100) NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL,
	"width" integer,
	"height" integer,
	"alt" varchar(300) DEFAULT '' NOT NULL,
	"kind" "media_kind" DEFAULT 'illustrative' NOT NULL,
	"uploaded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"role" varchar(20) DEFAULT 'gallery' NOT NULL,
	"caption" varchar(300),
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"title" varchar(200) NOT NULL,
	"service_slug" varchar(120),
	"sector_slug" varchar(120),
	"locality" varchar(120),
	"summary" text NOT NULL,
	"scope" text DEFAULT '' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"cover_image_id" uuid,
	"cover_image_path" varchar(300),
	"is_illustrative" boolean DEFAULT true NOT NULL,
	"has_verified_before_after" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"meta_title" varchar(120),
	"meta_description" varchar(320),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" varchar(160) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"name" varchar(160) NOT NULL,
	"headline" varchar(200) NOT NULL,
	"summary" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"service_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"image_id" uuid,
	"image_path" varchar(300),
	"order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'published' NOT NULL,
	"meta_title" varchar(120),
	"meta_description" varchar(320),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sectors_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(120) NOT NULL,
	"group_slug" varchar(60) NOT NULL,
	"name" varchar(160) NOT NULL,
	"short_name" varchar(80) NOT NULL,
	"headline" varchar(200) NOT NULL,
	"summary" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"for_whom" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"process" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"requires_licensed_pro" boolean DEFAULT false NOT NULL,
	"license_note" text,
	"image_id" uuid,
	"image_path" varchar(300),
	"order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'published' NOT NULL,
	"meta_title" varchar(120),
	"meta_description" varchar(320),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_singleton" CHECK ("site_settings"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(254) NOT NULL,
	"name" varchar(120) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'editor' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"session_version" integer DEFAULT 1 NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_assets_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_requests" ADD CONSTRAINT "data_requests_handled_by_users_id_fk" FOREIGN KEY ("handled_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_attachments" ADD CONSTRAINT "lead_attachments_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_events" ADD CONSTRAINT "lead_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_media_id_media_assets_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_cover_image_id_media_assets_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_image_id_media_assets_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_image_id_media_assets_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_slug");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity","entity_id");--> statement-breakpoint
CREATE INDEX "consent_records_created_at_idx" ON "consent_records" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "data_requests_status_idx" ON "data_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "faqs_scope_idx" ON "faqs" USING btree ("scope","scope_slug");--> statement-breakpoint
CREATE INDEX "follow_ups_lead_idx" ON "follow_ups" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "follow_ups_due_at_idx" ON "follow_ups" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "lead_activities_lead_idx" ON "lead_activities" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_activities_created_at_idx" ON "lead_activities" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lead_attachments_lead_idx" ON "lead_attachments" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_events_type_idx" ON "lead_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "lead_events_created_at_idx" ON "lead_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lead_events_lead_idx" ON "lead_events" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_events_visitor_idx" ON "lead_events" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_assigned_to_idx" ON "leads" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "leads_source_idx" ON "leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "local_areas_status_idx" ON "local_areas" USING btree ("status");--> statement-breakpoint
CREATE INDEX "media_assets_created_at_idx" ON "media_assets" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "project_images_project_idx" ON "project_images" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sectors_status_idx" ON "sectors" USING btree ("status");--> statement-breakpoint
CREATE INDEX "services_group_idx" ON "services" USING btree ("group_slug");--> statement-breakpoint
CREATE INDEX "services_status_idx" ON "services" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_idx" ON "users" USING btree (lower("email"));