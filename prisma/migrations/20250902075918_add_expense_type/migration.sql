-- CreateEnum
CREATE TYPE "public"."ExpenseType" AS ENUM ('income', 'expense');

-- AlterTable
ALTER TABLE "public"."Expense" ADD COLUMN     "type" "public"."ExpenseType" NOT NULL DEFAULT 'expense';
