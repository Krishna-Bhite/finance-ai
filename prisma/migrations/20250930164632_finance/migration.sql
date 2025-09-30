/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Revenue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Revenue" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "public"."RevenueSource" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Saving" (
    "id" TEXT NOT NULL,
    "saving" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,

    CONSTRAINT "Saving_pkey" PRIMARY KEY ("id")
);
