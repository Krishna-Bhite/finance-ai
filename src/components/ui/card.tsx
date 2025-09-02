import React from "react";
import { motion } from "framer-motion";

// Main Card container
export function Card({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      className={`border border-gray-700 rounded-lg bg-neutral-900 shadow-md ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Card Header
export function CardHeader({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 border-b border-gray-700 ${className}`}>{children}</div>;
}

// Card Title
export function CardTitle({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

// Card Content
export function CardContent({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
