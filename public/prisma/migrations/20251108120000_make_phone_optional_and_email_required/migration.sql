-- Manual migration: make phone nullable and email required+unique
BEGIN;

-- 1) Populate NULL emails with unique placeholders
UPDATE "User"
SET "email" = ('user' || "id" || '@local')
WHERE "email" IS NULL;

-- 2) Make email NOT NULL
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL;

-- 3) Add unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- 4) Make phone nullable
ALTER TABLE "User" ALTER COLUMN "phone" DROP NOT NULL;

COMMIT;