/*
  Warnings:

  - Made the column `deal_id` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "deal_id" SET NOT NULL;
