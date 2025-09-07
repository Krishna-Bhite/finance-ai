// src/app/api/insights/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

const PROVIDER = process.env.LLM_PROVIDER || "";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// 🔑 Types for analytics
interface CategoryStat {
  category: string;
  total: number;
}
interface CashflowStat {
  date: string;
  total: number;
}
interface Anomaly {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  createdAt: Date;
  z: number;
}
interface Analytics {
  range: { start: Date; end: Date };
  total: number;
  count: number;
  avg: number;
  byCategory: CategoryStat[];
  cashflow: CashflowStat[];
  anomalies: Anomaly[];
}

// 🔄 Shared function: build analytics (same as /api/analytics)
async function buildAnalytics(userId: string, start: Date, end: Date): Promise<Analytics> {
  const expenses = await prisma.expense.findMany({
    where: { userId, createdAt: { gte: start, lte: end } },
    orderBy: { createdAt: "asc" },
  });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;
  const avg = count > 0 ? total / count : 0;

  const categoryMap = new Map<string, number>();
  for (const e of expenses) {
    categoryMap.set(e.category, (categoryMap.get(e.category) || 0) + e.amount);
  }
  const byCategory: CategoryStat[] = Array.from(categoryMap, ([category, total]) => ({ category, total }));

  const dailyMap = new Map<string, number>();
  for (const e of expenses) {
    const day = e.createdAt.toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) || 0) + e.amount);
  }
  const cashflow: CashflowStat[] = Array.from(dailyMap, ([date, total]) => ({ date, total }));

  const anomalies: Anomaly[] = avg > 0
    ? expenses.filter(e => e.amount > avg * 2).map(e => ({
        id: e.id,
        amount: e.amount,
        category: e.category,
        description: e.description,
        createdAt: e.createdAt,
        z: e.amount / avg,
      }))
    : [];

  return { range: { start, end }, total, count, avg, byCategory, cashflow, anomalies };
}

// 🔮 Ask LLM (Groq or OpenAI)
async function summarizeWithLLM(analytics: Analytics): Promise<string> {
  const prompt = `
You are a finance assistant. Using this JSON analytics, write:
1) A short spending summary in plain English
2) 3 budget suggestions
3) 3 savings tips
4) Any suspicious/abnormal patterns if anomalies exist

Analytics JSON:
${JSON.stringify(analytics, null, 2)}
`;

  if (PROVIDER.toLowerCase() === "groq" && GROQ_API_KEY) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // ✅ updated model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "No response from Groq";
  }

  if (PROVIDER.toLowerCase() === "openai" && OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "No response from OpenAI";
  }

  // 🛑 Fallback if no LLM
  return `No AI key configured.
Quick summary: Total spend $${analytics.total.toFixed(2)}, 
Top categories: ${
    analytics.byCategory && analytics.byCategory.length > 0
      ? analytics.byCategory
          .slice(0, 3)
          .map(c => `${c.category} $${c.total}`)
          .join(", ")
      : "N/A"
  }`;
}

// ✅ GET: AI Insights
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");

  const start = startStr ? new Date(startStr) : new Date(Date.now() - 30 * 864e5);
  const end = endStr ? new Date(endStr) : new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  const analytics = await buildAnalytics(user.id, start, end);
  const text = await summarizeWithLLM(analytics);

  return NextResponse.json({ text });
}
