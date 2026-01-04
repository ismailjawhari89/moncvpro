-- AlterTable
ALTER TABLE "CV" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "CV_deletedAt_idx" ON "CV"("deletedAt");
