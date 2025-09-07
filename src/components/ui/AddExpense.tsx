"use client";

import React from "react";
import { useEffect, useState } from "react";
import Input from "../../components/ui/input";
import Button from "../../components/ui/button";
import { CardContent } from "../../components/ui/card";


interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
}

export default function AddExpence() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editDescription, setEditDescription] = useState("");
    
    async function fetchExpenses() {
        const res = await fetch("/api/expenses");
        const data = await res.json();
        setExpenses(data);
      }
    
      useEffect(() => {
        fetchExpenses();
      }, []);
    // Add expense with validation
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

  
  return (
    <div className="flex flex-col items-center justify-center space-y-8 bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-400 w-full max-w-md mx-auto text-center">
      
      {/* Navbar */}
      <nav className="flex justify-between w-full mb-6 px-6 py-3 bg-gray-900 text-white rounded-2xl shadow-lg">
        <span className="font-bold text-lg">Add Expense</span>
      </nav>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Hello, </h2>
        
      </div>


      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
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
                
        
        
      </div>

      {/* Footer */}
      <footer className="mt-6 w-full text-sm text-gray-600 border-t border-gray-400 pt-4">
        © {new Date().getFullYear()} Finance AI. All rights reserved.
      </footer>
    </div>
  );
}
