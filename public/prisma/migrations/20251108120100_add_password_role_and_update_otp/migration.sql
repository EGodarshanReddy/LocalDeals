-- Drop old OTP-related columns from User table
ALTER TABLE "User" DROP COLUMN IF EXISTS "otp";
ALTER TABLE "User" DROP COLUMN IF EXISTS "otpExpiresAt";
ALTER TABLE "User" DROP COLUMN IF EXISTS "userType";

-- Add new columns to User table
ALTER TABLE "User" ADD COLUMN "password" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'BUYER';

-- Drop old OTP table if exists
DROP TABLE IF EXISTS "Otp";

-- Create new OTP table
CREATE TABLE "Otp" (
    "id" SERIAL PRIMARY KEY,
    "identifier" TEXT NOT NULL UNIQUE,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Update existing users with a temporary password
-- They will need to reset their password on next login
UPDATE "User" SET "password" = '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXX' WHERE "password" = '';

-- Remove default from password column after setting initial values
ALTER TABLE "User" ALTER COLUMN "password" DROP DEFAULT;