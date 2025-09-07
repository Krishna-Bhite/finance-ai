import prisma from "@/lib/prisma";
import SessionClient from "@/components/SessionClient";
import { Suspense } from "react";

// Server Component to fetch user count
async function UserCount() {
  const usersCount = await prisma.user.count();
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-400 w-full max-w-md text-center transition-transform hover:scale-105">
      <p className="text-xl text-gray-800 font-medium">Users in Database</p>
      <p className="mt-4 text-5xl font-bold text-gray-900">{usersCount}</p>
    </div>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-300 via-white to-black">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white shadow-lg">
        <span className="font-bold text-xl">Finance AI</span>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-500 transition-all duration-200 font-semibold"
          >
            Sign Out
          </button>
        </form>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow p-8 space-y-8">
        <h1 className="text-6xl font-extrabold text-gray-900 drop-shadow-lg text-center">
          Finance AI
        </h1>

        <Suspense fallback={<div>Loading...</div>}>
          <UserCount />
        </Suspense>

        <div className="w-full max-w-lg mt-6">
          <SessionClient />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-4">
        © {new Date().getFullYear()} Finance AI. All rights reserved.
      </footer>
    </div>
  );
}
