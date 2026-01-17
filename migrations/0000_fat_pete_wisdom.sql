CREATE TABLE "training_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"training_id" integer NOT NULL,
	"date" timestamp DEFAULT now(),
	"start_time" text,
	"end_time" text,
	"kept_pace" boolean DEFAULT false,
	"within_time" boolean DEFAULT false,
	"all_reps" boolean DEFAULT false,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "trainings" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"duration_seconds" integer,
	"pace" text,
	"tempo" text,
	"reps" text,
	"is_featured" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
