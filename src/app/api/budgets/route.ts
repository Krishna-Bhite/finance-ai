// src/app/api/budgets/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // ✅ absolute import
import prisma from "@/lib/prisma";

// ✅ GET all budgets + spent amount
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  // Fetch budgets
  const budgets = await prisma.budget.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // For each budget, calculate spent
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (b) => {
      const spent = await prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          userId: user.id,
          createdAt: { gte: b.startDate, lte: b.endDate },
        },
      });

      const spentAmount = spent._sum.amount || 0;
      const percent = Math.min((spentAmount / b.amount) * 100, 100);

      return {
        ...b,
        spent: spentAmount,
        percent,
      };
    })
  );

  return NextResponse.json(budgetsWithSpent);
}

// ✅ POST new budget
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, startDate, endDate } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const budget = await prisma.budget.create({
    data: {
      userId: user.id,
      amount: parseFloat(amount),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return NextResponse.json(budget);
}
