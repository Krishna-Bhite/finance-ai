import React from "react";

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-gray-700 bg-transparent px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
