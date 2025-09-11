import React from 'react';
import { motion } from "framer-motion";
import { User, DollarSign, TrendingUp, Target, Menu, X, Home, BarChart3, CreditCard, ArrowUpRight, Twitter, Linkedin, Mail, MapPin, Phone, Shield, Zap, Users, Star, CheckCircle, PieChart, Calendar, Bell, Lock, Award, Smartphone, Globe, ArrowRight } from 'lucide-react';

import { ImageWithFallback } from "@/components/ui/imageWithFallback";


interface Show2Props {
    children?: React.ReactNode;
    title?: string;
}

const Show2: React.FC<Show2Props> = ({ children, title }) => {
    return (
        
      <div className="max-w-7xl mx-auto">
       
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl mb-6 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent neon-text-teal">
                Smart Expense Management
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Automatically categorize expenses, set spending limits, and get alerts when you're approaching your budget.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: CreditCard, label: 'Auto-Categorization', value: '99%' },
                  { icon: Bell, label: 'Smart Alerts', value: '24/7' },
                  { icon: PieChart, label: 'Visual Reports', value: '∞' },
                  { icon: Lock, label: 'Secure Tracking', value: '256-bit' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl w-fit mx-auto mb-3 neon-glow">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-2xl mb-1 text-slate-100">{item.value}</div>
                      <div className="text-sm text-slate-400">{item.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-slate-900/70 backdrop-blur-sm p-8 rounded-2xl border border-red-500/30 shadow-xl neon-glow">
                <h3 className="text-xl mb-6 text-slate-100">This Month's Spending</h3>
                <div className="space-y-4">
                  {[
                    { category: 'Groceries', amount: 450, color: 'bg-red-500', percentage: 85 },
                    { category: 'Gas', amount: 180, color: 'bg-orange-500', percentage: 60 },
                    { category: 'Entertainment', amount: 120, color: 'bg-yellow-500', percentage: 40 }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-slate-200">{item.category}</span>
                        <span className="text-slate-200">${item.amount}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          transition={{ delay: index * 0.2, duration: 0.8 }}
                          className={`${item.color} h-2 rounded-full`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      

    </div>

    );
};


export default Show2;