"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

interface Goal {
  id: string;
  name: string;
  description: string | null;
  neededMoney: number;
  currentMoney: number;
  deadline: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const getToday = () => new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [neededMoney, setNeededMoney] = useState("");
  const [currentMoney, setCurrentMoney] = useState("0");
  const [deadline, setDeadline] = useState(getToday());
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editNeeded, setEditNeeded] = useState("");
  const [editCurrent, setEditCurrent] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  async function fetchGoals() {
    const res = await fetch("/api/goals");
    if (!res.ok) return;
    const data = await res.json();
    setGoals(data.map((g: any) => ({ ...g, id: g.id })));
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  async function addGoal() {
    if (!name || !neededMoney || !deadline) {
      setError("⚠ Please enter Name, Needed Money, and Deadline!");
      return;
    }
    setError("");

    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || null,
        neededMoney: parseFloat(neededMoney),
        currentMoney: parseFloat(currentMoney) || 0,
        deadline,
      }),
    });

    if (!res.ok) return;

    setName("");
    setDescription("");
    setNeededMoney("");
    setCurrentMoney("0");
    setDeadline(getToday());
    fetchGoals();
  }

  async function deleteGoal(id: string) {
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    fetchGoals();
  }

  function startEdit(goal: Goal) {
    setEditingId(goal.id);
    setEditName(goal.name);
    setEditDescription(goal.description || "");
    setEditNeeded(goal.neededMoney.toString());
    setEditCurrent(goal.currentMoney.toString());
    setEditDeadline(goal.deadline.split("T")[0]);
  }

  async function saveEdit(id: string) {
    if (!editName || !editNeeded || !editDeadline) {
      setError("⚠ Please enter Name, Needed Money, and Deadline!");
      return;
    }
    setError("");

    await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        description: editDescription || null,
        neededMoney: parseFloat(editNeeded),
        currentMoney: parseFloat(editCurrent) || 0,
        deadline: editDeadline,
      }),
    });

    setEditingId(null);
    fetchGoals();
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-[#0f172a] via-[#1a103d] to-black text-gray-100">
      {/* Add Goal Form */}
      <Card className="mb-8 shadow-2xl border border-purple-500/30 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
            🎯 Add Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="text" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input type="number" placeholder="Needed Money" value={neededMoney} onChange={(e) => setNeededMoney(e.target.value)} />
          <Input type="number" placeholder="Current Money (default 0)" value={currentMoney} onChange={(e) => setCurrentMoney(e.target.value)} />
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

          <Button onClick={addGoal} className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:opacity-90">
            Add Goal
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-fuchsia-500 bg-clip-text text-transparent">
        📌 Your Goals
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-lg border border-purple-500/30 bg-white/5 backdrop-blur-lg hover:scale-[1.02] transition-transform">
                <CardContent className="p-5 flex justify-between items-start">
                  {editingId === goal.id ? (
                    <div className="flex-1 space-y-3">
                      <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                      <Input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                      <Input type="number" value={editNeeded} onChange={(e) => setEditNeeded(e.target.value)} />
                      <Input type="number" value={editCurrent} onChange={(e) => setEditCurrent(e.target.value)} />
                      <Input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
                      <div className="flex gap-3">
                        <Button onClick={() => saveEdit(goal.id)} className="bg-green-600 text-white">Save</Button>
                        <Button onClick={() => setEditingId(null)} variant="secondary">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-2">
                      <p className="text-xl font-semibold text-purple-300">🎯 {goal.name}</p>
                      <p className="text-sm text-gray-400">{goal.description || "No description"}</p>
                      <p className="text-pink-400 font-bold">Needed: ₹{goal.neededMoney}</p>
                      <p className="text-green-400 font-bold">Current: ₹{goal.currentMoney}</p>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-fuchsia-500 to-purple-600 h-2"
                          style={{ width: `${Math.min((goal.currentMoney / goal.neededMoney) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 ml-4">
                    {editingId !== goal.id && (
                      <Button onClick={() => startEdit(goal)} className="bg-yellow-400 text-black">Edit</Button>
                    )}
                    <Button onClick={() => deleteGoal(goal.id)} className="bg-red-600 hover:bg-red-500">Delete</Button>
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
