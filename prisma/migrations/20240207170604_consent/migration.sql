-- AlterTable
ALTER TABLE "User" ADD COLUMN     "consent" TIMESTAMP(3) NULL,
ADD COLUMN     "consent_signature" TEXT NULL;
