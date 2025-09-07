import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// Define Expense input type (for POST body)
interface ExpenseInput {
  amount: number;
  category: string;
  description?: string;
}

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

  const where: {
    userId: string;
    createdAt?: { gte: Date; lte: Date };
  } = { userId: user.id };

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

  const body: ExpenseInput = await req.json();
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

// ✅ PATCH (edit/update expense by ID)
export async function PATCH(req: Request, context: any) {
  const { id } = context.params as { id: string };
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Partial<ExpenseInput> = await req.json();

  const updated = await prisma.expense.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

// ✅ DELETE expense by ID
export async function DELETE(req: Request, context: any) {
  const { id } = context.params as { id: string };
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.expense.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
