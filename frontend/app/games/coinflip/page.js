'use client';
import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowLeft, Trophy, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function CoinFlipGame() {
  const { user, setUser } = useContext(AuthContext);
  const [betAmount, setBetAmount] = useState(10);
  const [prediction, setPrediction] = useState('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFlip = async () => {
    if (betAmount <= 0) return setError('Bet amount must be greater than 0');
    if (user?.balance < betAmount) return setError('Insufficient balance');
    
    setError('');
    setIsFlipping(true);
    setResult(null);

    // Give immediate UI feedback visually deducting logic before server confirms for smoothness
    const currentBalance = user?.balance;
    setUser(prev => ({ ...prev, balance: Number(currentBalance) - Number(betAmount) }));

    try {
      const response = await api.post('/games/coinflip', { betAmount: Number(betAmount), prediction });
      const { data } = response.data;
      
      // Deliberate artificial timeout for suspenseful animation viewing
      setTimeout(() => {
        setResult(data);
        setIsFlipping(false);
        setUser(prev => ({ ...prev, balance: data.newBalance })); // Sync true server balance
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred');
      setIsFlipping(false);
      setUser(prev => ({ ...prev, balance: currentBalance })); // Revert on failure
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <Link href="/games" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Arcade
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2">Coin Flip</h1>
              <p className="text-gray-400">Guess the correct side and multiply your bet by 1.98x!</p>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-700/50 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <span className="text-gray-300 font-medium text-lg">Your Balance</span>
                <span className="px-4 py-1.5 bg-yellow-500/20 text-yellow-400 font-bold rounded-xl flex items-center shadow-[0_0_15px_rgba(234,179,8,0.15)] text-lg border border-yellow-500/30">
                  <Coins size={20} className="mr-2" />
                  {user?.balance || 0}
                </span>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 mx-1 p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl flex items-center text-sm font-medium">
                  <AlertCircle size={18} className="mr-3 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2 px-1">Bet Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Coins size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={user?.balance || 100}
                    value={betAmount === 0 ? '' : betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 sm:text-lg font-medium border border-gray-600 rounded-2xl bg-gray-900/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
                    disabled={isFlipping}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                     <button onClick={() => setBetAmount(Math.max(1, Math.floor((user?.balance || 0)/2)))} className="px-3 py-1.5 text-xs font-bold bg-gray-700/80 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition" disabled={isFlipping}>1/2</button>
                     <button onClick={() => setBetAmount(user?.balance || 0)} className="px-3 py-1.5 text-xs font-bold bg-gray-700/80 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition" disabled={isFlipping}>MAX</button>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-400 mb-2 px-1">I predict the coin will land on</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setPrediction('heads')} 
                    disabled={isFlipping}
                    className={`py-4 px-4 rounded-2xl border-2 transition-all font-extrabold tracking-wide ${prediction === 'heads' ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'}`}
                  >
                    HEADS
                  </button>
                  <button 
                    onClick={() => setPrediction('tails')} 
                    disabled={isFlipping}
                    className={`py-4 px-4 rounded-2xl border-2 transition-all font-extrabold tracking-wide ${prediction === 'tails' ? 'bg-yellow-600/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-gray-900/50 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'}`}
                  >
                    TAILS
                  </button>
                </div>
              </div>

              <button
                onClick={handleFlip}
                disabled={isFlipping || !betAmount}
                className={`w-full py-5 rounded-2xl font-extrabold text-xl tracking-wider transition-all duration-300 ${isFlipping ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/50' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] transform hover:-translate-y-1 block border border-blue-400/30'}`}
              >
                {isFlipping ? 'FLIPPING...' : 'FLIP COIN'}
              </button>
            </div>
          </div>

          {/* Visual Column */}
          <div className="bg-gray-900/40 backdrop-blur-md rounded-3xl border border-gray-800/80 flex flex-col items-center justify-center p-10 min-h-[450px] relative overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              {!isFlipping && !result && (
                <motion.div key="waiting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center text-gray-500">
                  <div className="w-32 h-32 rounded-full border-[6px] border-gray-700/50 flex flex-col items-center justify-center mx-auto mb-6 bg-gray-800/30">
                     <Coins size={48} className="text-gray-600" />
                  </div>
                  <p className="text-xl font-medium tracking-wide">Place your bet to start!</p>
                </motion.div>
              )}

              {isFlipping && (
                <motion.div 
                  key="flipping"
                  animate={{ 
                    rotateY: [0, 360, 720, 1080, 1440, 1800],
                    scale: [1, 1.4, 1.5, 1.4, 1],
                    y: [0, -40, -60, -40, 0]
                  }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="w-48 h-48 rounded-full border-[8px] border-yellow-400 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-amber-600 shadow-[0_0_80px_rgba(245,158,11,0.6)]"
                >
                  <span className="text-6xl font-extrabold text-white/90 drop-shadow-lg">?</span>
                </motion.div>
              )}

              {!isFlipping && result && (
                <motion.div 
                  key="result"
                  initial={{ scale: 0.3, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                  className="text-center flex flex-col items-center z-10 w-full"
                >
                  <div className={`w-48 h-48 rounded-full border-[8px] flex items-center justify-center mb-8 shadow-2xl ${result.result === 'heads' ? 'border-blue-400 bg-gradient-to-br from-blue-400 to-blue-700 shadow-[0_0_60px_rgba(59,130,246,0.6)]' : 'border-yellow-400 bg-gradient-to-br from-yellow-300 to-amber-600 shadow-[0_0_60px_rgba(245,158,11,0.6)]'}`}>
                    <span className={`text-5xl font-extrabold uppercase drop-shadow-md ${result.result === 'heads' ? 'text-white' : 'text-white'}`}>{result.result}</span>
                  </div>

                  {result.isWin ? (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-green-500/10 text-green-400 border border-green-500/40 px-8 py-4 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(34,197,94,0.15)] w-full max-w-sm">
                      <div className="flex items-center text-2xl font-bold mb-1"><Trophy size={28} className="mr-3 text-yellow-400" /> You Won!</div>
                      <div className="text-green-300/80">Payout: <span className="text-white font-extrabold text-xl ml-1">+{result.payout} Coins</span></div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-red-500/10 text-red-400 border border-red-500/30 px-8 py-4 rounded-2xl flex flex-col items-center w-full max-w-sm">
                      <div className="text-xl font-bold mb-1">Better luck next time</div>
                      <div className="text-red-400/80">You lost your bet.</div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Visual Screen Flares */}
            {result?.isWin && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }} transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-green-500/50 mix-blend-overlay z-0 pointer-events-none"
              />
            )}
            {result && !result?.isWin && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }} transition={{ duration: 1 }}
                className="absolute inset-0 bg-red-600/30 mix-blend-overlay z-0 pointer-events-none"
              />
            )}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
