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
  date: string; // new: comes from DB
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
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch expenses
  async function fetchExpenses() {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add expense
  async function addExpense() {
    if (!amount || !category) {
      setError("⚠ Please enter both Amount and Category!");
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
      }),
    });

    setAmount("");
    setCategory("");
    setDescription("");
    fetchExpenses();
  }

  // Delete expense
  async function deleteExpense(id: string) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  }

  // Start editing
  function startEdit(exp: Expense) {
    setEditingId(exp.id);
    setEditAmount(exp.amount.toString());
    setEditCategory(exp.category);
    setEditDescription(exp.description);
  }

  // Save edit
  async function saveEdit(id: string) {
    if (!editAmount || !editCategory) {
      setError("⚠ Please enter both Amount and Category!");
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
      }),
    });
    setEditingId(null);
    fetchExpenses();
  }

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left: Add Expense */}
      <div>
        <Card className="mb-6 shadow-lg border border-gray-700 bg-neutral-900">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-lg text-purple-400">
              ➕ Add Expense
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <Input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button onClick={addExpense} className="w-full">
              Add Expense
            </Button>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-3">📒 Your Expenses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {expenses.map((exp) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-md border border-gray-700 bg-neutral-800 hover:scale-[1.02] transition">
                  <CardContent className="flex justify-between items-start p-4">
                    {editingId === exp.id ? (
                      <div className="flex-1 space-y-2">
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
                        <div className="flex gap-2">
                          <Button
                            onClick={() => saveEdit(exp.id)}
                            className="bg-green-600"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setEditingId(null)}
                            variant="secondary"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <strong>
                          {categoryIcons[exp.category] || "💰"} {exp.category}
                        </strong>{" "}
                        — ${exp.amount} <br />
                        <span className="text-sm text-gray-400">
                          {exp.description || "No description"}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(exp.date).toISOString().split("T")[0]}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 ml-4">
                      {editingId !== exp.id && (
                        <Button
                          onClick={() => startEdit(exp)}
                          variant="outline"
                          className="bg-yellow-400 text-black"
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        onClick={() => deleteExpense(exp.id)}
                        variant="destructive"
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
      </div>
    </main>
  );
}
