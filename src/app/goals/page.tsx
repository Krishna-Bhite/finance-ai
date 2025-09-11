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

// Types
interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: string;
}

// Status options
const statuses = ["All", "In Progress", "Completed", "On Hold"];

// Badge Colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "In Progress":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "On Hold":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);

  // Add form states
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("In Progress");
  const [error, setError] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTargetAmount, setEditTargetAmount] = useState("");
  const [editCurrentAmount, setEditCurrentAmount] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editStatus, setEditStatus] = useState("In Progress");

  // Fetch
  async function fetchGoals() {
    const res = await fetch("/api/goals");
    const data = await res.json();
    setGoals(data);
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add
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

  // Delete
  async function deleteGoal(id: string) {
    await fetch(`/api/goals/${id}`, { method: "DELETE" });
    fetchGoals();
  }

  // Edit
  function startEdit(goal: Goal) {
    setEditingId(goal.id);
    setEditName(goal.name);
    setEditTargetAmount(goal.targetAmount.toString());
    setEditCurrentAmount(goal.currentAmount.toString());
    setEditDeadline(goal.deadline.split("T")[0]);
    setEditStatus(goal.status);
  }

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
    fetchGoals();
  }

  return (
    <section
      id="goals"
      className="py-20 px-4 sm:px-6 lg:px-8 relative min-h-screen"
    >
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

        {/* Table */}
        <Card className="mb-5 bg-black/40 backdrop-blur-md border border-cyan-500/20">
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Target</TableHead>
                    <TableHead className="text-gray-300">Current</TableHead>
                    <TableHead className="text-gray-300">Deadline</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.map((goal) => (
                    <TableRow
                      key={goal.id}
                      className="border-gray-700 hover:bg-cyan-500/5"
                    >
                      {editingId === goal.id ? (
                        <>
                          <TableCell>
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editTargetAmount}
                              onChange={(e) =>
                                setEditTargetAmount(e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editCurrentAmount}
                              onChange={(e) =>
                                setEditCurrentAmount(e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={editDeadline}
                              onChange={(e) => setEditDeadline(e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              onClick={() => saveEdit(goal.id)}
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
                          <TableCell className="text-white">
                            {goal.name}
                          </TableCell>
                          <TableCell className="text-pink-400 font-semibold">
                            ₹{goal.targetAmount}
                          </TableCell>
                          <TableCell className="text-cyan-400 font-semibold">
                            ₹{goal.currentAmount}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(goal.deadline).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="flex gap-2">
                            <Button
                              onClick={() => startEdit(goal)}
                              className="bg-yellow-400 text-black"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => deleteGoal(goal.id)}
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
            {goals.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No goals found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
