"use client";

import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import RevenuesPage from "@/app/revenues/page";
import ExpensesPage from "@/app/expenses/page";
import GoalsPage from "@/app/goals/page";
import DashboardPage from "@/app/dashboard/page";
import { Github, Twitter, Linkedin, Mail, Heart, CheckCircle, Award } from 'lucide-react';
import { ImageWithFallback } from "@/components/ui/imageWithFallback";
import Show2 from "@/components/ui/show2";
import Show3 from "@/components/ui/show3";
import Show4 from "@/components/ui/show4";



// ...existing imports...

export default function SessionClient() {
  const { data: session } = useSession();
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Documentation', 'API'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Resources: ['Help Center', 'Community', 'Tutorials', 'Status'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Security', 'Compliance']
  };

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

     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>
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
          <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl mb-6 bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent neon-text-cyan">
              Why Choose FinanceApp?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the most advanced financial management platform with cutting-edge features designed for your success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "🛡️",
                title: 'Bank-Level Security',
                description: 'Your data is protected with 256-bit encryption and multi-factor authentication',
                color: 'blue'
              },
              {
                icon: "⚡",
                title: 'Real-Time Sync',
                description: 'Connect all your accounts and get instant updates across all devices',
                color: 'yellow'
              },
              {
                icon: "🦊",
                title: 'Smart Analytics',
                description: 'AI-powered insights help you make better financial decisions',
                color: 'green'
              },
              {
                icon: "🔔",
                title: 'Smart Alerts',
                description: 'Get notified about spending patterns, bill reminders, and opportunities',
                color: 'purple'
              },
              {
                icon: "📱",
                title: 'Mobile First',
                description: 'Fully responsive design that works perfectly on any device',
                color: 'indigo'
              },
              {
                icon: "👤",
                title: 'Family Sharing',
                description: 'Share budgets and goals with family members securely',
                color: 'pink'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
                viewport={{ once: true }}
                className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-violet-500/50 hover:shadow-xl hover:neon-glow-violet transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-3 rounded-xl w-fit mb-4 neon-glow">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl mb-3 text-slate-100">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Feature Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-cyan-500/30 rounded-3xl p-8 md:p-12 neon-glow"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl mb-6 bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">See Your Money in Action</h3>
                <p className="text-lg text-slate-300 mb-8">
                  Visualize your financial journey with beautiful charts, detailed breakdowns, and actionable insights that help you make smarter decisions.
                </p>
                <div className="space-y-4">
                  {[
                    'Real-time expense tracking',
                    'Automated categorization',
                    'Custom budget alerts',
                    'Investment portfolio tracking'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative z-10"
                >
                  <ImageWithFallback
                    src="/m.jpg"  // Remove 'public' from the path
                    alt="Financial Dashboard"
                    width={500}  // Add width
                    height={500}  // Add height
                    className="rounded-2xl shadow-2xl w-full"
                  />
                </motion.div>
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl p-4 text-white shadow-lg neon-glow">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Award Winning</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
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
          <Show2/>
          <ExpensesPage />
          <Show3/>
          <RevenuesPage />
          <Show4/>
          <GoalsPage />
          
        </main>
        
      </div>
         <footer className="py-16 px-4 sm:px-6 lg:px-8 border-t border-cyan-500/20 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                FinanceAI
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Transforming financial data into actionable insights with the power of artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center text-gray-400 text-sm mb-4 md:mb-0">
            <span>© 2024 FinanceAI. Made with</span>
            <Heart className="mx-1 text-red-400" size={14} />
            <span>for financial innovation.</span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>🔒 SOC 2 Compliant</span>
            <span>🛡️ GDPR Ready</span>
            <span>⚡ 99.9% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
      </main>
    </div>
  );
}
