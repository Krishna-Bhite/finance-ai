import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// PATCH update goal
export async function PATCH(
  req: Request,
  context: any
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { params } = context;
  const body = await req.json();

  // Verify ownership
  const goal = await prisma.goal.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!goal || goal.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Map frontend fields to DB fields
  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.targetAmount !== undefined) data.neededMoney = body.targetAmount;
  if (body.currentAmount !== undefined) data.currentMoney = body.currentAmount;
  if (body.deadline !== undefined) data.deadline = new Date(body.deadline);

  const updatedGoal = await prisma.goal.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(updatedGoal);
}

// DELETE goal
export async function DELETE(
  _: Request,
  context: any
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { params } = context;

  const goal = await prisma.goal.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!goal || goal.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.goal.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
