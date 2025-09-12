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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    let month = searchParams.get("month"); // "all" or "1-12"
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json({ error: "Year is required" }, { status: 400 });
    }

    // Normalize month
    if (month && month !== "all") {
      month = String(parseInt(month, 10));
    }

    // Expense filter
    let expenseWhere: any = { userId: user.id };
    if (month && month !== "all") {
      const m = Number(month);
      expenseWhere.date = {
        gte: new Date(Number(year), m - 1, 1),
        lt: new Date(Number(year), m, 1),
      };
    } else {
      expenseWhere.date = {
        gte: new Date(Number(year), 0, 1),
        lt: new Date(Number(year) + 1, 0, 1),
      };
    }

    // Revenue filter
    let revenueWhere: any = { userId: user.id, year: Number(year) };
    if (month && month !== "all") {
      revenueWhere.month = Number(month);
    }

    const expenses = await prisma.expense.findMany({ where: expenseWhere });
    const revenues = await prisma.revenue.findMany({
      where: revenueWhere,
      include: { sources: true },
    });

    // Totals
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalRevenue = revenues.reduce((s, r) => s + r.total, 0);
    const totalSources = revenues.reduce((c, r) => c + r.sources.length, 0);
    const savings = totalRevenue - totalExpenses;

    // Previous month
    let prevMonthData: any = null;
    if (month && month !== "all") {
      const m = Number(month);
      if (m > 1) {
        const prevExpenses = await prisma.expense.findMany({
          where: {
            userId: user.id,
            date: {
              gte: new Date(Number(year), m - 2, 1),
              lt: new Date(Number(year), m - 1, 1),
            },
          },
        });
        const prevRevenues = await prisma.revenue.findMany({
          where: { userId: user.id, year: Number(year), month: m - 1 },
        });

        prevMonthData = {
          totalRevenue: prevRevenues.reduce((s, r) => s + r.total, 0),
          totalExpenses: prevExpenses.reduce((s, e) => s + e.amount, 0),
          savings:
            prevRevenues.reduce((s, r) => s + r.total, 0) -
            prevExpenses.reduce((s, e) => s + e.amount, 0),
        };
      }
    }

    // Expense breakdown
    const expenseCategoriesMap: Record<string, number> = {};
    for (const e of expenses) {
      expenseCategoriesMap[e.category] =
        (expenseCategoriesMap[e.category] || 0) + e.amount;
    }
    const expenseCategories = Object.entries(expenseCategoriesMap).map(
      ([category, total]) => ({ category, total })
    );

    // Expense trend
    let expensesByDate: { date: string; total: number }[] = [];
    if (month && month !== "all") {
      const m = Number(month);
      const daysInMonth = new Date(Number(year), m, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dailyExpense = expenses
          .filter((e) => new Date(e.date).getDate() === d)
          .reduce((s, e) => s + e.amount, 0);
        expensesByDate.push({ date: `${d}/${m}`, total: dailyExpense });
      }
    } else {
      for (let m = 1; m <= 12; m++) {
        const monthName = new Date(2000, m - 1).toLocaleString("default", {
          month: "short",
        });
        const monthlyExpense = expenses
          .filter((e) => new Date(e.date).getMonth() + 1 === m)
          .reduce((s, e) => s + e.amount, 0);
        expensesByDate.push({ date: monthName, total: monthlyExpense });
      }
    }

    return NextResponse.json({
      totalRevenue,
      totalSources,
      totalExpenses,
      savings,
      prevMonth: prevMonthData,
      expenseCategories,
      expensesByDate,
    });
  } catch (err: any) {
    console.error("analytics error", err);
    return NextResponse.json(
      { error: "Server error", detail: err.message },
      { status: 500 }
    );
  }
}
