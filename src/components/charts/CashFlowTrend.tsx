"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { format } from "date-fns";

type Expense = { id: string; amount: number; date: string; category: string };
type Props = { data: Expense[] };

export default function CashFlowTrend({ data }: Props) {
  const points = Object.values(
    data.reduce((acc: any, e) => {
      const key = format(new Date(e.date), "yyyy-MM-dd");
      acc[key] = acc[key] || { date: key, income: 0, expense: 0, net: 0 };
      const amt = Number(e.amount);

      // 👇 classify based on category
      if (e.category.toLowerCase() === "income") {
        acc[key].income += Math.abs(amt);
      } else {
        acc[key].expense += Math.abs(amt);
      }

      acc[key].net = acc[key].income - acc[key].expense;
      return acc;
    }, {})
  );

  return (
    <div className="h-80">
      <ResponsiveContainer>
        <LineChart data={points}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#22C55E" />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" />
          <Line type="monotone" dataKey="net" stroke="#3B82F6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
