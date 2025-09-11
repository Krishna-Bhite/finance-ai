import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// ✅ GET all goals for logged-in user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.goal.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });

  // 🔄 Map DB fields to frontend naming
  return NextResponse.json(
    goals.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      targetAmount: g.neededMoney,   // map from neededMoney
      currentAmount: g.currentMoney, // map from currentMoney
      deadline: g.deadline,
      createdAt: g.createdAt,
    }))
  );
}

// ✅ POST create goal for logged-in user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const goal = await prisma.goal.create({
      data: {
        name: body.name,
        description: body.description || null,
        neededMoney: body.targetAmount ?? 0,   // map from frontend targetAmount
        currentMoney: body.currentAmount ?? 0, // map from frontend currentAmount
        deadline: new Date(body.deadline),
        user: { connect: { email: session.user.email } },
      },
    });

    // 🔄 Return response with frontend-friendly fields
    return NextResponse.json({
      id: goal.id,
      name: goal.name,
      description: goal.description,
      targetAmount: goal.neededMoney,
      currentAmount: goal.currentMoney,
      deadline: goal.deadline,
      createdAt: goal.createdAt,
    });
  } catch (error: any) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
