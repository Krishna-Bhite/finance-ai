import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// GET all goals for logged-in user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.goal.findMany({
    where: { user: { email: session.user.email } },
  });

  return NextResponse.json(goals);
}

// POST create goal for logged-in user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const goal = await prisma.goal.create({
    data: {
      name: body.name,
      description: body.description || null,
      neededMoney: body.neededMoney,
      currentMoney: body.currentMoney ?? 0,
      deadline: new Date(body.deadline),
      user: { connect: { email: session.user.email } },
    },
  });

  return NextResponse.json(goal);
}
