/*
  Warnings:

  - You are about to drop the column `ended` on the `PPP` table. All the data in the column will be lost.
  - You are about to drop the column `started` on the `PPP` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "estimated_refund" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "PPP" DROP COLUMN "ended",
DROP COLUMN "started",
ADD COLUMN     "coverage" TEXT,
ALTER COLUMN "disbursement" DROP NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "amount" SET DEFAULT 0;
