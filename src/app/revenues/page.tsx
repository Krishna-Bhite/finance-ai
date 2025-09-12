"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  useEffect(() => { fetchRevenues(); }, []);
  useEffect(() => {
    const sum = sources.reduce((acc, s) => acc + (s.amount || 0), 0);
    setTotal(sum);
  }, [sources]);

  async function fetchRevenues() {
    const res = await fetch("/api/revenues");
    const data = await res.json();
    setRevenues(data);
  }

  function addSource() {
    setSources(prev => [...prev, { name: "", amount: 0 }]);
  }

  async function saveRevenue() {
    try {
      if (!month || !year || sources.length === 0 || total <= 0) {
        setError("⚠ Please enter Month, Year, and at least one valid Source");
        return;
      }

      const validSources = sources.filter(s => s.name.trim() !== "" && s.amount > 0);
      if (validSources.length === 0) {
        setError("⚠ Please add at least one valid source with name and amount");
        return;
      }

      const payload = {
        month: Number(month),
        year: Number(year),
        sources: validSources.map(s => ({
          id: s.id || undefined,
          name: s.name.trim(),
          amount: Number(s.amount)
        }))
      };

      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `/api/revenues/${editingId}?type=revenue`
        : "/api/revenues";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save revenue");

      // Reset form
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
      setSources([{ name: "", amount: 0 }]);
      setEditingId(null);
      setError("");

      await fetchRevenues();
    } catch (error: any) {
      console.error("Save revenue error:", error);
      setError(error.message || "Failed to save revenue. Please try again.");
    }
  }

  function editRevenue(rev: Revenue) {
    setMonth(rev.month);
    setYear(rev.year);
    setSources(rev.sources.map(s => ({ id: s.id, name: s.name, amount: s.amount })));
    setEditingId(rev.id);
  }

  async function deleteRevenue(id: string) {
    await fetch(`/api/revenues/${id}?type=revenue`, { method: "DELETE" });
    fetchRevenues();
  }

  async function deleteSource(idx: number, source: RevenueSource) {
    if (editingId && source.id) {
      await fetch(`/api/revenues/${source.id}?type=revenueSource`, { method: "DELETE" });
      fetchRevenues();
    }
    setSources(prev => prev.filter((_, i) => i !== idx));
  }

  const filteredRevenues = revenues.filter(
    rev => rev.month === filterMonth && rev.year === filterYear
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            💰 Revenues
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track, manage and analyze your revenue streams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form */}
          <Card className="mb-8 backdrop-blur-xl bg-black/40 border border-green-400/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-green-400">
                {editingId ? "✏️ Edit Revenue" : "➕ Add Revenue"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
                <SelectTrigger className="bg-black/40 border-green-400/30 text-green-300">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-green-400/30 text-green-300" >
                  {monthNames.map((name, idx) => (
                    <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-black/40 border-green-400/30 text-green-300"
              />

              <h4 className="text-green-300">📊 Revenue Sources</h4>
              {sources.map((s, idx) => (
                <div key={s.id || idx} className="flex gap-2 items-center">
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
                  <Button variant="destructive" size="sm" onClick={() => deleteSource(idx, s)}>
                    ✕
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={addSource}>
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

          {/* Revenue List */}
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
                    <SelectContent className="bg-black/90 border-green-400/30 text-green-300">
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
                              className="border-red-500/40 text-red-300 hover:bg-red-500/20"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {rev.sources.map((source) => (
                            <div key={source.id} className="text-sm text-gray-400">
                              {source.name}: ${source.amount.toFixed(2)}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
