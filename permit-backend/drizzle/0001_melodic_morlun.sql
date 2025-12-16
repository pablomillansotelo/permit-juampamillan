CREATE TABLE "performance_indicators" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"unit" text,
	"target_value" numeric(10, 2),
	"weight" numeric(5, 2) DEFAULT '1.00',
	"category" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_indicators" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"indicator_id" integer NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"assigned_by" integer,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"evaluator_id" integer NOT NULL,
	"period_type" text NOT NULL,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"status" text DEFAULT 'draft',
	"overall_score" numeric(5, 2),
	"comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"evaluation_id" integer NOT NULL,
	"indicator_id" integer NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"target_value" numeric(10, 2),
	"achievement_percentage" numeric(5, 2),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "evaluation_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"indicator_ids" jsonb,
	"is_default" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
