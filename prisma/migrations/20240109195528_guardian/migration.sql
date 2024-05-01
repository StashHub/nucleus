/*
  Warnings:

  - You are about to drop the column `tax_guardian_url` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "tax_guardian_url";

-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "consent" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_company_id_key" ON "Guardian"("company_id");

-- AddForeignKey
ALTER TABLE "Guardian" ADD CONSTRAINT "Guardian_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
