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
export async function PATCH(req: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params as { id: string };
    const body: ExpenseInput = await req.json();

    const data: Record<string, any> = {};
    if (body.amount !== undefined) data.amount = body.amount;
    if (body.category) data.category = body.category;
    if (body.description !== undefined) data.description = body.description;
    if (body.date) {
      const d = new Date(body.date);
      d.setUTCHours(0, 0, 0, 0);
      data.date = d;
    }

    const expense = await prisma.expense.update({
      where: { id },
      data,
    });

    return NextResponse.json(expense);
  } catch (err) {
    console.error("PATCH /api/expenses/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// ✅ DELETE (remove expense)
export async function DELETE(_req: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params as { id: string };

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/expenses/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
