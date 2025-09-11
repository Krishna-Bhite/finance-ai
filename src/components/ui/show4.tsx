import React from 'react';
import { motion } from "framer-motion";
import { Target } from 'lucide-react';
import { ImageWithFallback } from "@/components/ui/imageWithFallback";



export default function Show4(){

    return (   
      <div className="max-w-7xl mx-auto">
        <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative z-10"
              >
                <ImageWithFallback
                    src="/4.jpg"  // Remove 'public' from the path
                    alt="Financial "
                    width={500}  // Add width
                    height={500}  // Add height
                    className="rounded-2xl shadow-2xl w-full"
                />
              </motion.div>
              <div className="absolute -top-4 -left-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl p-4 text-white shadow-lg neon-glow-violet">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Goal Tracker</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl mb-6 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent neon-text-violet">
                Achieve Your Dreams
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Set meaningful financial goals and watch your progress unfold. Our smart tracking system keeps you motivated and on track.
              </p>
              <div className="space-y-6 rounded-xl  " >
                {[
                  { goal: 'Emergency Fund', progress: 75, amount: '$7,500 / $10,000' },
                  { goal: 'Dream Vacation', progress: 90, amount: '$2,700 / $3,000' },
                  { goal: 'New Car', progress: 48, amount: '$12,000 / $25,000' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-slate-900/70 backdrop-blur-sm p-4 rounded-xl border border-violet-500/30 hover:border-purple-500/50 hover:neon-glow-violet transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-200">{item.goal}</span>
                      <span className="text-sm text-slate-400">{item.amount}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                        className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full"
                      />
                    </div>
                    <div className="text-right text-sm text-violet-400 mt-1">{item.progress}%</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
        
    </div>

    );
};


// export default Show2; // Removed to fix multiple default exports error