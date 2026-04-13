"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Coins, ShieldCheck } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 100 } 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh]">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        className="text-center max-w-3xl z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>The Next-Gen Reward Platform</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500"
        >
          Complete Tasks.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Earn Real Rewards.
          </span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Join our premium platform to discover simple tasks, invite friends with your unique code, and redeem your coins for real value.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/register" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
          >
            Start Earning Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white font-semibold text-lg border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            Sign In
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 mb-12 w-full z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {[
          { icon: Target, title: "Simple Tasks", desc: "Discover and complete high-paying tasks curated for you." },
          { icon: Coins, title: "Quick Cashout", desc: "Instantly withdraw your earned balance once you hit the limit." },
          { icon: ShieldCheck, title: "Secure & Verified", desc: "Fully protected transactions and realistic earning methods." }
        ].map((feature, idx) => (
          <motion.div key={idx} variants={itemVariants} className="glass-card p-6 border-white/5">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
