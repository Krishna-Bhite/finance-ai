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

    // ✅ Expenses filter (uses date field)
    let expenseWhere: any = { userId: user.id };
    if (month && month !== "all") {
      expenseWhere.AND = [
        { date: { gte: new Date(Number(year), Number(month) - 1, 1) } },
        { date: { lt: new Date(Number(year), Number(month), 1) } },
      ];
    } else {
      expenseWhere.AND = [
        { date: { gte: new Date(Number(year), 0, 1) } },
        { date: { lt: new Date(Number(year) + 1, 0, 1) } },
      ];
    }

    // ✅ Revenue filter (uses month/year, not date)
    let revenueWhere: any = { userId: user.id, year: Number(year) };
    if (month && month !== "all") {
      revenueWhere.month = Number(month);
    }

    // ✅ Fetch data
    const expenses = await prisma.expense.findMany({ where: expenseWhere });
    const revenues = await prisma.revenue.findMany({
      where: revenueWhere,
      include: { sources: true }, // get breakdown
    });

    // ✅ Totals
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = revenues.reduce((sum, r) => sum + r.total, 0);
    const totalSources = revenues.reduce(
      (count, r) => count + r.sources.length,
      0
    );
    const savings = totalRevenue - totalExpenses;

    // ✅ Previous month comparison
    let prevMonthData: any = null;
    if (month && month !== "all") {
      const prevMonth = Number(month) - 1;
      if (prevMonth >= 1) {
        const prevExpenses = await prisma.expense.findMany({
          where: {
            userId: user.id,
            date: {
              gte: new Date(Number(year), prevMonth - 1, 1),
              lt: new Date(Number(year), prevMonth, 1),
            },
          },
        });
        const prevRevenues = await prisma.revenue.findMany({
          where: { userId: user.id, year: Number(year), month: prevMonth },
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

    // ✅ Expense breakdown by category
    const expenseCategoriesMap: Record<string, number> = {};
    for (const e of expenses) {
      expenseCategoriesMap[e.category] =
        (expenseCategoriesMap[e.category] || 0) + e.amount;
    }
    const expenseCategories = Object.entries(expenseCategoriesMap).map(
      ([category, total]) => ({ category, total })
    );

    // ✅ Expense trend (daily if month selected, else monthly)
    let expensesByDate: { date: string; total: number }[] = [];
    if (month && month !== "all") {
      const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dailyExpense = expenses
          .filter((e) => e.date.getDate() === d)
          .reduce((sum, e) => sum + e.amount, 0);
        expensesByDate.push({ date: `${d}/${month}`, total: dailyExpense });
      }
    } else {
      for (let m = 1; m <= 12; m++) {
        const monthName = new Date(2000, m - 1).toLocaleString("default", {
          month: "short",
        });
        const monthlyExpense = expenses
          .filter((e) => e.date.getMonth() + 1 === m)
          .reduce((sum, e) => sum + e.amount, 0);
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
