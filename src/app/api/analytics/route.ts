// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // find userId from email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // "all" or "1-12"
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json({ error: "Year is required" }, { status: 400 });
    }

    // filters
    let expenseWhere: any = { userId: user.id };
    let revenueWhere: any = { userId: user.id, year: Number(year) };

    if (month && month !== "all") {
      expenseWhere.AND = [
        { date: { gte: new Date(Number(year), Number(month) - 1, 1) } },
        { date: { lt: new Date(Number(year), Number(month), 1) } },
      ];
      revenueWhere.month = Number(month);
    }

    // fetch data
    const [expenses, revenues] = await Promise.all([
      prisma.expense.findMany({ where: expenseWhere }),
      prisma.revenue.findMany({ where: revenueWhere, include: { sources: true } }),
    ]);

    // totals
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = revenues.reduce((sum, r) => sum + r.total, 0);
    const totalSources = revenues.reduce((sum, r) => sum + r.sources.length, 0);
    const savings = totalRevenue - totalExpenses;

    // ✅ Group expenses by category
    const expenseCategoriesMap: Record<string, number> = {};
    for (const e of expenses) {
      expenseCategoriesMap[e.category] =
        (expenseCategoriesMap[e.category] || 0) + e.amount;
    }
    const expenseCategories = Object.entries(expenseCategoriesMap).map(
      ([category, total]) => ({ category, total })
    );

    // cashflow
    let cashflow: { x: string; total: number }[] = [];

    if (month && month !== "all") {
      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dailyRevenue = revenues
          .filter(r => r.month === Number(month) && r.year === Number(year))
          .reduce((sum, r) => sum + r.total, 0);

        const dailyExpense = expenses
          .filter(e => e.date.getDate() === d)
          .reduce((sum, e) => sum + e.amount, 0);

        cashflow.push({ x: `${d}/${month}`, total: dailyRevenue - dailyExpense });
      }
    } else {
      for (let m = 1; m <= 12; m++) {
        const monthName = new Date(2000, m - 1).toLocaleString("default", {
          month: "short",
        });

        const monthlyRevenue = revenues
          .filter(r => r.month === m && r.year === Number(year))
          .reduce((sum, r) => sum + r.total, 0);

        const monthlyExpense = expenses
          .filter(e => e.date.getMonth() + 1 === m)
          .reduce((sum, e) => sum + e.amount, 0);

        cashflow.push({ x: monthName, total: monthlyRevenue - monthlyExpense });
      }
    }

    // ✅ Previous month comparison (optional)
    let prevMonth: any = null;
    if (month && month !== "all") {
      const prev = Number(month) - 1;
      if (prev >= 1) {
        const prevExpenses = await prisma.expense.findMany({
          where: {
            userId: user.id,
            date: {
              gte: new Date(Number(year), prev - 1, 1),
              lt: new Date(Number(year), prev, 1),
            },
          },
        });
        const prevRevenues = await prisma.revenue.findMany({
          where: { userId: user.id, month: prev, year: Number(year) },
        });

        prevMonth = {
          totalRevenue: prevRevenues.reduce((s, r) => s + r.total, 0),
          totalExpenses: prevExpenses.reduce((s, e) => s + e.amount, 0),
          savings:
            prevRevenues.reduce((s, r) => s + r.total, 0) -
            prevExpenses.reduce((s, e) => s + e.amount, 0),
        };
      }
    }

    return NextResponse.json({
      totalRevenue,
      totalSources,
      totalExpenses,
      savings,
      cashflow,
      expenseCategories, // ✅ Now frontend will get this
      prevMonth,         // ✅ Comparison data
    });
  } catch (err: any) {
    console.error("analytics error", err);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}
