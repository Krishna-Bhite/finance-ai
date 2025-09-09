"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface RevenueSource {
  id?: string;
  name: string;
  amount: number;
}

interface Revenue {
  id: string;
  month: number;
  year: number;
  total: number;
  sources: RevenueSource[];
}

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function RevenuesPage() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [sources, setSources] = useState<RevenueSource[]>([{ name: "", amount: 0 }]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRevenues();
  }, []);

  useEffect(() => {
    const sum = sources.reduce((acc, s) => acc + (s.amount || 0), 0);
    setTotal(sum);
  }, [sources]);

  async function fetchRevenues() {
    const res = await fetch("/api/revenues");
    const data = await res.json();
    setRevenues(data);
  }

  async function saveRevenue() {
    if (!month || !year || total <= 0) {
      setError("⚠ Please enter Month, Year, and at least one valid Source");
      return;
    }
    setError("");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/revenues/${editingId}` : "/api/revenues";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, year, sources }),
    });

    setSources([{ name: "", amount: 0 }]);
    setMonth(new Date().getMonth() + 1);
    setYear(new Date().getFullYear());
    setEditingId(null);
    fetchRevenues();
  }

  function editRevenue(rev: Revenue) {
    setMonth(rev.month);
    setYear(rev.year);
    setSources(rev.sources.map((s) => ({ ...s })));
    setEditingId(rev.id);
  }

  async function deleteRevenue(id: string) {
    if (!confirm("Are you sure you want to delete this revenue?")) return;
    await fetch(`/api/revenues/${id}`, { method: "DELETE" });
    fetchRevenues();
  }

  return (
    <main className="min-h-screen p-6 space-y-8 bg-gradient-to-br from-[#050510] via-[#0a0f1f] to-black text-gray-200">
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
        💰 Revenues
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add/Edit Revenue Form */}
        <Card className="backdrop-blur-xl bg-white/5 border border-green-400/30 shadow-xl hover:shadow-green-500/30 transition-all duration-300 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-400 tracking-wide">
              {editingId ? "✏️ Edit Revenue" : "➕ Add Revenue"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            {/* Month Selector */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-xl p-2 bg-black/40 border border-green-400/30 text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {monthNames.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>

            {/* Year Input */}
            <Input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-black/40 border-green-400/30 text-green-300 rounded-xl"
            />

            <h4 className="font-medium text-green-300">📊 Revenue Sources</h4>
            {sources.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Source Name"
                  value={s.name}
                  onChange={(e) => {
                    const copy = [...sources];
                    copy[idx].name = e.target.value;
                    setSources(copy);
                  }}
                  className="bg-black/40 border-green-400/30 text-green-300 rounded-xl"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={s.amount}
                  onChange={(e) => {
                    const copy = [...sources];
                    copy[idx].amount = Number(e.target.value);
                    setSources(copy);
                  }}
                  className="bg-black/40 border-green-400/30 text-green-300 rounded-xl"
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() => setSources([...sources, { name: "", amount: 0 }])}
              className="border-green-500/40 text-green-300 hover:bg-green-500/20 hover:scale-105 transition-transform"
            >
              + Add Source
            </Button>

            <p className="font-medium text-green-400 text-lg">
              Total: <span className="font-bold">${total.toFixed(2)}</span>
            </p>

            <Button
              onClick={saveRevenue}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] transition-transform text-white font-semibold rounded-xl shadow-lg"
            >
              {editingId ? "Update Revenue" : "Save Revenue"}
            </Button>
          </CardContent>
        </Card>

        {/* Revenue List */}
        <div>
          <h2 className="text-xl font-bold text-green-400 mb-3">📑 Revenues</h2>
          <div className="space-y-3">
            {revenues.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="backdrop-blur-xl bg-white/5 border border-green-400/20 hover:border-green-400/50 transition-all duration-300 shadow-md rounded-2xl">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <strong className="text-green-300 text-lg">
                        {monthNames[rev.month - 1]} {rev.year}
                      </strong>
                      <span className="text-green-400 font-bold text-lg">
                        💰 ${rev.total.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => editRevenue(rev)}
                          className="border-green-500/40 text-green-300 hover:bg-green-500/20"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteRevenue(rev.id)}
                          className="hover:scale-105 transition-transform"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-400 mt-1 pl-3 list-disc">
                      {rev.sources.map((s) => (
                        <li key={s.id}>
                          <span className="text-green-200">{s.name}</span>: ${s.amount.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}