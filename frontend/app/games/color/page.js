'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowLeft, Clock, History, Trophy, AlertCircle, TrendingUp } from 'lucide-react';
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
  const [fakeFeed, setFakeFeed] = useState([
    { user: '***902', amount: 4800, color: 'red' },
    { user: '***142', amount: 1560, color: 'green' },
    { user: '***881', amount: 9500, color: 'violet' }
  ]);

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
              fetchStatus();
              fetchHistory();
              claimRewards();
          }
      }, 1000);

      // Fake live feed interval to boost psychological engagement
      const feedInterval = setInterval(() => {
          const colors = ['red', 'green', 'violet'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomAmount = Math.floor(Math.random() * 5000) + 500;
          const randomUser = `***${Math.floor(100 + Math.random() * 899)}`;
          setFakeFeed(prev => {
              return [{ user: randomUser, amount: randomAmount, color: randomColor }, ...prev].slice(0, 3);
          });
      }, 4000);

      return () => { clearInterval(interval); clearInterval(feedInterval); };
  }, []);

  const handleBet = async (color) => {
      if (isLocked) return;
      if (betAmount <= 0) return setError('Enter a valid bet amount');
      if (user?.balance < betAmount) return setError('Insufficient balance');

      setIsBetting(true);
      setError('');
      setSuccessMsg('');

      try {
          await api.post('/color/bet', { amount: Number(betAmount), prediction: color, roundId });
          setSuccessMsg(`Successfully placed ${betAmount} on ${color.toUpperCase()}!`);
          refreshUser(); 
          setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
          setError(err.response?.data?.message || 'Server error');
      } finally {
          setIsBetting(false);
      }
  };

  const getColorClass = (color) => {
      if (color === 'red') return 'bg-gradient-to-br from-red-400 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-300';
      if (color === 'green') return 'bg-gradient-to-br from-green-400 to-green-600 shadow-[0_0_15px_rgba(34,197,94,0.5)] border-green-300';
      if (color === 'violet') return 'bg-gradient-to-br from-purple-400 to-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)] border-purple-300';
      return 'bg-gray-500';
  };
  
  const getTextColor = (color) => {
      if (color === 'red') return 'text-red-500';
      if (color === 'green') return 'text-green-500';
      if (color === 'violet') return 'text-purple-500';
      return 'text-gray-400';
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f] py-8 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Background Glowing Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
            <Link href="/games" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors bg-gray-900/50 backdrop-blur px-4 py-2 rounded-full border border-gray-800">
                <ArrowLeft size={18} className="mr-2" /> Back to Arcade
            </Link>

            {/* Header Stats Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-4 rounded-3xl mb-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] border border-yellow-300/30">
                        <Coins className="text-yellow-900" size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Available Balance</p>
                        <p className="text-2xl font-extrabold text-white font-mono block">₹{user?.balance || 0}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                     <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 text-center sm:text-right flex items-center gap-1"><TrendingUp size={12}/> Live Payout Feed</p>
                     <div className="h-10 overflow-hidden relative w-full sm:w-64 bg-gray-950/50 rounded-xl px-4 border border-gray-800 flex items-center shadow-inner">
                        <AnimatePresence>
                            {fakeFeed.map((feed, i) => (
                                <motion.div 
                                    key={feed.user + feed.amount}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: i === 0 ? 1 : 0, y: i * -30 }} 
                                    transition={{ duration: 0.5 }}
                                    className="absolute left-4 right-4 flex justify-between items-center text-sm"
                                >
                                    <span className="text-gray-300 font-bold">{feed.user}</span>
                                    <span className={`font-black tracking-wide ${getTextColor(feed.color)}`}>+{feed.amount}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                     </div>
                </div>
            </div>

            {/* Main Game Interface */}
            <div className="bg-gray-800/40 backdrop-blur-3xl border border-gray-700/50 rounded-[2.5rem] p-4 sm:p-8 shadow-2xl relative overflow-hidden">
                
                {/* Wingo Timer Header */}
                <div className="bg-gray-900/60 rounded-[2rem] p-6 border border-gray-800 flex flex-col sm:flex-row justify-between items-center mb-10 shadow-inner mt-2 mx-2">
                    <div className="text-center sm:text-left mb-6 sm:mb-0">
                        <h2 className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-2 flex items-center justify-center sm:justify-start">
                            Period
                        </h2>
                        <p className="text-3xl sm:text-4xl font-black text-white font-mono tracking-widest">{roundId === 0 ? '...' : roundId}</p>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end">
                        <h2 className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-2 flex items-center">
                            Count Down
                        </h2>
                        <div className="flex gap-2">
                             <div className="bg-gray-950/80 border border-gray-700 w-14 h-16 rounded-2xl flex items-center justify-center shadow-inner">
                                <span className={`text-4xl font-mono font-black ${isLocked ? 'text-red-500' : 'text-gray-200'}`}>0</span>
                             </div>
                             <div className="bg-gray-950/80 border border-gray-700 w-14 h-16 rounded-2xl flex items-center justify-center shadow-inner">
                                <span className={`text-4xl font-mono font-black ${isLocked ? 'text-red-500' : 'text-gray-200'}`}>0</span>
                             </div>
                             <span className="text-4xl font-extrabold text-gray-600 flex items-center mb-1">:</span>
                             <div className="bg-gray-950/80 border border-gray-700 w-14 h-16 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                                {isLocked && <div className="absolute inset-x-0 bottom-0 bg-red-500/20 h-full animate-pulse"></div>}
                                <span className={`text-4xl font-mono font-black z-10 ${isLocked ? 'text-red-500' : 'text-white'}`}>
                                    {Math.floor(timeLeft / 10)}
                                </span>
                             </div>
                             <div className="bg-gray-950/80 border border-gray-700 w-14 h-16 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                                {isLocked && <div className="absolute inset-x-0 bottom-0 bg-red-500/20 h-full animate-pulse"></div>}
                                <span className={`text-4xl font-mono font-black z-10 ${isLocked ? 'text-red-500' : 'text-white'}`}>
                                    {timeLeft % 10}
                                </span>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="mb-8 mx-2 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-2xl flex items-center justify-center font-bold text-center">
                            <AlertCircle size={20} className="mr-2" /> {error}
                        </motion.div>
                    )}
                    {successMsg && (
                        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="mb-8 mx-2 p-4 bg-green-500/10 border border-green-500/50 text-green-400 rounded-2xl flex items-center justify-center font-bold text-center shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                            <Trophy size={20} className="mr-2 text-yellow-400" /> {successMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Betting Action Area */}
                <div className="relative mx-2">
                    {isLocked && (
                        <motion.div initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} animate={{ opacity: 1, backdropFilter: 'blur(10px)' }} className="absolute -inset-6 z-20 bg-gray-900/70 rounded-[2.5rem] flex flex-col items-center justify-center border border-red-500/30">
                            <Clock size={72} className="text-red-500 mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
                            <h3 className="text-5xl font-black text-white tracking-[0.2em] uppercase mb-4 drop-shadow-xl text-center">LOCKED</h3>
                            <p className="text-gray-300 text-lg font-bold bg-gray-950/80 px-8 py-3 rounded-full border border-gray-700">Awaiting Results...</p>
                        </motion.div>
                    )}

                    <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-10">
                        <button onClick={() => handleBet('green')} disabled={isBetting} className="bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-black py-8 sm:py-12 rounded-3xl shadow-[0_15px_30px_rgba(34,197,94,0.3)] transform hover:-translate-y-2 transition-all active:scale-95 text-2xl sm:text-3xl flex flex-col items-center justify-center border-t-2 border-green-300/50 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                            <span className="drop-shadow-lg z-10 tracking-widest">GREEN</span>
                            <span className="text-xs sm:text-sm font-bold opacity-100 mt-3 bg-black/30 px-4 py-1.5 rounded-full z-10 text-green-100">1:2</span>
                        </button>
                        
                        <button onClick={() => handleBet('violet')} disabled={isBetting} className="bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-black py-8 sm:py-12 rounded-3xl shadow-[0_15px_30px_rgba(168,85,247,0.3)] transform hover:-translate-y-2 transition-all active:scale-95 text-2xl sm:text-3xl flex flex-col items-center justify-center border-t-2 border-purple-300/50 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                            <span className="drop-shadow-lg z-10 tracking-widest">VIOLET</span>
                            <span className="text-xs sm:text-sm font-bold opacity-100 mt-3 bg-black/30 px-4 py-1.5 rounded-full z-10 text-purple-100">1:4.5</span>
                        </button>
                        
                        <button onClick={() => handleBet('red')} disabled={isBetting} className="bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-black py-8 sm:py-12 rounded-3xl shadow-[0_15px_30px_rgba(239,68,68,0.3)] transform hover:-translate-y-2 transition-all active:scale-95 text-2xl sm:text-3xl flex flex-col items-center justify-center border-t-2 border-red-300/50 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                            <span className="drop-shadow-lg z-10 tracking-widest">RED</span>
                            <span className="text-xs sm:text-sm font-bold opacity-100 mt-3 bg-black/30 px-4 py-1.5 rounded-full z-10 text-red-100">1:2</span>
                        </button>
                    </div>

                    <div className="bg-gray-900/60 p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-inner">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Total Amount</h3>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="relative w-full shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-2xl">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Coins className="text-gray-400" size={28} />
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    value={betAmount === 0 ? '' : betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    className="block w-full pl-16 pr-6 py-5 text-3xl font-black border border-gray-700 rounded-2xl bg-black/60 text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-center tracking-widest"
                                    placeholder="Amount"
                                />
                            </div>
                            <div className="grid grid-cols-4 sm:flex w-full sm:w-auto gap-3 flex-wrap">
                                {[10, 100, 1000, "MAX"].map(amt => (
                                    <button 
                                        key={amt} 
                                        onClick={() => setBetAmount(amt === "MAX" ? (user?.balance || 0) : amt)} 
                                        className={`bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 rounded-2xl px-6 py-5 font-black text-xl flex-grow sm:flex-grow-0 transition shadow-md active:scale-95 ${amt === 'MAX' ? 'text-yellow-400 border-yellow-500/30' : ''}`}
                                    >
                                        {amt !== "MAX" && "+"}{amt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pattern Grid - Casino Style Row */}
            <div className="mt-10 mb-20 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6 px-4">
                    <h2 className="text-xl font-black text-white flex items-center tracking-widest uppercase">
                        <span className="bg-blue-500 w-1.5 h-6 rounded-full mr-3"></span>
                        Game Record
                    </h2>
                </div>
                
                <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden">
                    {history.length > 0 ? (
                        <div className="flex justify-start gap-4 overflow-x-auto pb-4 scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <AnimatePresence>
                                {history.map((record, idx) => (
                                    <motion.div 
                                        key={record.roundId} 
                                        initial={{ opacity: 0, scale: 0.5 }} 
                                        animate={{ opacity: 1, scale: 1 }} 
                                        transition={{ delay: idx * 0.05, type: 'spring' }}
                                        className="flex flex-col items-center flex-shrink-0"
                                    >
                                        <p className="text-gray-500 text-[10px] sm:text-xs font-mono font-bold mb-3 tracking-wider">{record.roundId.toString().slice(-4)}</p>
                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-black border-2 border-white/20 ${getColorClass(record.result.color)}`}>
                                            {record.result.number}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-24 text-gray-500 font-bold uppercase tracking-widest">
                            <Clock className="animate-spin-slow mr-3" size={24} /> Fetching
                        </div>
                    )}
                </div>
            </div>
            
        </div>
      </div>
    </ProtectedRoute>
  );
}
