import React from 'react';
import { motion } from "framer-motion";
import { CheckCircle, Award, Section } from 'lucide-react';
import { ImageWithFallback } from "@/components/ui/imageWithFallback";


interface Show2Props {
    children?: React.ReactNode;
    title?: string;
}

const Show1: React.FC<Show2Props> = ({ children, title }) => {
    return (
        
      <div className="max-w-7xl mx-auto">
        <div>
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
                    alt="Financial "
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
    </div>

    );
};


export default Show1;