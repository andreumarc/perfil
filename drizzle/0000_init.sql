CREATE TYPE "public"."lead_level" AS ENUM('low', 'medium', 'high', 'strategic');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('diagnostic', 'contact', 'calculator', 'linkedin');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('NEW', 'CONTACTED', 'MEETING', 'PROPOSAL', 'WON', 'LOST');--> statement-breakpoint
CREATE TABLE "diagnostic_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"question_id" varchar(20) NOT NULL,
	"answer" varchar(40) NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostic_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"total_score" integer NOT NULL,
	"finance_score" integer NOT NULL,
	"operations_score" integer NOT NULL,
	"people_score" integer NOT NULL,
	"data_score" integer NOT NULL,
	"scalability_score" integer NOT NULL,
	"result_level" varchar(40) NOT NULL,
	"recommendations" jsonb DEFAULT '{}'::jsonb NOT NULL,
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
CREATE TABLE "lead_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"note" text NOT NULL,
	"author" varchar(120),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"first_name" varchar(80) NOT NULL,
	"last_name" varchar(120) NOT NULL,
	"company" varchar(160) NOT NULL,
	"job_title" varchar(60) NOT NULL,
	"email" varchar(254) NOT NULL,
	"phone" varchar(30),
	"sector" varchar(60),
	"company_revenue" varchar(20),
	"number_locations" varchar(20),
	"main_problem" varchar(60),
	"score" integer DEFAULT 0 NOT NULL,
	"lead_level" "lead_level" DEFAULT 'low' NOT NULL,
	"is_hot" boolean DEFAULT false NOT NULL,
	"status" "lead_status" DEFAULT 'NEW' NOT NULL,
	"source" "lead_source" DEFAULT 'diagnostic' NOT NULL,
	"notes" text,
	"message" text,
	"utm_source" varchar(120),
	"utm_medium" varchar(120),
	"utm_campaign" varchar(200),
	"utm_content" varchar(200),
	"utm_term" varchar(200),
	"referrer" varchar(500),
	"landing_page" varchar(500),
	"result_token" varchar(64),
	"gdpr_consent" boolean DEFAULT false NOT NULL,
	"consent_at" timestamp with time zone,
	"consent_text_version" varchar(20),
	"ip_hash" varchar(64),
	"user_agent" varchar(400),
	"device" varchar(20),
	"country" varchar(2),
	"visitor_id" varchar(64)
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" varchar(160) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "diagnostic_answers" ADD CONSTRAINT "diagnostic_answers_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostic_results" ADD CONSTRAINT "diagnostic_results_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_events" ADD CONSTRAINT "lead_events_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "diagnostic_answers_lead_idx" ON "diagnostic_answers" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "diagnostic_results_lead_idx" ON "diagnostic_results" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_events_type_idx" ON "lead_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "lead_events_created_at_idx" ON "lead_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "lead_events_lead_idx" ON "lead_events" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "lead_events_visitor_idx" ON "lead_events" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "lead_notes_lead_idx" ON "lead_notes" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_email_idx" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_score_idx" ON "leads" USING btree ("score");--> statement-breakpoint
CREATE INDEX "leads_result_token_idx" ON "leads" USING btree ("result_token");