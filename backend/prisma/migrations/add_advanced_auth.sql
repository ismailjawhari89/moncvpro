-- Migration: Add Advanced Authentication System
-- This migration adds the VerificationToken model and enhances the Session model

-- Add new fields to Session table
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "deviceName" TEXT;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create TokenType enum
DO $$ BEGIN
    CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET', 'TWO_FACTOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create VerificationToken table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint on token
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");

-- Create indexes for VerificationToken
CREATE INDEX IF NOT EXISTS "VerificationToken_email_idx" ON "VerificationToken"("email");
CREATE INDEX IF NOT EXISTS "VerificationToken_token_idx" ON "VerificationToken"("token");
CREATE INDEX IF NOT EXISTS "VerificationToken_type_idx" ON "VerificationToken"("type");
CREATE INDEX IF NOT EXISTS "VerificationToken_userId_idx" ON "VerificationToken"("userId");
CREATE INDEX IF NOT EXISTS "VerificationToken_email_type_idx" ON "VerificationToken"("email", "type");

-- Create composite index for Session
CREATE INDEX IF NOT EXISTS "Session_userId_revokedAt_idx" ON "Session"("userId", "revokedAt");

-- Migrate existing PasswordReset data to VerificationToken (optional)
-- Uncomment if you want to migrate existing data
-- INSERT INTO "VerificationToken" ("id", "userId", "email", "token", "type", "expiresAt", "usedAt", "createdAt")
-- SELECT 
--     pr."id",
--     pr."userId",
--     u."email",
--     pr."token",
--     'PASSWORD_RESET'::"TokenType",
--     pr."expiresAt",
--     pr."usedAt",
--     pr."createdAt"
-- FROM "PasswordReset" pr
-- JOIN "User" u ON pr."userId" = u."id"
-- WHERE NOT EXISTS (
--     SELECT 1 FROM "VerificationToken" vt WHERE vt."token" = pr."token"
-- );

-- Migrate existing EmailVerification data to VerificationToken (optional)
-- Uncomment if you want to migrate existing data
-- INSERT INTO "VerificationToken" ("id", "userId", "email", "token", "type", "expiresAt", "usedAt", "createdAt")
-- SELECT 
--     ev."id",
--     u."id" as "userId",
--     ev."email",
--     ev."token",
--     'EMAIL_VERIFY'::"TokenType",
--     ev."expiresAt",
--     ev."verifiedAt" as "usedAt",
--     ev."createdAt"
-- FROM "EmailVerification" ev
-- LEFT JOIN "User" u ON ev."email" = u."email"
-- WHERE NOT EXISTS (
--     SELECT 1 FROM "VerificationToken" vt WHERE vt."token" = ev."token"
-- );

-- Note: Keep PasswordReset and EmailVerification tables for backward compatibility
-- You can drop them later after confirming the migration is successful:
-- DROP TABLE IF EXISTS "PasswordReset";
-- DROP TABLE IF EXISTS "EmailVerification";
