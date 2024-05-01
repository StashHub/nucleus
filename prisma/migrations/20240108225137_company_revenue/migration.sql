/*
  Warnings:

  - You are about to drop the column `annual_income` on the `Company` table. All the data in the column will be lost.
  - Added the required column `revenue` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "annual_income",
ADD COLUMN     "revenue" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PPP" ALTER COLUMN "forgiven" DROP NOT NULL,
ALTER COLUMN "forgiven" SET DATA TYPE TEXT;
