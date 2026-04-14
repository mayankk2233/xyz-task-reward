'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Coins, Dices, Gamepad2 } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function GamesDashboard() {
  const games = [
    { id: 'coinflip', title: 'Coin Flip', description: 'Double your coins instantly with a 50/50 flip.', icon: <Coins size={32} className="text-yellow-400" />, comingSoon: false },
    { id: 'color', title: 'Color Prediction', description: 'Live 1-Minute Wingo betting with huge visual multipliers.', icon: <Dices size={32} className="text-purple-400" />, comingSoon: false },
  ];

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 size={40} className="text-blue-500" />
          <h1 className="text-4xl font-extrabold text-white">Arcade Hub</h1>
        </div>
        <p className="text-gray-400 mb-10 text-lg max-w-2xl">Bet your coins to instantly multiply your balance. Fair algorithms backed by real-time wallet transactions.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <motion.div key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              {game.comingSoon ? (
                <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 relative overflow-hidden opacity-50 cursor-not-allowed h-full flex flex-col">
                  <div className="absolute top-3 right-3 bg-gray-700/80 text-xs px-2 py-1 rounded font-bold text-gray-300">Coming Soon</div>
                  <div className="mb-5">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-gray-400">{game.description}</p>
                </div>
              ) : (
                <Link href={`/games/${game.id}`} className="block h-full group">
                  <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 relative overflow-hidden transition-all duration-300 hover:border-yellow-500/40 hover:shadow-[0_0_25px_rgba(234,179,8,0.15)] flex flex-col h-full">
                    <div className="mb-5 transform transition-transform group-hover:scale-110 group-hover:-rotate-3 origin-left">{game.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                    <p className="text-gray-400 flex-grow">{game.description}</p>
                    <div className="mt-6 text-yellow-400 font-semibold group-hover:underline flex items-center">Play Now <span className="ml-2 group-hover:ml-3 transition-all">→</span></div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
