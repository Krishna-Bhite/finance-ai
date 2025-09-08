"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SessionClient() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-400 w-full max-w-md mx-auto">
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
    <div className="bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-400 w-full max-w-lg mx-auto text-center space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Hello, {session.user?.name}
        </h2>
        <p className="text-gray-700 font-medium">{session.user?.email}</p>
      </div>
      

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center">
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
        
        <Link href="/revenues">
          <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl shadow-lg hover:bg-gray-700 transition-all duration-200 w-full sm:w-auto font-semibold">
            Add revenues
          </button>
        </Link>

        <Link href="/goals">
          <button className="px-10 py-3 bg-gray-900 text-white rounded-2xl shadow-lg hover:bg-gray-700 transition-all duration-200 w-full sm:w-auto font-semibold">
            Add Goal
          </button>
        </Link>
      </div>
    </div>
  );
}
