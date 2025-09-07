"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from "recharts";

import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "next-themes";

type Cat = { category: string; total: number };
type Flow = { date: string; total: number };

interface Analytics {
  range: { start: string; end: string };
  total: number;
  count: number;
  avg: number;
  byCategory: Cat[];
  cashflow: Flow[];
  anomalies: Array<{ id: string; amount: number; category: string; description: string | null; createdAt: string; z: number }>;
}

const glass = "bg-white/5 border border-white/10 backdrop-blur shadow-lg";

export default function DashboardPage() {
  const { theme } = useTheme();              // ✅ inside component
  const isDark = theme === "dark";

  const COLORS = isDark
    ? ["#60a5fa", "#34d399", "#f87171", "#fbbf24"]
    : ["#3b82f6", "#10b981", "#ef4444", "#f59e0b"];

  const [start, setStart] = useState<string>(() => {
    const d = new Date(Date.now() - 29 * 864e5);
    return d.toISOString().slice(0, 10);
  });
  const [end, setEnd] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string>("");

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?start=${start}&end=${end}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  async function loadInsights() {
    setInsights("Generating insights...");
    const res = await fetch(`/api/insights?start=${start}&end=${end}`);
    const json = await res.json();
    setInsights(json.text || "No insights");
  }

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pieData = useMemo(
    () => (data?.byCategory || []).map((c) => ({ name: c.category, value: c.total })),
    [data]
  );

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">📊 Dashboard</h1>
        <ThemeToggle />
      </div>

      {/* Filters */}
      <Card className={glass}>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-1">
            <label className="text-sm opacity-80">Start date</label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="sm:col-span-1">
            <label className="text-sm opacity-80">End date</label>
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="sm:col-span-2 flex items-end gap-2">
            <Button onClick={loadAnalytics} disabled={loading}>
              {loading ? "Loading..." : "Apply"}
            </Button>
            <Button onClick={loadInsights} className="bg-purple-600">
              Generate Insights ✨
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Total Spend", value: `$${(data?.total ?? 0).toFixed(2)}` },
          { title: "Transactions", value: data?.count ?? 0 },
          { title: "Avg / Txn", value: `$${(data?.avg ?? 0).toFixed(2)}` },
          { title: "Categories", value: data?.byCategory?.length ?? 0 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={glass}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{item.value}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Card className={glass}>
            <CardHeader><CardTitle>Spending Breakdown</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie dataKey="value" data={pieData} outerRadius={90} isAnimationActive>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Cash Flow Trend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Card className={glass}>
            <CardHeader><CardTitle>Cash Flow Trend</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.cashflow || []}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#g1)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Anomalies + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={glass}>
          <CardHeader><CardTitle>Potential Anomalies (High Spends)</CardTitle></CardHeader>
          <CardContent>
            <AnimatePresence>
              {(data?.anomalies || []).length === 0 ? (
                <p className="opacity-70">No anomalies detected in the selected range.</p>
              ) : (
                <ul className="space-y-2">
                  {data!.anomalies.map((a) => (
                    <motion.li
                      key={a.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="p-3 rounded-md border border-white/10 bg-white/5"
                    >
                      <div className="font-medium">${a.amount.toFixed(2)} — {a.category}</div>
                      <div className="text-sm opacity-80">
                        {a.description || "No description"} · {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card className={glass}>
          <CardHeader><CardTitle>AI Insights</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={loadInsights} className="bg-purple-600">Regenerate</Button>
            <div className="whitespace-pre-wrap text-sm leading-6 opacity-90">
              {insights || "Click Generate Insights to fetch tips and summary."}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
