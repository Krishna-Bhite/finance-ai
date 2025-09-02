"use client";
import { useTheme } from "next-themes";
import  Button  from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const next = theme === "dark" ? "light" : "dark";
  return (
    <Button
      variant="outline"
      className="rounded-2xl border-white/20 bg-white/10 backdrop-blur hover:bg-white/20 dark:bg-zinc-900/30"
      onClick={() => setTheme(next)}
      title={`Switch to ${next} theme`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
