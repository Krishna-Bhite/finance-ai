// src/app/api/expenses/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// PATCH update expense
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, category, description } = body;

  const expense = await prisma.expense.update({
    where: { id },
    data: { amount, category, description },
  });

  return NextResponse.json(expense);
}

// DELETE expense
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.expense.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
