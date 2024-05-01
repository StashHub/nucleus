/*
  Warnings:

  - You are about to drop the column `n941xSent` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `n941xSigned` on the `Company` table. All the data in the column will be lost.
  - Added the required column `n941_x_sent` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `n941_x_signed` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "n941xSent",
DROP COLUMN "n941xSigned",
ADD COLUMN     "n941_x_sent" DATE NOT NULL,
ADD COLUMN     "n941_x_signed" DATE NOT NULL;
