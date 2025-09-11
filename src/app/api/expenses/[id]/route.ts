import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

interface ExpenseInput {
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
}

// ✅ PATCH (update expense)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: ExpenseInput = await req.json();

  const data: any = {};
  if (body.amount !== undefined) data.amount = body.amount;
  if (body.category) data.category = body.category;
  if (body.description !== undefined) data.description = body.description;
  if (body.date) {
    const d = new Date(body.date);
    d.setUTCHours(0, 0, 0, 0);
    data.date = d;
  }

  const expense = await prisma.expense.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(expense);
}

// ✅ DELETE (remove expense)
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.expense.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
