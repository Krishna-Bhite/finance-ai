"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

// Types
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Add form states
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("In Progress");
  const [error, setError] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTargetAmount, setEditTargetAmount] = useState("");
  const [editCurrentAmount, setEditCurrentAmount] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editStatus, setEditStatus] = useState("In Progress");

  // Fetch goals
  async function fetchGoals() {
    const res = await fetch("/api/goals");
    const data = await res.json();
    setGoals(data);
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add Goal
  async function addGoal() {
    if (!name || !targetAmount || !deadline) {
      setError("⚠ Please enter Goal Name, Target Amount and Deadline!");
      return;
    }
    setError("");

    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        deadline,
        status,
      }),
    });

    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setDeadline(new Date().toISOString().split("T")[0]);
    setStatus("In Progress");
    fetchGoals();
  }

  // Delete Goal
  async function deleteGoal(id: string) {
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    fetchGoals();
  }

  // Start editing
  function startEdit(goal: Goal) {
    setEditingId(goal.id);
    setEditName(goal.name);
    setEditTargetAmount(goal.targetAmount.toString());
    setEditCurrentAmount(goal.currentAmount.toString());
    setEditDeadline(goal.deadline.split("T")[0]);
    setEditStatus(goal.status);
  }

  // Save edit
  async function saveEdit(id: string) {
    if (!editName || !editTargetAmount || !editDeadline) {
      setError("⚠ Please enter Goal Name, Target Amount and Deadline!");
      return;
    }
    setError("");

    await fetch(`/api/goals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        targetAmount: parseFloat(editTargetAmount),
        currentAmount: parseFloat(editCurrentAmount) || 0,
        deadline: editDeadline,
        status: editStatus,
      }),
    });

    setEditingId(null);
    await fetchGoals();
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Goals Management
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Define, track and achieve your financial goals
          </p>
        </div>

        {/* Add Goal Form */}
        <Card className="mb-12 bg-black/40 backdrop-blur-md border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">🎯 Add New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Goal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Target Amount"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Current Amount"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <Button
              onClick={addGoal}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
            >
              Add Goal
            </Button>
          </CardContent>
        </Card>

        {/* Goals Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100 || 0;
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <Card
                key={goal.id}
                className="bg-black/40 backdrop-blur-md border border-cyan-500/20"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-white flex justify-between items-center">
                    {editingId === goal.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      goal.name
                    )}
                    {isCompleted && (
                      <span className="ml-2 px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                        ✅ Completed
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Progress */}
                  <div className="mb-3 text-sm text-gray-300">
                    {editingId === goal.id ? (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={editCurrentAmount}
                          onChange={(e) => setEditCurrentAmount(e.target.value)}
                          placeholder="Current"
                        />
                        <Input
                          type="number"
                          value={editTargetAmount}
                          onChange={(e) => setEditTargetAmount(e.target.value)}
                          placeholder="Target"
                        />
                      </div>
                    ) : (
                      <p
                        className={`font-semibold ${
                          isCompleted ? "text-green-400" : "text-pink-400"
                        }`}
                      >
                        ₹{goal.currentAmount}{" "}
                        <span className="text-gray-400">/</span> ₹{goal.targetAmount}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-3 ${
                        isCompleted ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  {/* Deadline */}
                  <p className="text-gray-400 text-sm mt-3">
                    Deadline:{" "}
                    {editingId === goal.id ? (
                      <Input
                        type="date"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                      />
                    ) : (
                      new Date(goal.deadline).toLocaleDateString()
                    )}
                  </p>

                  {/* Actions */}
                                    {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    { editingId === goal.id ? (
                      <>
                        <Button
                          onClick={() => saveEdit(goal.id)}
                          className="bg-green-600 text-white"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-600 text-white"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        {!isCompleted && (
                          <Button
                            onClick={() => startEdit(goal)}
                            className="bg-sky-400 text-black"
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteGoal(goal.id)}
                          className="bg-violet-600 text-white"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No goals found.
          </div>
        )}
      </div>
    </section>
  );
}
