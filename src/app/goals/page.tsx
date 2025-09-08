"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  // Fetch goals
  async function fetchGoals() {
    const res = await fetch("/api/goals");
    if (!res.ok) {
      console.error("Failed to fetch goals");
      return;
    }
    const data = await res.json();
    setGoals(data.map((g: any) => ({ ...g, id: g.id })));
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add goal
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

    if (!res.ok) {
      setError("Failed to add goal");
      return;
    }

    setName("");
    setDescription("");
    setNeededMoney("");
    setCurrentMoney("0");
    setDeadline(getToday());
    fetchGoals();
  }

  // Delete goal
  async function deleteGoal(id: string) {
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    fetchGoals();
  }

  // Start edit
  function startEdit(goal: Goal) {
    setEditingId(goal.id);
    setEditName(goal.name);
    setEditDescription(goal.description || "");
    setEditNeeded(goal.neededMoney.toString());
    setEditCurrent(goal.currentMoney.toString());
    setEditDeadline(goal.deadline.split("T")[0]);
  }

  // Save edit
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
    <main className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div>
        <Card className="mb-6 shadow-lg border border-gray-700 bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-lg text-blue-400">🎯 Add Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="text" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input type="number" placeholder="Needed Money" value={neededMoney} onChange={(e) => setNeededMoney(e.target.value)} />
            <Input type="number" placeholder="Current Money (default 0)" value={currentMoney} onChange={(e) => setCurrentMoney(e.target.value)} />
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

            <Button onClick={addGoal} className="w-full">Add Goal</Button>
          </CardContent>
        </Card>

        <h2 className="text-xl font-bold mb-3">📌 Your Goals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-md border border-gray-700 bg-neutral-800 hover:scale-[1.02] transition">
                  <CardContent className="flex justify-between items-start p-4">
                    {editingId === goal.id ? (
                      <div className="flex-1 space-y-2">
                        <Input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <Input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                        <Input type="number" value={editNeeded} onChange={(e) => setEditNeeded(e.target.value)} />
                        <Input type="number" value={editCurrent} onChange={(e) => setEditCurrent(e.target.value)} />
                        <Input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} />
                        <div className="flex gap-2">
                          <Button onClick={() => saveEdit(goal.id)} className="bg-green-600">Save</Button>
                          <Button onClick={() => setEditingId(null)} variant="secondary">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <strong>🎯 {goal.name}</strong><br />
                        Description: {goal.description || "—"}<br />
                        Needed: ${goal.neededMoney}<br />
                        Current: ${goal.currentMoney}<br />
                        <span className="text-xs text-gray-500">Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 ml-4">
                      {editingId !== goal.id && (
                        <Button onClick={() => startEdit(goal)} variant="outline" className="bg-yellow-400 text-black">Edit</Button>
                      )}
                      <Button onClick={() => deleteGoal(goal.id)} variant="destructive">Delete</Button>
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
