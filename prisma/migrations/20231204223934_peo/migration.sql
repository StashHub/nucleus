-- CreateTable
CREATE TABLE "Peo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "uses_own_ein" BOOLEAN NOT NULL,
    "collaborates" BOOLEAN NOT NULL,
    "requires_erc" BOOLEAN NOT NULL,
    "requested_erc" BOOLEAN NOT NULL,
    "fee" TEXT NOT NULL,
    "funding" TEXT NOT NULL,
    "started" DATE NOT NULL,
    "ended" DATE NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "Peo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Peo_company_id_key" ON "Peo"("company_id");

-- AddForeignKey
ALTER TABLE "Peo" ADD CONSTRAINT "Peo_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
