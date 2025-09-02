import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Expense = {
  id: string;
  date: string;
  amount: number;
  category: string;
  description?: string;
};

// GET for testing in browser
export async function GET() {
  return NextResponse.json({ message: "Insights API is live. Use POST with expenses data." });
}

// POST for actual insights
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { expenses } = body as { expenses: Expense[] };

    if (!expenses || expenses.length === 0) {
      return NextResponse.json({ insights: "No expenses found in this range." });
    }

    const totalSpend = expenses
      .filter((e) => e.category.toLowerCase() !== "income")
      .reduce((s, e) => s + Math.abs(Number(e.amount)), 0);

    const totalIncome = expenses
      .filter((e) => e.category.toLowerCase() === "income")
      .reduce((s, e) => s + Math.abs(Number(e.amount)), 0);

    const net = totalIncome - totalSpend;

    const systemPrompt = `
You are a helpful financial assistant. 
Given transaction data, provide:
1. Spending summary in plain English
2. Budget suggestions & savings tips
3. Flag abnormal or suspicious expenses (if any)
Keep the answer concise and in simple language. Currency is INR (₹).
    `;

    const userPrompt = `
Expenses Data:
${JSON.stringify(expenses, null, 2)}

Totals:
- Income: ₹${totalIncome}
- Spend: ₹${totalSpend}
- Net: ₹${net}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const insights =
      response.choices[0]?.message?.content ||
      "No insights generated. Try again.";

    return NextResponse.json({ insights });
  } catch (err: any) {
    console.error("Insights API Error:", err?.response?.data || err?.message || err);
    return NextResponse.json(
      { insights: "Error generating insights.", error: err.message },
      { status: 500 }
    );
  }
}
