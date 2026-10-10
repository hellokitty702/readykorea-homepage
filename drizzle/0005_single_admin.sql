-- The panel has one account (the admin); accounts with the old "user" role could never sign in.
DELETE FROM "users" WHERE "role" <> 'admin';--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";
