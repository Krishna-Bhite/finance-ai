"use client";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

type Expense = { id: string; amount: number; category: string };
type Props = { data: Expense[] };

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F97316",
  "#06B6D4",
  "#EAB308",
  "#EC4899",
  "#8B5CF6",
];

export default function SpendingBreakdown({ data }: Props) {
  // 👇 exclude income and group by category
  const totals = Object.values(
    data
      .filter((d) => d.category.toLowerCase() !== "income")
      .reduce((acc: any, e) => {
        acc[e.category] = acc[e.category] || { name: e.category, value: 0 };
        acc[e.category].value += Math.abs(e.amount);
        return acc;
      }, {})
  );

  return (
    <div className="h-80">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            data={totals}
            outerRadius={100}
            nameKey="name"
            animationDuration={800}
          >
            {totals.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
