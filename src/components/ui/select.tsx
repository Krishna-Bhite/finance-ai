"use client";

import * as React from "react";
import { motion, type MotionProps } from "framer-motion";

// Context for managing value
interface SelectContextType {
  value: string;
  setValue: (val: string) => void;
}
const SelectContext = React.createContext<SelectContextType | null>(null);

export function Select({
  children,
  value,
  onValueChange,
  className = "",
}: {
  children: React.ReactNode;
  value: string;
  onValueChange: (val: string) => void;
  className?: string;
}) {
  const setValue = (val: string) => onValueChange(val);

  return (
    <SelectContext.Provider value={{ value, setValue }}>
      <div className={`relative inline-block w-full ${className}`}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// Trigger
export function SelectTrigger({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps & { className?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`w-full flex items-center justify-between px-3 py-2 border rounded-md bg-neutral-900 text-white ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Value
export function SelectValue({
  placeholder,
  className = "",
}: {
  placeholder?: string;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectValue must be used inside <Select>");

  return (
    <span className={`text-sm ${className}`}>
      {ctx.value || placeholder || "Select an option"}
    </span>
  );
}

// Content
export function SelectContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.ul
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={`absolute mt-2 w-full rounded-md border bg-neutral-900 text-white shadow-lg z-10 ${className}`}
    >
      {children}
    </motion.ul>
  );
}

// Item
export function SelectItem({
  children,
  value,
  className = "",
  ...props
}: React.LiHTMLAttributes<HTMLLIElement> & MotionProps & { value: string }) {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("SelectItem must be used inside <Select>");

  return (
    <motion.li
      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-2 cursor-pointer rounded-sm ${className}`}
      {...props}
    >
      {children}
    </motion.li>
  );
}
