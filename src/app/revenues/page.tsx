"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import  Input  from "@/components/ui/input";
import  Button  from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // filter controls
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

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

  // filter by selected month/year
  const filteredRevenues = revenues.filter(
    (rev) => rev.month === filterMonth && rev.year === filterYear
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            💰 Revenues
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track, manage and analyze your revenue streams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add/Edit Revenue Form */}
          <Card className="backdrop-blur-xl bg-black/40 border border-green-400/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-green-400 text-lg">
                {editingId ? "✏️ Edit Revenue" : "➕ Add Revenue"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-red-400 text-sm">{error}</p>}

              {/* Month Selector */}
              <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
                <SelectTrigger className="bg-black/40 border-green-400/30 text-green-300">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-green-400/30">
                  {monthNames.map((name, idx) => (
                    <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year Input */}
              <Input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-black/40 border-green-400/30 text-green-300"
              />

              <h4 className="text-green-300">📊 Revenue Sources</h4>
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
                    className="bg-black/40 border-green-400/30 text-green-300"
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
                    className="bg-black/40 border-green-400/30 text-green-300"
                  />
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => setSources([...sources, { name: "", amount: 0 }])}
                className="border-green-500/40 text-green-300 hover:bg-green-500/20"
              >
                + Add Source
              </Button>

              <p className="font-medium text-green-400">
                Total: <span className="font-bold">${total.toFixed(2)}</span>
              </p>

              <Button
                onClick={saveRevenue}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              >
                {editingId ? "Update Revenue" : "Save Revenue"}
              </Button>
            </CardContent>
          </Card>

          {/* Revenue List with Filter */}
          <Card className="backdrop-blur-xl bg-black/40 border border-green-400/20 rounded-2xl">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-green-400">📑 Revenues</CardTitle>
                <div className="flex gap-2">
                  <Select
                    value={filterMonth.toString()}
                    onValueChange={(v) => setFilterMonth(Number(v))}
                  >
                    <SelectTrigger className="bg-black/40 border-green-400/30 text-green-300">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-green-400/30">
                      {monthNames.map((name, idx) => (
                        <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={filterYear}
                    onChange={(e) => setFilterYear(Number(e.target.value))}
                    className="w-28 bg-black/40 border-green-400/30 text-green-300"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRevenues.map((rev) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-black/30 border border-green-400/20 hover:border-green-400/50 transition-all rounded-2xl">
                      <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <strong className="text-green-300">
                            {monthNames[rev.month - 1]} {rev.year}
                          </strong>
                          <span className="text-green-400 font-bold">
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
              {filteredRevenues.length === 0 && (
                <p className="text-gray-400 text-center py-6">No revenues found for selected month/year.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
