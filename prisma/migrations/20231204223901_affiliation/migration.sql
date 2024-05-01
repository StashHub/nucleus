/*
  Warnings:

  - Changed the type of `annual_income` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `Ownership` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "annual_income",
ADD COLUMN     "annual_income" MONEY NOT NULL,
ALTER COLUMN "started" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Ownership" ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Affiliation" (
    "id" TEXT NOT NULL,
    "fund_ownership" BOOLEAN NOT NULL,
    "ownership" BOOLEAN NOT NULL,
    "owner" BOOLEAN NOT NULL,
    "claimed_credits" TEXT[],
    "controlling_interest" BOOLEAN NOT NULL,
    "embargoed" BOOLEAN NOT NULL,
    "registered_bank" BOOLEAN NOT NULL,
    "govermental" BOOLEAN NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "Affiliation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Affiliation_company_id_key" ON "Affiliation"("company_id");

-- AddForeignKey
ALTER TABLE "Affiliation" ADD CONSTRAINT "Affiliation_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
