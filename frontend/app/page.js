'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Target, Coins, ShieldCheck, Gift, Gamepad2 } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#050508] relative overflow-hidden">
      {/* Immersive Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-900/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-[30rem] h-[30rem] bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 z-10 w-full pt-16 sm:pt-24 pb-32 flex flex-col items-center justify-center">
        <motion.div 
          className="text-center w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30 text-sm font-black uppercase tracking-widest text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
            <Flame className="w-5 h-5 text-orange-400" />
            <span>India's #1 Premium Reward & Gaming App</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-white drop-shadow-xl"
          >
            Play. Earn.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400">
              Withdraw Instantly.
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Multiply your wealth with Live Wingo Casino, complete daily high-paying tasks, and cashout your rewards instantly to your bank account.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto px-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black font-black text-xl hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-3 group"
            >
              Start Earning Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-10 py-5 rounded-full bg-gray-900 border border-gray-700 text-white font-bold text-xl hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              Sign In to Account
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { icon: Gamepad2, title: "Casino Arcade", desc: "Live Color Prediction & 3D Coin Flips.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { icon: Target, title: "Daily Tasks", desc: "Complete offers for guaranteed payouts.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { icon: Gift, title: "Refer & Earn", desc: "Get ₹50 for every friend you invite.", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/20" },
            { icon: ShieldCheck, title: "Instant Bank Out", desc: "Securely withdraw straight to your account.", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" }
          ].map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants} className="bg-gray-900/40 backdrop-blur-3xl p-8 border border-gray-800 rounded-[2rem] hover:bg-gray-800/60 hover:-translate-y-2 transition-all shadow-xl group">
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} border flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black mb-3 text-white tracking-wide">{feature.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}
