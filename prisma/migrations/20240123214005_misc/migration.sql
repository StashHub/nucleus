/*
  Warnings:

  - You are about to drop the column `ended` on the `Quarter` table. All the data in the column will be lost.
  - You are about to drop the column `started` on the `Quarter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ein]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `Phone` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `claimed_credits` on the `Affiliation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "postal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Affiliation" DROP COLUMN "claimed_credits",
ADD COLUMN     "claimed_credits" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "assigned_sdr" TEXT,
ADD COLUMN     "closed" TIMESTAMP(3),
ADD COLUMN     "estimated_refund" MONEY,
ADD COLUMN     "n8821_x_sent" DATE,
ADD COLUMN     "n8821_x_signed" DATE,
ALTER COLUMN "filing_type" DROP NOT NULL,
ALTER COLUMN "started" DROP NOT NULL,
ALTER COLUMN "created" DROP DEFAULT,
ALTER COLUMN "created" SET DATA TYPE TEXT,
ALTER COLUMN "associated_company_id" DROP NOT NULL,
ALTER COLUMN "revenue" DROP NOT NULL,
ALTER COLUMN "n941_x_sent" DROP NOT NULL,
ALTER COLUMN "n941_x_signed" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Covid" ALTER COLUMN "statement" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Guardian" ALTER COLUMN "consent" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "notes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Peo" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "fee" DROP NOT NULL,
ALTER COLUMN "funding" DROP NOT NULL,
ALTER COLUMN "started" DROP NOT NULL,
ALTER COLUMN "ended" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quarter" DROP COLUMN "ended",
DROP COLUMN "started",
ADD COLUMN     "coverage" TEXT,
ALTER COLUMN "affected" DROP NOT NULL,
ALTER COLUMN "negative" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_ein_key" ON "Company"("ein");

-- CreateIndex
CREATE UNIQUE INDEX "Phone_user_id_key" ON "Phone"("user_id");
