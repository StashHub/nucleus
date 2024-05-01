/*
  Warnings:

  - Added the required column `updated` to the `Affiliation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payroll` to the `Ownership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `PPP` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Peo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Affiliation" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ownership" ADD COLUMN     "payroll" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "PPP" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Peo" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "emp_2019" INTEGER,
    "emp_2020" INTEGER,
    "emp_2021" INTEGER,
    "pt_2019" INTEGER,
    "pt_2020" INTEGER,
    "pt_2021" INTEGER,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Covid" (
    "id" TEXT NOT NULL,
    "disruption" TEXT[],
    "statement" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Covid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quarter" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "affected" BOOLEAN NOT NULL,
    "negative" BOOLEAN NOT NULL,
    "started" DATE NOT NULL,
    "ended" DATE NOT NULL,
    "covid_id" TEXT NOT NULL,

    CONSTRAINT "Quarter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_company_id_key" ON "Employee"("company_id");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Ownership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quarter" ADD CONSTRAINT "Quarter_covid_id_fkey" FOREIGN KEY ("covid_id") REFERENCES "Covid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
