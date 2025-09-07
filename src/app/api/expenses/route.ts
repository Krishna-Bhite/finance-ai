// src/app/api/expenses/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import  prisma from "@/lib/prisma";

// ✅ GET all expenses for logged-in user (with optional date range filters)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  const where: any = { userId: user.id };

  if (start && end) {
    where.createdAt = {
      gte: new Date(start),
      lte: new Date(end),
    };
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(expenses);
}

// ✅ POST create new expense
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, category, description } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const expense = await prisma.expense.create({
    data: {
      userId: user.id,
      amount,
      category,
      description,
    },
  });

  return NextResponse.json(expense);
}
