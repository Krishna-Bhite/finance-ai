import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/revenues/[id] → fetch single revenue with sources
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const revenue = await prisma.revenue.findUnique({
      where: { id: params.id },
      include: { sources: true },
    });
    if (!revenue) {
      return NextResponse.json({ error: "Revenue not found" }, { status: 404 });
    }
    return NextResponse.json(revenue);
  } catch (err: any) {
    console.error("GET /api/revenues/[id] error:", err.message);
    return NextResponse.json({ error: "Failed to fetch revenue" }, { status: 500 });
  }
}

// PUT /api/revenues/[id] → update revenue & sources individually
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { month, year, sources, sourcesToDelete } = body;

    // Update revenue month/year first
    let revenue = await prisma.revenue.update({
      where: { id: params.id },
      data: { month, year },
    });

    // Delete any sources marked for deletion
    if (Array.isArray(sourcesToDelete)) {
      for (const sourceId of sourcesToDelete) {
        await prisma.revenueSource.delete({ where: { id: sourceId } });
      }
    }

    // Handle sources individually: update existing or create new
    for (const s of sources) {
      if (s.id) {
        await prisma.revenueSource.update({
          where: { id: s.id },
          data: { name: s.name, amount: Number(s.amount) || 0 },
        });
      } else {
        await prisma.revenueSource.create({
          data: { revenueId: revenue.id, name: s.name, amount: Number(s.amount) || 0 },
        });
      }
    }

    // Recalculate total
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
  } catch (err: any) {
    console.error("PUT /api/revenues/[id] error:", err.message);
    return NextResponse.json({ error: "Failed to update revenue" }, { status: 500 });
  }
}

// DELETE /api/revenues/[id] → delete revenue and its sources
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.revenue.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Revenue deleted successfully" });
  } catch (err: any) {
    console.error("DELETE /api/revenues/[id] error:", err.message);
    return NextResponse.json({ error: "Failed to delete revenue" }, { status: 500 });
  }
}
