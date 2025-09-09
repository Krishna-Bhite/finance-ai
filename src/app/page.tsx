import prisma from "@/lib/prisma";
import SessionClient from "@/components/SessionClient";
import { Suspense } from "react";

// Server Component to fetch user count
async function UserCount() {
  const usersCount = await prisma.user.count();
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 shadow-lg text-center transition-transform hover:scale-105">
      <p className="text-lg text-gray-300 font-medium">Users in Database</p>
      <p className="mt-3 text-4xl font-bold text-cyan-400">{usersCount}</p>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0f1f] via-[#050812] to-black text-gray-200">
      <SessionClient />
    </div>
  );
}
