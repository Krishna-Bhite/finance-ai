import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// ✅ GET all expenses with filters
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const category = searchParams.get("category");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json([], { status: 200 });

  const where: any = { userId: user.id };

  if (start && end) {
    where.date = {
      gte: new Date(start),
      lte: new Date(end),
    };
  }

  if (category) {
    where.category = category;
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: "asc" },
  });

  return NextResponse.json(expenses);
}

// ✅ POST create expense
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, category, description, date } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // normalize date → YYYY-MM-DD only
  const expenseDate = date ? new Date(date) : new Date();
  expenseDate.setUTCHours(0, 0, 0, 0);

  const expense = await prisma.expense.create({
    data: {
      userId: user.id,
      amount,
      category,
      description,
      date: expenseDate,
    },
  });

  return NextResponse.json(expense);
}
