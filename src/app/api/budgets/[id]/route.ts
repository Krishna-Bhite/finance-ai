import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; 
import prisma from "@/lib/prisma";

// GET single budget
export async function GET(
  req: Request,
  { params }: { params: Record<string, string> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const budget = await prisma.budget.findUnique({
    where: { id: params.id },
  });

  if (!budget) {
    return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  }

  return NextResponse.json(budget);
}

// PATCH (update budget)
export async function PATCH(
  req: Request,
  { params }: { params: Record<string, string> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, startDate, endDate } = body;

  const updated = await prisma.budget.update({
    where: { id: params.id },
    data: {
      amount: parseFloat(amount),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });

  return NextResponse.json(updated);
}

// DELETE budget
export async function DELETE(
  req: Request,
  { params }: { params: Record<string, string> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.budget.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
