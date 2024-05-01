-- CreateTable
CREATE TABLE "PPP" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "started" DATE NOT NULL,
    "ended" DATE NOT NULL,
    "disbursement" DATE NOT NULL,
    "annual_income" MONEY NOT NULL,
    "received" BOOLEAN NOT NULL,
    "forgiven" BOOLEAN NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "PPP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PPP" ADD CONSTRAINT "PPP_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
