import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

type RouteParams = { params: { id: string } };

// PATCH update goal
export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Find goal and verify email ownership
  const goal = await prisma.goal.findUnique({
    where: { id: params.id },
    include: { user: true },
  });

  if (!goal || goal.user.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.neededMoney !== undefined) data.neededMoney = body.neededMoney;
  if (body.currentMoney !== undefined) data.currentMoney = body.currentMoney;
  if (body.deadline !== undefined) data.deadline = new Date(body.deadline);

  const updatedGoal = await prisma.goal.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(updatedGoal);
}

// DELETE goal
export async function DELETE(_: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
