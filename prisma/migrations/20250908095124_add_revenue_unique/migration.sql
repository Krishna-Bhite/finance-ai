/*
  Warnings:

  - A unique constraint covering the columns `[userId,month,year]` on the table `Revenue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Revenue_userId_month_year_key" ON "public"."Revenue"("userId", "month", "year");