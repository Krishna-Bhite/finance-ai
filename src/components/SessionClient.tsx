"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import RevenuesPage from "@/app/revenues/page";
import ExpensesPage from "@/app/expenses/page";
import GoalsPage from "@/app/goals/page";
import DashboardPage from "@/app/dashboard/page";

export default function SessionClient() {
  const { data: session } = useSession();

  // Smooth scroll effect for navbar links
  useEffect(() => {
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href")?.slice(1);
        if (targetId) {
          document.getElementById(targetId)?.scrollIntoView({
            behavior: "smooth",
          });
        }
      });
    });
  }, []);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#050812] to-black text-center">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          Sign in with GitHub
        </h2>
        <button
          onClick={() => signIn("github")}
          className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl shadow-lg hover:bg-gray-700 transition-all duration-300 font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0a0f1f] via-[#050812] to-black text-gray-200">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full backdrop-blur-xl bg-white/5 border-b border-cyan-500/30 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent drop-shadow">
            FinanceAI
          </h1>
          <div className="flex gap-6">
            {["Home", "Dashboard", "Expenses", "Revenues", "Goals", "Footer"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative text-gray-300 hover:text-white transition-colors duration-300 after:content-[''] after:block after:h-[2px] after:w-0 after:bg-cyan-400 hover:after:w-full after:transition-all"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Sections */}
      <main className="pt-20">
        {/* Home */}
        <section
          id="home"
          className="min-h-screen flex flex-col items-center justify-center text-center space-y-6"
        >
          <h2 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-violet-500 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            Welcome to FinanceAI
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl">
            Manage your expenses, revenues, and goals with futuristic insights and AI-powered dashboards.
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              href="#dashboard"
              className="px-6 py-3 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-semibold hover:bg-cyan-500/40 hover:text-white transition-all duration-300 shadow-lg"
            >
              View Dashboard
            </Link>
            <Link
              href="#expenses"
              className="px-6 py-3 rounded-xl bg-violet-500/20 border border-violet-400 text-violet-300 font-semibold hover:bg-violet-500/40 hover:text-white transition-all duration-300 shadow-lg"
            >
              Track Expenses
            </Link>
          </div>
        </section>
               <div className="relative z-10">
        
        <main>
          
          <DashboardPage />
          <ExpensesPage />
          <RevenuesPage />
          <GoalsPage />
          
        </main>
        
      </div>
        {/* Footer */}
        <footer
          id="footer"
          className="h-40 flex flex-col items-center justify-center text-gray-400 border-t border-white/10"
        >
          <p>© 2025 FinanceAI. All rights reserved.</p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-cyan-400 transition">
              🌐
            </a>
            <a href="#" className="hover:text-violet-400 transition">
              🐦
            </a>
            <a href="#" className="hover:text-teal-400 transition">
              💼
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
