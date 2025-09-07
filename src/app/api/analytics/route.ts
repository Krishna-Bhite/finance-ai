// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import  prisma  from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");

  const start = startStr ? new Date(startStr) : new Date(Date.now() - 30 * 864e5);
  const end = endStr ? new Date(endStr) : new Date();

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const expenses = await prisma.expense.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: start, lte: end },
    },
    orderBy: { createdAt: "asc" },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;
  const avg = count > 0 ? total / count : 0;

  // 📊 By Category
  const categoryMap = new Map<string, number>();
  for (const e of expenses) {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  }
  const byCategory = Array.from(categoryMap, ([category, total]) => ({ category, total }));

  // 💸 Cashflow (per day)
  const dailyMap = new Map<string, number>();
  for (const e of expenses) {
    const day = e.createdAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) || 0) + e.amount);
  }
  const cashflow = Array.from(dailyMap, ([date, total]) => ({ date, total }));

  // 🚨 Anomalies (expenses > 2 × avg)
  const anomalies = avg > 0
    ? expenses.filter(e => e.amount > avg * 2).map(e => ({
        id: e.id,
        amount: e.amount,
        category: e.category,
        description: e.description,
        createdAt: e.createdAt,
        z: e.amount / avg,
      }))
    : [];

  return NextResponse.json({
    range: { start: start.toISOString(), end: end.toISOString() },
    total,
    count,
    avg,
    byCategory,
    cashflow,
    anomalies,
  });
}
