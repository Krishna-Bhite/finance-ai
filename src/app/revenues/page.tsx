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
  // wrap async call
  const fetchData = async () => {
    await fetchRevenues();
  };
  fetchData();
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
    setSources(rev.sources.map((s) => ({ ...s }))); // keep id for update
    setEditingId(rev.id);
  }

  async function deleteRevenue(id: string) {
    if (!confirm("Are you sure you want to delete this revenue?")) return;
    await fetch(`/api/revenues/${id}`, { method: "DELETE" });
    fetchRevenues();
  }

  return (
    <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Revenue" : "Add Revenue"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {error && <p className="text-red-500">{error}</p>}

          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full border rounded-md p-2 bg-white text-black"
          >
            {monthNames.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>{name}</option>
            ))}
          </select>

          <Input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          <h4 className="font-medium">Revenue Sources</h4>
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
              />
            </div>
          ))}
          <Button variant="outline" onClick={() => setSources([...sources, { name: "", amount: 0 }])}>
            + Add Source
          </Button>

          <p className="font-medium text-green-600">Total: 💰 ${total.toFixed(2)}</p>

          <Button onClick={saveRevenue} className="w-full">
            {editingId ? "Update Revenue" : "Save Revenue"}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-3">Revenues</h2>
        <div className="space-y-3">
          {revenues.map((rev) => (
            <motion.div key={rev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <strong>{monthNames[rev.month - 1]} {rev.year}</strong> — 💰 ${rev.total.toFixed(2)}
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => editRevenue(rev)}>Edit</Button>
                      <Button variant="destructive" onClick={() => deleteRevenue(rev.id)}>Delete</Button>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-600 mt-2">
                    {rev.sources.map((s) => (
                      <li key={s.id}>{s.name}: ${s.amount.toFixed(2)}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
