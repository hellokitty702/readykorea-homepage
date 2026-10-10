CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"disk" varchar(20) NOT NULL,
	"key" varchar(300) NOT NULL,
	"url" text NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"width" integer,
	"height" integer,
	"alt" varchar(300) DEFAULT '' NOT NULL,
	"uploaded_by_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "media_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");