/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone";

-- CreateTable
CREATE TABLE "Phone" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT,
    "user_id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
