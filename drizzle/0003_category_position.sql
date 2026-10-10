ALTER TABLE "categories" ADD COLUMN "position" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
-- Existing categories keep the order they were created in (the seeded ones follow the old blog).
UPDATE "categories" SET "position" = "ordered"."n" FROM (SELECT "id", row_number() OVER (ORDER BY "id") AS "n" FROM "categories") AS "ordered" WHERE "categories"."id" = "ordered"."id";
