import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// GET /api/revenues → fetch all revenues with sources
export async function GET() {
  try {
    const revenues = await prisma.revenue.findMany({
      include: { sources: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(Array.isArray(revenues) ? revenues : []);
  } catch (err) {
    console.error("GET /api/revenues error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/revenues → create or update revenue for a month/year
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { month, year, sources } = body;

    if (!month || !year) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find existing revenue for this user/month/year
    let revenue = await prisma.revenue.findFirst({
      where: { userId: user.id, month, year },
    });

    if (revenue) {
      // Revenue exists → update sources
      for (const s of sources) {
        if (s.id) {
          await prisma.revenueSource.update({
            where: { id: s.id },
            data: { name: s.name, amount: Number(s.amount) || 0 },
          });
        } else {
          await prisma.revenueSource.create({
            data: {
              revenueId: revenue.id,
              name: s.name,
              amount: Number(s.amount) || 0,
            },
          });
        }
      }
    } else {
      // Revenue doesn't exist → create new with sources
      revenue = await prisma.revenue.create({
        data: {
          userId: user.id,
          month,
          year,
          total: 0, // will update after sources
          sources: {
            create: sources.map((s: any) => ({
              name: s.name,
              amount: Number(s.amount) || 0,
            })),
          },
        },
        include: { sources: true },
      });
    }

    // Recalculate total
    const updatedSources = await prisma.revenueSource.findMany({
      where: { revenueId: revenue.id },
    });
    const total = updatedSources.reduce(
      (sum, s) => sum + (s.amount || 0),
      0
    );

    revenue = await prisma.revenue.update({
      where: { id: revenue.id },
      data: { total },
      include: { sources: true },
    });

    return NextResponse.json(revenue);
  } catch (err) {
    console.error("POST /api/revenues error:", err);
    return NextResponse.json(
      { error: "Failed to create or update revenue" },
      { status: 500 }
    );
  }
}
