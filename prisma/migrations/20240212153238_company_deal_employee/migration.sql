/*
  Warnings:

  - You are about to drop the column `assigned_sdr` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `associated_company_id` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `awaiting_refund_date` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `closed` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `deal_id` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_refund` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Company` table. All the data in the column will be lost.
  - The `created` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `number_of_employees_2019` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_employees_2020` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_employees_2021` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_parttime_employees_2019` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_parttime_employees_2020` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_of_parttime_employees_2021` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_company_id_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "assigned_sdr",
DROP COLUMN "associated_company_id",
DROP COLUMN "awaiting_refund_date",
DROP COLUMN "closed",
DROP COLUMN "deal_id",
DROP COLUMN "estimated_refund",
DROP COLUMN "source",
ADD COLUMN     "number_of_employees_2019" INTEGER NOT NULL,
ADD COLUMN     "number_of_employees_2020" INTEGER NOT NULL,
ADD COLUMN     "number_of_employees_2021" INTEGER NOT NULL,
ADD COLUMN     "number_of_parttime_employees_2019" INTEGER NOT NULL,
ADD COLUMN     "number_of_parttime_employees_2020" INTEGER NOT NULL,
ADD COLUMN     "number_of_parttime_employees_2021" INTEGER NOT NULL,
DROP COLUMN "created",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Employee";

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cloned" TEXT,
    "pipeline" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "hubspot_owner" TEXT,
    "hubspot_contact_id" TEXT,
    "estimated_refund" MONEY DEFAULT 0,
    "awaiting_refund_date" DATE,
    "closed" TIMESTAMP(3),
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deal_company_id_key" ON "Deal"("company_id");

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
