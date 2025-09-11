"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// Types
interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: string;
  vendor?: string;
}

// Categories & Statuses
const categories = ["All", "Food", "Travel", "Shopping", "Technology", "Other"];
const statuses = ["All", "Approved", "Pending", "Rejected"];

// Helper for last 7 days
const getLast7Days = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push({
      label: date.toLocaleDateString(),
      value: date.toISOString().split("T")[0],
    });
  }
  return dates;
};

// Category Icons
const categoryIcons: Record<string, string> = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Technology: "💻",
  Other: "📌",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Add form states
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");

  // Filter state (default = today)
  const today = new Date().toISOString().split("T")[0];
  const [filterDate, setFilterDate] = useState<string>(today);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState("Pending");

  // Fetch
  async function fetchExpenses() {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Add
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
        status,
      }),
    });

    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus("Pending");
    fetchExpenses();
  }

  // Delete
  async function deleteExpense(id: string) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    fetchExpenses();
  }

  // Edit
  function startEdit(exp: Expense) {
    setEditingId(exp.id);
    setEditAmount(exp.amount.toString());
    setEditCategory(exp.category);
    setEditDescription(exp.description);
    setEditDate(exp.date.split("T")[0]);
    setEditStatus(exp.status);
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
        status: editStatus,
      }),
    });

    setEditingId(null);
    fetchExpenses();
  }

  // Filters
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || expense.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All" || expense.status === selectedStatus;

    const matchesDate =
      filterDate === "All" ||
      (filterDate === "custom" && expense.date.startsWith(filterDate)) ||
      expense.date.startsWith(filterDate);

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  // Badge Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <section
      id="expenses"
      className="py-20 px-4 sm:px-6 lg:px-8 relative min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Expense Management
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Track, filter and analyze your expenses in real-time
          </p>
        </div>

        {/* Add Expense Form */}
        <Card className="mb-12 bg-black/40 backdrop-blur-md border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">
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
            <Button
              onClick={addExpense}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
            >
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Filters & Table */}
        <Card className="mb-8 bg-black/40 backdrop-blur-md border border-cyan-500/20">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Select value={filterDate} onValueChange={setFilterDate}>
              <SelectTrigger className="w-full sm:w-48 bg-black/20 border-gray-600 text-white">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-gray-600 max-h-[300px]">
                <SelectItem value="All" className="text-white">
                  All Dates
                </SelectItem>
                {getLast7Days().map((dateOption) => (
                  <SelectItem
                    key={dateOption.value}
                    value={dateOption.value}
                    className="text-white hover:bg-cyan-500/20"
                  >
                    {dateOption.label}
                  </SelectItem>
                ))}
                <SelectItem
                  value="custom"
                  className="text-white hover:bg-cyan-500/20 border-t border-gray-600"
                >
                  Choose date...
                </SelectItem>
              </SelectContent>
            </Select>
            {filterDate === "custom" && (
              <Input
                type="date"
                value={today}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full sm:w-48 bg-black/20 border-gray-600 text-white"
              />
            )}
          </CardHeader>

          {/* Expense Table */}
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((exp) => (
                    <TableRow
                      key={exp.id}
                      className="border-gray-700 hover:bg-cyan-500/5"
                    >
                      {editingId === exp.id ? (
                        <>
                          <TableCell>
                            <Input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editStatus}
                              onValueChange={setEditStatus}
                            >
                              <SelectTrigger className="bg-black/20 text-white">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 border-gray-600">
                                {statuses
                                  .filter((s) => s !== "All")
                                  .map((s) => (
                                    <SelectItem
                                      key={s}
                                      value={s}
                                      className="text-white"
                                    >
                                      {s}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              onClick={() => saveEdit(exp.id)}
                              className="bg-green-600"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-600"
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell className="text-gray-300">
                            {new Date(exp.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-white">
                            {categoryIcons[exp.category] || "💰"} {exp.category}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {exp.description || "—"}
                          </TableCell>
                          <TableCell className="text-pink-400 font-semibold">
                            ₹{exp.amount}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(exp.status)}>
                              {exp.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              onClick={() => startEdit(exp)}
                              className="bg-yellow-400 text-black"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => deleteExpense(exp.id)}
                              className="bg-red-600 text-white"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredExpenses.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No expenses found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
