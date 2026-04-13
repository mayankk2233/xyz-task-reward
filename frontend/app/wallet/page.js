"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, ArrowUpRight, ArrowDownLeft, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Wallet() {
  const { user, refreshUser } = useAuth();
  const [history, setHistory] = useState({ transactions: [], withdrawals: [] });
  const [loading, setLoading] = useState(true);
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchHistory = async () => {
    try {
      const res = await api.get('/wallet/history');
      setHistory(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setIsWithdrawing(true);
    setMessage('');
    try {
      await api.post('/wallet/withdraw', { 
        amount: Number(withdrawAmount), 
        paymentDetails 
      });
      setMessage('Withdrawal requested successfully!');
      setWithdrawAmount('');
      setPaymentDetails('');
      await refreshUser();
      await fetchHistory();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Withdrawal failed');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col - Balance & Withdraw */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-l-4 border-l-blue-500 border border-white/5 text-center">
            <h2 className="text-gray-400 font-medium mb-2">Available Balance</h2>
            <div className="text-5xl font-extrabold font-mono text-white mb-1">{user?.balance || 0}</div>
            <p className="text-sm text-gray-500">Coins</p>
          </div>

          <div className="glass-card p-6 border border-white/5">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              Request Withdrawal
            </h3>
            
            {message && (
              <div className={`p-3 rounded-xl text-sm mb-4 ${message.includes('success') ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Amount (Coins)</label>
                <input 
                  type="number" min="1" max={user?.balance || 0} required
                  value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Payment Details (PayPal/Crypto Address)</label>
                <textarea 
                  required rows="2"
                  value={paymentDetails} onChange={(e) => setPaymentDetails(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Enter your payment email or address..."
                ></textarea>
              </div>
              <button 
                type="submit" disabled={isWithdrawing || user?.balance <= 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isWithdrawing && <Loader2 className="w-4 h-4 animate-spin" />}
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* Right Col - History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border border-white/5 min-h-[500px]">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-500" /></div>
            ) : (
              <div className="space-y-4">
                {/* Mix transactions and withdrawals visually, or just show transactions since withdrawals also create a transaction */}
                {history.transactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">No recent activity found.</p>
                ) : (
                  history.transactions.map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${tx.type === 'withdraw' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {tx.type === 'withdraw' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-200">{tx.description}</p>
                          <p className="text-xs text-gray-500">{format(new Date(tx.createdAt), 'MMM dd, yyyy h:mm a')}</p>
                        </div>
                      </div>
                      <div className={`font-bold font-mono ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
