"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

// Types
interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Category icons
const categoryIcons: Record<string, string> = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Other: "📌",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");

  async function fetchExpenses() {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function addExpense() {
    if (!amount || !category || !date) {
      setError("⚠ Please enter Amount, Category and Date!");
      return;
    }
    setError("");

    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(amount),
        category,
        description,
        date,
      }),
    });

    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    fetchExpenses();
  }

  async function deleteExpense(id: string) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  }

  function startEdit(exp: Expense) {
    setEditingId(exp.id);
    setEditAmount(exp.amount.toString());
    setEditCategory(exp.category);
    setEditDescription(exp.description);
    setEditDate(exp.date.split("T")[0]);
  }

  async function saveEdit(id: string) {
    if (!editAmount || !editCategory || !editDate) {
      setError("⚠ Please enter Amount, Category and Date!");
      return;
    }
    setError("");

    await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseFloat(editAmount),
        category: editCategory,
        description: editDescription,
        date: editDate,
      }),
    });

    setEditingId(null);
    fetchExpenses();
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-[#05070e] via-[#0a0f1f] to-black text-gray-200">
      {/* Add Expense Form */}
      <Card className="mb-8 shadow-xl border border-white/10 bg-white/5 backdrop-blur-lg rounded-2xl hover:shadow-cyan-500/20 transition-all">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-500 bg-clip-text text-transparent">
            ➕ Add New Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Category (e.g. Food, Travel)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Button onClick={addExpense} className="w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold rounded-xl shadow-md hover:shadow-pink-500/40 transition-transform hover:scale-[1.02]">
            Add Expense
          </Button>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        📒 Your Expenses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {expenses.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl hover:scale-[1.03] hover:border-cyan-400/40 transition-transform duration-300">
                <CardContent className="p-5 flex justify-between items-start">
                  {editingId === exp.id ? (
                    <div className="flex-1 space-y-3">
                      <Input
                        type="number"
                        step="0.01"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                      <Input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      />
                      <Input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <Input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                      <div className="flex gap-3">
                        <Button onClick={() => saveEdit(exp.id)} className="bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-md">
                          Save
                        </Button>
                        <Button onClick={() => setEditingId(null)} variant="secondary" className="bg-gray-600 hover:bg-gray-500 rounded-lg">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-200">
                        {categoryIcons[exp.category] || "💰"} {exp.category}
                      </p>
                      <p className="text-xl font-bold text-pink-400">₹{exp.amount}</p>
                      <p className="text-sm text-gray-400">{exp.description || "No description"}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(exp.date).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 ml-4">
                    {editingId !== exp.id && (
                      <Button
                        onClick={() => startEdit(exp)}
                        className="bg-yellow-400 text-black hover:bg-yellow-300 font-semibold rounded-lg"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      onClick={() => deleteExpense(exp.id)}
                      className="bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
