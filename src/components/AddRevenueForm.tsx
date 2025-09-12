"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface RevenueSource {
  name: string;
  amount: number;
  type?: string;
  isRecurring: boolean;
}

interface AddRevenueFormProps {
  onSuccess: () => void;
}

export default function AddRevenueForm({ onSuccess }: AddRevenueFormProps) {
  const [sources, setSources] = useState<RevenueSource[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = sources.reduce((sum, source) => sum + source.amount, 0);
      const now = new Date();

      const response = await fetch("/api/revenues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          total,
          sources,
        }),
      });

      if (response.ok) {
        setSources([]);
        onSuccess();
      } else {
        console.error("Failed to add revenue");
      }
    } catch (error) {
      console.error("Error adding revenue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-white/5 rounded-2xl border border-cyan-500/30 backdrop-blur-sm"
      onSubmit={handleSubmit}
    >
      {/* Form implementation */}
    </motion.form>
  );
}