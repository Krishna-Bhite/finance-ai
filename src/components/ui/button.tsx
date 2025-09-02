"use client";

import React from "react";
import { motion, type MotionProps } from "framer-motion";

type Variant = "default" | "secondary" | "destructive" | "outline";

type MotionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    className?: string;
    variant?: Variant;
  };

export default function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: MotionButtonProps) {
  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium shadow-sm transition-colors";

  const variants: Record<Variant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-gray-400 text-gray-800 bg-transparent hover:bg-gray-100",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
