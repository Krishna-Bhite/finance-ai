"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  Activity,
  RefreshCcw,
} from "lucide-react";

interface ExpenseByDate {
  date: string;
  total: number;
}

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
  expensesByDate: ExpenseByDate[];
}

const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#FF66C4", "#FF4444"];

const MONTHS = [
  { value: "1", label: "Jan" },
  { value: "2", label: "Feb" },
  { value: "3", label: "Mar" },
  { value: "4", label: "Apr" },
  { value: "5", label: "May" },
  { value: "6", label: "Jun" },
  { value: "7", label: "Jul" },
  { value: "8", label: "Aug" },
  { value: "9", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [month, setMonth] = useState<string>(`${new Date().getMonth() + 1}`);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const pageSize = 7;

  // ✅ Use total expenses trend instead of cashflow
  const chartData = useMemo(() => {
    if (!data?.expensesByDate) return [];
    return data.expensesByDate.map((d) => ({ name: d.date, total: d.total }));
  }, [data]);

  // ✅ Slice data into pages of 7
  const paginatedData = chartData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const hasPrev = currentPage > 0;
  const hasNext = (currentPage + 1) * pageSize < chartData.length;

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

  const percentageChange = (curr: number, prev: number) => {
    if (!prev || prev === 0) return "N/A";
    const diff = ((curr - prev) / prev) * 100;
    return `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%`;
  };

  // ✅ Filtered data for Expense Breakdown
  const filteredCategories =
    selectedCategory === "all"
      ? data?.expenseCategories ?? []
      : data?.expenseCategories.filter((c) => c.category === selectedCategory) ?? [];

  const selectedTotal =
    selectedCategory === "all"
      ? data?.totalExpenses ?? 0
      : data?.expenseCategories.find((c) => c.category === selectedCategory)?.total ?? 0;

  return (
    <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Real-time Dashboard
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Monitor your financial performance with AI-powered insights and
            predictive analytics
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 justify-center">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-black/40 border border-cyan-500/40 text-cyan-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 shadow-lg hover:scale-105 transition-transform"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
            <option value="all">All Months</option>
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-black/40 border border-cyan-500/40 text-cyan-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 shadow-lg hover:scale-105 transition-transform"
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
          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl shadow-md hover:scale-105 transition-transform disabled:opacity-50"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading && (
          <p className="text-gray-400 animate-pulse text-center">Loading...</p>
        )}

        {!loading && data && (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  title: "Total Revenue",
                  value: `₹${(data.totalRevenue ?? 0).toFixed(2)}`,
                  change: percentageChange(
                    data.totalRevenue ?? 0,
                    data.prevMonth?.totalRevenue ?? 0
                  ),
                  trend:
                    (data.prevMonth?.totalRevenue ?? 0) < (data.totalRevenue ?? 0)
                      ? "up"
                      : "down",
                  icon: DollarSign,
                  color: "text-green-400",
                },
                {
                  title: "Revenue Sources",
                  value: data.totalSources ?? 0,
                  change: "N/A",
                  trend: "up",
                  icon: Users,
                  color: "text-cyan-400",
                },
                {
                  title: "Total Expenses",
                  value: `₹${(data.totalExpenses ?? 0).toFixed(2)}`,
                  change: percentageChange(
                    data.totalExpenses ?? 0,
                    data.prevMonth?.totalExpenses ?? 0
                  ),
                  trend:
                    (data.prevMonth?.totalExpenses ?? 0) < (data.totalExpenses ?? 0)
                      ? "up"
                      : "down",
                  icon: CreditCard,
                  color: "text-purple-400",
                },
                {
                  title: "Savings",
                  value: `₹${(data.savings ?? 0).toFixed(2)}`,
                  change: percentageChange(
                    data.savings ?? 0,
                    data.prevMonth?.savings ?? 0
                  ),
                  trend:
                    (data.prevMonth?.savings ?? 0) < (data.savings ?? 0)
                      ? "up"
                      : "down",
                  icon: Activity,
                  color: "text-orange-400",
                },
              ].map((metric, i) => (
                <Card
                  key={i}
                  className="bg-black/40 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">
                          {metric.title}
                        </p>
                        <p className="text-2xl text-white mb-2">
                          {metric.value}
                        </p>
                        <div className="flex items-center">
                          {metric.trend === "up" ? (
                            <TrendingUp
                              className="text-green-400 mr-1"
                              size={16}
                            />
                          ) : (
                            <TrendingDown
                              className="text-red-400 mr-1"
                              size={16}
                            />
                          )}
                          <span
                            className={
                              metric.trend === "up"
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {metric.change}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                        <metric.icon className={metric.color} size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* ✅ Expense Trend */}
              <Card className="bg-black/40 backdrop-blur-md border border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex justify-between items-center">
                    Expense Trend
                    <div className="space-x-2">
                      <button
                        disabled={!hasPrev}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
                      >
                        Prev
                      </button>
                      <button
                        disabled={!hasNext}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-2 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paginatedData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={paginatedData}>
                        <defs>
                          <linearGradient
                            id="purpleGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8b5cf6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8b5cf6"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            border: "1px solid #8b5cf6",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="none"
                          fill="url(#purpleGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      No expense data
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ✅ Expense Breakdown with Filter */}
              <Card className="bg-black/40 backdrop-blur-md border border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex justify-between items-center">
                    Expense Breakdown
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="ml-4 bg-black/40 border border-cyan-500/40 text-cyan-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      {data.expenseCategories.map((c, idx) => (
                        <option key={idx} value={c.category}>
                          {c.category}
                        </option>
                      ))}
                    </select>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredCategories.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={filteredCategories}
                            dataKey="total"
                            nameKey="category"
                            outerRadius={100}
                            label={({ category, percent }) =>
                              `${category} ${
                                percent !== undefined
                                  ? (percent * 100).toFixed(0)
                                  : "0"
                              }%`
                            }
                          >
                            {filteredCategories.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              border: "1px solid #06b6d4",
                              borderRadius: "8px",
                              color: "white",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <p className="text-center text-cyan-300 mt-4">
                        Total for{" "}
                        {selectedCategory === "all"
                          ? "All Categories"
                          : selectedCategory}
                        : ₹{selectedTotal.toFixed(2)}
                      </p>
                    </>
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
              <Card className="mt-6 bg-black/40 backdrop-blur-md border-l-4 border-cyan-500/60 rounded-2xl">
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
    </section>
  );
}
