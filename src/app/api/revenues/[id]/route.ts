import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

type RouteParams = {
  params: { id: string };
};

// 🔹 Recalculate total
async function recalcRevenue(revenueId: string) {
  const sources = await prisma.revenueSource.findMany({ where: { revenueId } });
  const total = sources.reduce((sum, s) => sum + (s.amount || 0), 0);

  return prisma.revenue.update({
    where: { id: revenueId },
    data: { total },
    include: { sources: true },
  });
}

// ✅ PATCH (update revenue, update/add source)
export async function PATCH(req: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const action = searchParams.get("action");
  const body = await req.json();

  try {
    // 🔹 Update revenue (month/year)
    if (type === "revenue") {
      const revenue = await prisma.revenue.update({
        where: { id },
        data: {
          month: body.month,
          year: body.year,
        },
        include: { sources: true },
      });

      // 🔹 Update / Add sources inside same payload
      if (body.sources && Array.isArray(body.sources)) {
        for (const src of body.sources) {
          if (src.id) {
            await prisma.revenueSource.update({
              where: { id: src.id },
              data: {
                name: src.name,
                amount: Number(src.amount) || 0,
              },
            });
          } else {
            await prisma.revenueSource.create({
              data: {
                revenueId: id,
                name: src.name,
                amount: Number(src.amount) || 0,
              },
            });
          }
        }
      }

      return NextResponse.json(await recalcRevenue(id));
    }

    // 🔹 Update single source
    if (type === "revenueSource") {
      const source = await prisma.revenueSource.update({
        where: { id },
        data: {
          name: body.name,
          amount: Number(body.amount) || 0,
        },
      });
      return NextResponse.json(await recalcRevenue(source.revenueId));
    }

    // 🔹 Add new source explicitly
    if (action === "addSource") {
      await prisma.revenueSource.create({
        data: {
          revenueId: id,
          name: body?.name || "New Source",
          amount: Number(body?.amount) || 0,
        },
      });
      return NextResponse.json(await recalcRevenue(id));
    }

    return NextResponse.json({ error: "Invalid PATCH request" }, { status: 400 });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// ✅ DELETE (revenue OR source)
export async function DELETE(req: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "revenue") {
      await prisma.revenue.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (type === "revenueSource") {
      const source = await prisma.revenueSource.delete({ where: { id } });
      return NextResponse.json(await recalcRevenue(source.revenueId));
    }

    return NextResponse.json({ error: "Invalid type for DELETE" }, { status: 400 });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
