'use client';
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle, Users, Coins, ArrowRight, LayoutList, Wallet, Gamepad2, Gift, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [fakeFeed, setFakeFeed] = useState([
    { user: '***902', action: 'withdrew', amount: '₹12,400' },
    { user: '***142', action: 'won Wingo', amount: '₹5,600' }
  ]);

  useEffect(() => {
      const feedInterval = setInterval(() => {
          const actions = ['withdrew', 'won Wingo', 'won CoinFlip', 'completed task'];
          const randomAction = actions[Math.floor(Math.random() * actions.length)];
          const randomAmount = `₹${Math.floor(Math.random() * 9000) + 1000}`;
          const randomUser = `***${Math.floor(100 + Math.random() * 899)}`;
          setFakeFeed(prev => [{ user: randomUser, action: randomAction, amount: randomAmount }, ...prev].slice(0, 3));
      }, 3000);
      return () => clearInterval(feedInterval);
  }, []);

  const copyReferral = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 z-10 relative">
          
          {/* Header */}
          <header className="mb-8 pt-6 sm:pt-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-5xl font-black mb-2 tracking-tight text-white">Hi, {user.username}!</h1>
                <p className="text-gray-400 font-medium tracking-wide">Welcome to the premium earning portal.</p>
              </div>
          </header>

          {/* Main Wallet Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-br from-gray-900 to-[#020202] border border-gray-800 rounded-[2.5rem] p-8 sm:p-10 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
             <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none"></div>
             
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10">
                 <div>
                     <p className="text-gray-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-blue-500"/> Total Balance</p>
                     <div className="flex items-center gap-3">
                         <Coins className="text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" size={48} />
                         <span className="text-6xl sm:text-8xl font-black text-white font-mono tracking-tighter drop-shadow-md">₹{user.balance}</span>
                     </div>
                 </div>

                 <div className="mt-8 sm:mt-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                     <Link href="/deposit" className="flex-1 sm:flex-none flex items-center justify-center bg-green-500/20 text-green-400 border border-green-500/50 font-black text-lg px-10 py-5 rounded-full hover:bg-green-500/30 transition-all shadow-[0_0_30px_rgba(34,197,94,0.1)] active:scale-95">
                         Deposit
                     </Link>
                     <Link href="/wallet" className="flex-1 sm:flex-none flex items-center justify-center bg-white text-black font-black text-lg px-10 py-5 rounded-full hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95">
                         Withdraw
                     </Link>
                 </div>
             </div>
          </motion.div>

          {/* Live Activity Ticker */}
          <div className="mb-10 w-full overflow-hidden bg-gray-900/40 border border-gray-800/80 rounded-full py-3 px-6 flex items-center justify-start gap-4 shadow-inner">
              <TrendingUp className="text-green-500 shrink-0 animate-pulse" size={20} />
              <div className="flex gap-6 w-full relative h-6">
                  <AnimatePresence>
                      {fakeFeed.map((feed, i) => (
                          <motion.span 
                              key={feed.user+feed.amount+feed.action+i} 
                              initial={{opacity:0, y:20}} 
                              animate={{opacity:1, y:0}} 
                              exit={{opacity:0, y:-20}}
                              className="text-sm sm:text-base font-medium text-gray-400 absolute whitespace-nowrap"
                              style={{ left: i === 0 ? '0%' : i === 1 ? '35%' : '70%' }}
                          >
                              <span className="text-white font-bold">{feed.user}</span> just {feed.action} <span className="text-green-400 font-bold">{feed.amount}</span>
                          </motion.span>
                      ))}
                  </AnimatePresence>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Quick Jump: Games */}
              <Link href="/games" className="md:col-span-2 group block h-full">
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="bg-gradient-to-br from-violet-600/20 to-purple-900/20 backdrop-blur-xl border border-violet-500/30 rounded-[2rem] p-8 h-full flex flex-col justify-between relative overflow-hidden transition-all hover:border-violet-400/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]"
                  >
                      <Gamepad2 className="absolute -right-8 -top-8 w-56 h-56 text-violet-500/10 transform rotate-12 transition-transform group-hover:rotate-6" />
                      <div>
                          <div className="w-16 h-16 bg-violet-500/20 border border-violet-500/50 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                              <Gamepad2 className="text-violet-400" size={32} />
                          </div>
                          <h2 className="text-3xl font-black text-white mb-2 tracking-wide">Arcade & Casino</h2>
                          <p className="text-gray-400 font-medium text-lg max-w-md">Multiply your balance instantly with Wingo Color Prediction and CoinFlip games.</p>
                      </div>
                      <div className="mt-8 flex items-center font-black text-violet-400 uppercase tracking-widest text-sm bg-violet-900/30 w-max px-4 py-2 rounded-lg">
                          Play Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                  </motion.div>
              </Link>

              {/* Referrals */}
              <motion.div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-[2rem] p-8 relative flex flex-col justify-between overflow-hidden group h-full">
                  <Gift className="absolute -right-6 -bottom-6 w-48 h-48 text-gray-800/40 transform -rotate-12 transition-transform group-hover:-rotate-6" />
                  <div>
                      <div className="w-14 h-14 bg-blue-500/20 border border-blue-500/50 rounded-2xl flex items-center justify-center mb-6">
                          <Users className="text-blue-400" size={28} />
                      </div>
                      <h2 className="text-2xl font-black text-white mb-2">Invite & Earn</h2>
                      <p className="text-gray-400 text-sm font-medium mb-6">You have <span className="text-white font-bold">{user.referredUsers?.length || 0}</span> referred friends. Get ₹50 for every new signup.</p>
                  </div>
                  
                  <div className="relative z-10 w-full mt-auto">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Your Invite Code</p>
                      <div className="flex bg-black/60 border border-gray-700 rounded-xl p-1.5 items-center shadow-inner">
                          <span className="flex-1 text-center font-mono font-black tracking-widest text-lg text-white">{user.referralCode}</span>
                          <button onClick={copyReferral} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700">
                              {copied ? <CheckCircle className="text-green-400" size={20} /> : <Copy className="text-gray-400" size={20} />}
                          </button>
                      </div>
                  </div>
              </motion.div>
          </div>

          {/* Quick Tasks Outline */}
          <Link href="/tasks" className="block group">
              <motion.div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 hover:border-gray-600 rounded-[2rem] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all hover:shadow-xl">
                  <div className="flex items-center gap-6 mb-6 sm:mb-0">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shrink-0 shadow-[0_10px_20px_rgba(16,185,129,0.3)]">
                          <LayoutList className="text-white" size={36} />
                      </div>
                      <div>
                          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Available Tasks</h2>
                          <p className="text-gray-400 font-medium text-lg">Complete daily missions from sponsors to refill your wallet entirely for free.</p>
                      </div>
                  </div>
                  <div className="bg-white text-black font-black px-8 py-4 rounded-full flex items-center whitespace-nowrap shrink-0 group-hover:bg-gray-200 transition-colors shadow-lg">
                      View Tasks <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </div>
              </motion.div>
          </Link>

        </div>
      </div>
    </ProtectedRoute>
  );
}
