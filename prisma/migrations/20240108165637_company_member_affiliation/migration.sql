/*
  Warnings:

  - You are about to drop the column `annual_income` on the `PPP` table. All the data in the column will be lost.
  - Added the required column `service_group` to the `Affiliation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `associated_company_id` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `n941xSent` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `n941xSigned` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payroll` to the `Member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `PPP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Affiliation" ADD COLUMN     "service_group" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "associated_company_id" TEXT NOT NULL,
ADD COLUMN     "n941xSent" DATE NOT NULL,
ADD COLUMN     "n941xSigned" DATE NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "tax_guardian_url" TEXT;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "notes" TEXT NOT NULL,
ADD COLUMN     "payroll" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "PPP" DROP COLUMN "annual_income",
ADD COLUMN     "amount" MONEY NOT NULL;
