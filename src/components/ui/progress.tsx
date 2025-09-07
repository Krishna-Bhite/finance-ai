"use client";

import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // percentage (0–100)
}

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div
      className={`relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
      {...props}
    >
      <div
        className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
