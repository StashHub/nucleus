/*
  Warnings:

  - A unique constraint covering the columns `[company_id]` on the table `Covid` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `Covid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Covid" ADD COLUMN     "company_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Covid_company_id_key" ON "Covid"("company_id");

-- AddForeignKey
ALTER TABLE "Covid" ADD CONSTRAINT "Covid_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
