import React from 'react';
import { motion } from "framer-motion";
import {  DollarSign, TrendingUp, Target, } from 'lucide-react';


export default function Show3(){

    return (   
      <div className="max-w-7xl mx-auto">
        <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-teal-500/30 rounded-3xl p-12 neon-glow-teal">
              <TrendingUp className="h-16 w-16 text-teal-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent neon-text-teal">
                Maximize Your Revenue
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Track multiple income streams, identify growth opportunities, and optimize your earning potential with advanced analytics.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: DollarSign, title: 'Multiple Streams', description: 'Track salary, freelance, investments, and more' },
                  { icon: TrendingUp, title: 'Growth Analytics', description: 'Identify your most profitable income sources' },
                  { icon: Target, title: 'Income Goals', description: 'Set targets and track your progress' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="text-center"
                    >
                      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-3 rounded-xl w-fit mx-auto mb-4 neon-glow-teal">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg mb-2 text-slate-100">{item.title}</h3>
                      <p className="text-slate-300 text-sm">{item.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        
    </div>

    );
};


// export default Show2; // Removed to fix multiple default exports error