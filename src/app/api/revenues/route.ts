import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/revenues → fetch all revenues with sources
export async function GET() {
  try {
    const revenues = await prisma.revenue.findMany({
      include: { sources: true },
      orderBy: [
        { year: "desc" },
        { month: "desc" }
      ],
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

    if (!month || !year || !sources?.length) {
      return NextResponse.json(
        { error: "Missing required fields or sources" },
        { status: 400 }
      );
    }

    // Find existing revenue for user/month/year
    let revenue = await prisma.revenue.findFirst({
      where: { userId: user.id, month, year },
    });

    if (revenue) {
      // Update existing sources or create new ones
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
      revenue = await prisma.revenue.create({
        data: {
          userId: user.id,
          month,
          year,
          total: 0,
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

    // Calculate total after updates
    const updatedSources = await prisma.revenueSource.findMany({
      where: { revenueId: revenue.id },
    });
    const total = updatedSources.reduce((sum, s) => sum + (s.amount || 0), 0);

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