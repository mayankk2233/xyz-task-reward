"use client";
import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Copy, CheckCircle, Users, Coins, ArrowRight, LayoutList, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const copyReferral = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-gray-400">Here is a quick overview of your account.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6 border-l-4 border-l-yellow-400 relative overflow-hidden"
          >
            <Coins className="absolute -right-6 -bottom-6 w-32 h-32 text-yellow-400/10 pointer-events-none" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-400/10 rounded-xl">
                <Coins className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-lg">Total Balance</h3>
            </div>
            <p className="text-4xl font-bold">{user.balance} <span className="text-xl text-gray-400">Coins</span></p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6 border-l-4 border-l-violet-500 relative overflow-hidden"
          >
            <Users className="absolute -right-6 -bottom-6 w-32 h-32 text-violet-500/10 pointer-events-none" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-violet-500/10 rounded-xl">
                <Users className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-semibold text-lg">Referrals</h3>
            </div>
            <p className="text-4xl font-bold">{user.referredUsers?.length || 0} <span className="text-xl text-gray-400">Friends</span></p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6 border-l-4 border-l-fuchsia-500"
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Your Referral Code</h3>
                <p className="text-sm text-gray-400 mb-4">Earn 50 coins for every friend who signs up using your code.</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 font-mono text-center tracking-widest text-[#FAFAFA]">
                  {user.referralCode}
                </div>
                <button 
                  onClick={copyReferral}
                  className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors flex items-center justify-center shrink-0"
                >
                  {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/tasks">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-8 group cursor-pointer border border-white/5 hover:border-violet-500/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <LayoutList className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Available Tasks</h3>
                  <p className="text-gray-400 text-sm">Complete simple tasks to earn coins.</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
            </motion.div>
          </Link>

          <Link href="/wallet">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-card p-8 group cursor-pointer border border-white/5 hover:border-blue-500/50 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Wallet & Cashout</h3>
                  <p className="text-gray-400 text-sm">View history and request withdrawals.</p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
            </motion.div>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
