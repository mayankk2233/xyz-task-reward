"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Coins, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const { refreshUser } = useAuth();
  
  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async (taskId) => {
    setCompletingId(taskId);
    try {
      await api.post(`/tasks/${taskId}/complete`);
      await refreshUser(); // Update balance
      await fetchTasks(); // Refresh tasks list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete task');
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6 max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Available Tasks</h1>
          <p className="text-gray-400">Complete tasks to earn coins and grow your balance.</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400">No active tasks available right now. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={task._id} 
                className="glass-card flex flex-col h-full overflow-hidden border border-white/5"
              >
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-white">{task.title}</h3>
                      <span className="px-3 py-1 flex items-center gap-1 bg-yellow-400/20 text-yellow-400 rounded-full font-bold text-sm border border-yellow-400/30 shrink-0">
                        <Coins className="w-4 h-4" />
                        +{task.reward}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-6 line-clamp-3">{task.description}</p>
                  </div>
                  
                  <div className="mt-auto space-y-4">
                    <a 
                      href={task.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Task Link
                    </a>

                    {task.isCompleted ? (
                      <button disabled className="w-full py-3 bg-green-500/20 text-green-400 rounded-xl font-semibold flex flex-row justify-center items-center gap-2 border border-green-500/20 cursor-not-allowed">
                        <CheckCircle className="w-5 h-5" />
                        Completed
                      </button>
                    ) : task.isFull ? (
                      <button disabled className="w-full py-3 bg-white/5 text-gray-500 rounded-xl font-semibold cursor-not-allowed border border-white/5">
                        Max Capacity Reached
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleComplete(task._id)}
                        disabled={completingId === task._id}
                        className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {completingId === task._id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Mark as Completed'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
