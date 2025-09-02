"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SessionClient() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-400 w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">Sign in with GitHub</h2>
        <button
          onClick={() => signIn("github")}
          className="px-8 py-3 bg-gray-900 text-white rounded-2xl shadow-lg hover:bg-gray-700 transition-all duration-300 font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-400 w-full max-w-md mx-auto text-center">
      
      {/* Navbar */}
      <nav className="flex justify-between w-full mb-6 px-6 py-3 bg-gray-900 text-white rounded-2xl shadow-lg">
        <span className="font-bold text-lg">Finance AI</span>
        <button
          onClick={() => signOut()}
          className="px-3  bg-red-600 rounded-xl hover:bg-red-500 transition-all duration-200 font-semibold"
        >
          Sign Out
        </button>
      </nav>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Hello, {session.user?.name}</h2>
        <p className="text-gray-700 font-medium">{session.user?.email}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link href="/dashboard">
          <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl shadow-lg hover:bg-gray-700 transition-all duration-200 w-full sm:w-auto font-semibold">
            Go to Dashboard
          </button>
        </Link>
        <Link href="/expenses">
          <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl shadow-lg hover:bg-gray-700 transition-all duration-200 w-full sm:w-auto font-semibold">
            Add Expenses
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-6 w-full text-sm text-gray-600 border-t border-gray-400 pt-4">
        © {new Date().getFullYear()} Finance AI. All rights reserved.
      </footer>
    </div>
  );
}
