'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowLeft, Clock, History, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ColorGame() {
  const { user, refreshUser } = useAuth();
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundId, setRoundId] = useState(0);
  const [history, setHistory] = useState([]);
  
  const [betAmount, setBetAmount] = useState(10);
  const [isBetting, setIsBetting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const fetchStatus = async () => {
      try {
          const res = await api.get('/color/status');
          setRoundId(res.data.currentRoundId);
      } catch (e) {}
  };

  const fetchHistory = async () => {
      try {
          const res = await api.get('/color/history');
          setHistory(res.data.data);
      } catch (e) {}
  };

  const claimRewards = async () => {
      try {
          const res = await api.post('/color/claim');
          if (res.data.totalPayout > 0) {
              setSuccessMsg(`Round Over! You won ${res.data.totalPayout} Coins!`);
              refreshUser();
              setTimeout(() => setSuccessMsg(''), 5000);
          }
      } catch (e) {}
  };

  useEffect(() => {
      fetchStatus();
      fetchHistory();
      
      const interval = setInterval(() => {
          const localTimeRemaining = 60 - Math.floor((Date.now() / 1000) % 60);
          setTimeLeft(localTimeRemaining);
          
          if (localTimeRemaining <= 10) {
              setIsLocked(true);
          } else {
              setIsLocked(false);
          }

          if (localTimeRemaining === 59 || localTimeRemaining === 58) {
              // 1-2 seconds after round resets to clear race conditions
              fetchStatus();
              fetchHistory();
              claimRewards();
          }
      }, 1000);

      return () => clearInterval(interval);
  }, []);

  const handleBet = async (color) => {
      if (isLocked) return;
      if (betAmount <= 0) return setError('Enter a valid bet amount');
      if (user?.balance < betAmount) return setError('Insufficient balance');

      setIsBetting(true);
      setError('');
      setSuccessMsg('');

      try {
          const res = await api.post('/color/bet', { amount: Number(betAmount), prediction: color, roundId });
          setSuccessMsg(`Successfully placed ${betAmount} on ${color.toUpperCase()}!`);
          refreshUser(); // deduct from locally cached balance visual immediately
          setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
          setError(err.response?.data?.message || 'Server error');
      } finally {
          setIsBetting(false);
      }
  };

  const getColorClass = (color) => {
      if (color === 'red') return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]';
      if (color === 'green') return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
      if (color === 'violet') return 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]';
      return 'bg-gray-500';
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <Link href="/games" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Arcade
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Betting Panel Section */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-700/50 shadow-2xl relative overflow-hidden">
                    
                    {/* Live Header Info */}
                    <div className="flex justify-between items-center mb-8 border-b border-gray-700/50 pb-6">
                        <div>
                            <h2 className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">Current Period</h2>
                            <p className="text-2xl sm:text-4xl font-extrabold text-white font-mono">{roundId === 0 ? '...' : roundId}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">Time Remaining</h2>
                            <div className={`text-3xl sm:text-5xl font-extrabold font-mono flex items-center justify-end ${isLocked ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
                                <Clock size={32} className="mr-3 opacity-50" />
                                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-8 bg-gray-900/60 px-6 py-4 rounded-2xl border border-gray-700/30">
                        <span className="text-gray-300 font-medium text-lg">Wallet Balance</span>
                        <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-400 font-bold rounded-xl flex items-center shadow-[0_0_15px_rgba(234,179,8,0.15)] text-lg border border-yellow-500/30">
                            <Coins size={20} className="mr-2" />
                            {user?.balance || 0}
                        </span>
                    </div>

                    {error && (
                        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl flex items-center font-medium">
                            <AlertCircle size={18} className="mr-3 flex-shrink-0" /> {error}
                        </motion.div>
                    )}
                    {successMsg && (
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="mb-6 p-4 bg-green-500/10 border border-green-500/50 text-green-400 rounded-xl flex items-center font-bold text-lg shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                            <Trophy size={22} className="mr-3 text-yellow-400" /> {successMsg}
                        </motion.div>
                    )}

                    {/* Interactive Gameplay Container */}
                    <div className="relative">
                        {isLocked && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10 bg-gray-900/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                <Clock size={56} className="text-red-500 mb-4 animate-spin-slow" />
                                <h3 className="text-3xl font-extrabold text-white tracking-widest uppercase mb-2">Calculating Result</h3>
                                <p className="text-gray-400 text-lg font-medium">Betting is currently locked to ensure fairness.</p>
                            </motion.div>
                        )}
                        
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-400 mb-2 px-1">How much are you betting?</label>
                            <input
                                type="number"
                                min="1"
                                value={betAmount === 0 ? '' : betAmount}
                                onChange={(e) => setBetAmount(e.target.value)}
                                className="block w-full px-5 py-4 sm:text-xl font-bold border border-gray-600 rounded-2xl bg-gray-900/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner text-center"
                                placeholder="Enter Amount"
                            />
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                {[10, 100, 500, 1000].map(amt => (
                                    <button key={amt} onClick={() => setBetAmount(amt)} className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600/50 rounded-xl py-3 font-bold text-lg transition active:scale-95 shadow-sm hover:shadow-md">+{amt}</button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 sm:gap-6">
                            <button onClick={() => handleBet('green')} disabled={isBetting} className="bg-gradient-to-b from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-extrabold py-6 sm:py-8 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.4)] transform hover:-translate-y-1 transition active:scale-95 text-lg sm:text-xl flex flex-col items-center justify-center border-t border-green-300/50">
                                <span>Join Green</span>
                                <span className="text-sm font-medium opacity-80 mt-1">2x Payout</span>
                            </button>
                            <button onClick={() => handleBet('violet')} disabled={isBetting} className="bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-extrabold py-6 sm:py-8 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] transform hover:-translate-y-1 transition active:scale-95 text-lg sm:text-xl flex flex-col items-center justify-center border-t border-purple-300/50">
                                <span>Join Violet</span>
                                <span className="text-sm font-medium opacity-80 mt-1">4.5x Payout</span>
                            </button>
                            <button onClick={() => handleBet('red')} disabled={isBetting} className="bg-gradient-to-b from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-extrabold py-6 sm:py-8 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.4)] transform hover:-translate-y-1 transition active:scale-95 text-lg sm:text-xl flex flex-col items-center justify-center border-t border-red-300/50">
                                <span>Join Red</span>
                                <span className="text-sm font-medium opacity-80 mt-1">2x Payout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Panel Sidebar */}
            <div className="lg:col-span-1">
                <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-3xl border border-gray-700/50 h-full shadow-xl">
                    <div className="flex items-center justify-between text-white font-bold text-xl mb-6 border-b border-gray-700/50 pb-4">
                        <div className="flex items-center"><History className="mr-2 text-blue-400" /> Pattern Chart</div>
                        <span className="text-xs font-medium bg-gray-700 px-2 py-1 rounded text-gray-300">Last 10</span>
                    </div>
                    
                    <div className="space-y-3">
                        <AnimatePresence>
                            {history.length > 0 ? history.map((record, idx) => (
                                <motion.div 
                                    key={record.roundId} 
                                    initial={{ opacity: 0, x: 20 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center justify-between bg-gray-900/50 p-4 rounded-2xl border border-gray-800/80 shadow-sm"
                                >
                                    <span className="text-gray-400 font-mono text-sm font-medium tracking-wide">{record.roundId}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-white font-extrabold text-xl font-mono">{record.result.number}</span>
                                        <div className={`w-6 h-6 rounded-full border-2 border-white/20 ${getColorClass(record.result.color)}`}></div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center text-gray-500 py-10 font-medium">Awaiting network data...</div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
