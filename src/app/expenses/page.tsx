"use client";

import { useEffect, useState } from "react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch expenses from API
  async function fetchExpenses() {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add new expense
  async function addExpense() {
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(amount), category, description }),
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
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      {/* Add Expense Form */}
      <div className="space-y-2 mb-6">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={addExpense}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </div>

      {/* Expenses List */}
      <ul className="space-y-2">
        {expenses.map((exp) => (
          <li
            key={exp.id}
            className="flex justify-between items-start border p-2 rounded"
          >
            {editingId === exp.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="border p-1 w-full"
                />
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="border p-1 w-full"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-1 w-full"
                />
                <button
                  onClick={() => saveEdit(exp.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex-1">
                <strong>{exp.category}</strong> — ${exp.amount} <br />
                <span className="text-sm text-gray-500">{exp.description}</span>
              </div>
            )}

            <div className="flex flex-col gap-2 ml-4">
              {editingId !== exp.id && (
                <button
                  onClick={() => startEdit(exp)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => deleteExpense(exp.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
