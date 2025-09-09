"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface Analytics {
  totalRevenue: number;
  totalSources: number;
  totalExpenses: number;
  savings: number;
  cashflow: { x: string; total: number }[];
  expenseCategories: { category: string; total: number }[];
  aiInsight?: string;
  prevMonth?: {
    totalRevenue: number;
    totalExpenses: number;
    savings: number;
  };
}

const COLORS = ["#00CFFF", "#00E6A8", "#FFBB28", "#FF66C4", "#9D6BFF", "#FF4444"];

const MONTHS = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?month=${month}&year=${year}`);
      if (!res.ok) {
        const txt = await res.text();
        console.error("analytics error", txt);
        setData(null);
      } else {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("fetch error", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [month, year]);

  const chartData = useMemo(() => {
    if (!data?.cashflow) return [];
    return data.cashflow.map((d) => ({ name: d.x, total: d.total }));
  }, [data]);

  const percentageChange = (curr: number, prev: number) => {
    if (!prev || prev === 0) return "N/A";
    const diff = ((curr - prev) / prev) * 100;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-[#05070e] via-[#0a0f1f] to-black text-gray-200">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
        Dashboard
      </h1>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-white/10 border border-cyan-500/40 text-cyan-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 shadow-lg hover:scale-105 transition-transform"
        >
          <option value="all">All Months</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-white/10 border border-cyan-500/40 text-cyan-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 shadow-lg hover:scale-105 transition-transform"
        >
          {Array.from({ length: 6 }, (_, i) => {
            const y = 2022 + i;
            return (
              <option key={y} value={y}>
                {y}
              </option>
            );
          })}
        </select>
      </div>

      {loading && <p className="text-gray-400 animate-pulse">Loading...</p>}
      {!loading && data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[{
              title: "Total Revenue",
              value: `₹${data.totalRevenue.toFixed(2)}`,
              color: "text-cyan-400",
              prev: data.prevMonth?.totalRevenue,
              curr: data.totalRevenue
            },{
              title: "Revenue Sources",
              value: data.totalSources,
              color: "text-violet-400"
            },{
              title: "Total Expenses",
              value: `₹${data.totalExpenses.toFixed(2)}`,
              color: "text-pink-400",
              prev: data.prevMonth?.totalExpenses,
              curr: data.totalExpenses
            },{
              title: "Savings",
              value: `₹${data.savings.toFixed(2)}`,
              color: "text-teal-400",
              prev: data.prevMonth?.savings,
              curr: data.savings
            }].map((kpi, i) => (
              <Card
                key={i}
                className="bg-white/5 backdrop-blur-md shadow-xl border border-white/10 hover:scale-105 hover:border-cyan-500/40 transition-transform duration-300 rounded-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-gray-300">{kpi.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  {kpi.prev !== undefined && (
                    <p className="text-sm text-gray-400">
                      {percentageChange(kpi.curr!, kpi.prev)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Line Chart */}
            <Card className="bg-white/5 backdrop-blur-md shadow-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-cyan-300">Cashflow Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#00E6A8"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#00CFFF" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart + Table */}
            <Card className="bg-white/5 backdrop-blur-md shadow-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-violet-300">Expense Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {data.expenseCategories?.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="h-64 w-full">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={data.expenseCategories}
                            dataKey="total"
                            nameKey="category"
                            outerRadius={100}
                            label
                          >
                            {data.expenseCategories.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              border: "1px solid #334155",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 w-full">
                      <h3 className="font-semibold mb-2 text-cyan-300">
                        Top 5 Categories
                      </h3>
                      <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-white/10 text-gray-300">
                            <th className="text-left p-2">Category</th>
                            <th className="text-right p-2">Amount (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.expenseCategories
                            .sort((a, b) => b.total - a.total)
                            .slice(0, 5)
                            .map((cat, i) => (
                              <tr
                                key={i}
                                className="border-t border-white/10 hover:bg-white/10 transition-colors"
                              >
                                <td className="p-2">{cat.category}</td>
                                <td className="p-2 text-right">
                                  {cat.total.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No expense data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI Insight */}
          {data.aiInsight && (
            <Card className="mt-6 bg-white/5 backdrop-blur-md shadow-xl border-l-4 border-cyan-500/60 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-cyan-400">AI Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 italic">{data.aiInsight}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}