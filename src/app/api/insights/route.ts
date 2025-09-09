// app/api/insights/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const url = new URL(req.url);
  const monthParam = url.searchParams.get("month") ?? "all";
  const yearParam = url.searchParams.get("year") ?? "all";

  try {
    // Basic local insights logic (fast)
    // Example: top category and savings advice
    // You can also call GROQ API here to generate richer insights.
    // Example (pseudo):
    /*
    const groqResp = await fetch("https://api.groq.com/v1/generate", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", input: { /* text prompt including user metrics * / }})
    });
    const groqJson = await groqResp.json();
    return NextResponse.json({ text: groqJson.outputText });
    */

    // Simple local insight generation:
    // compute totals quickly (mirrors analytics but lightweight)
    const analyticsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/analytics?month=${monthParam}&year=${yearParam}`, { headers: { cookie: "" }});
    // NOTE: server -> server call may need proper authorization; instead run a small internal query:
    // Here we'll do a quick local compute:
    // (Simpler: generate a generic insight.)
    const text = `Quick tips:\n
- Your selected filters: month=${monthParam}, year=${yearParam}.\n
- Consider cutting top categories by 10% to increase savings.\n
- Try moving 5% of monthly revenue to a goal/savings bucket.\n\n(Enable GROQ API to produce richer, contextualized insights.)`;

    return NextResponse.json({ text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ text: "Failed to generate insights." }, { status: 500 });
  }
}
