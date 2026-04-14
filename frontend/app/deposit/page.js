'use client';
import React, { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Copy, CheckCircle, UploadCloud, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '../../utils/api';
import { useRouter } from 'next/navigation';

export default function Deposit() {
  const [amount, setAmount] = useState(500);
  const [utrNumber, setUtrNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Hardcoded fake UPI for the prototype
  const upiId = "pay.taskreward@ybl";

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount < 100) return setStatus({ type: 'error', msg: 'Minimum deposit is ₹100' });
    if (utrNumber.length < 8) return setStatus({ type: 'error', msg: 'Please enter a valid UTR / Ref No.' });

    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      await api.post('/wallet/deposit', { amount: Number(amount), utrNumber });
      setStatus({ type: 'success', msg: 'Deposit request submitted! An admin will verify your UTR and credit your account shortly.' });
      setTimeout(() => router.push('/wallet'), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to submit deposit ticket.' });
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0f] py-10 px-4 sm:px-6 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-2xl mx-auto relative z-10">
          <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors bg-gray-900/50 backdrop-blur px-5 py-2.5 rounded-full border border-gray-800 font-bold">
              <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
             <div className="flex items-center gap-5 mb-8">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                     <Wallet className="text-white" size={32} />
                 </div>
                 <div>
                     <h1 className="text-3xl font-black text-white tracking-wide">Add Funds</h1>
                     <p className="text-gray-400 font-medium">Recharge your wallet instantly via UPI.</p>
                 </div>
             </div>

             <div className="bg-blue-900/10 border border-blue-500/20 p-6 sm:p-8 rounded-3xl mb-10 shadow-inner">
                 <h3 className="text-blue-400 font-black uppercase tracking-widest text-xs mb-3 flex items-center"><span className="bg-blue-500 w-2 h-2 rounded-full mr-2"></span> Step 1: Send Payment</h3>
                 <p className="text-gray-300 font-medium mb-6 leading-relaxed">Copy the UPI ID below and transfer the exact amount using PhonePe, Google Pay, mapping to your gaming account.</p>
                 <div className="flex flex-col sm:flex-row items-center bg-black/50 border border-gray-700/50 rounded-2xl p-2 gap-3 shadow-inner">
                     <span className="flex-1 text-center font-mono text-xl font-bold text-white tracking-widest py-2 sm:py-0 w-full">{upiId}</span>
                     <button onClick={copyUpi} className="w-full sm:w-auto p-4 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-white shadow-md active:scale-95">
                         {copied ? <CheckCircle size={20} /> : <Copy size={20} />} {copied ? 'Copied' : 'Copy ID'}
                     </button>
                 </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8">
                 <div>
                     <h3 className="text-gray-400 font-black uppercase tracking-widest text-xs mb-4 flex items-center"><span className="bg-gray-500 w-2 h-2 rounded-full mr-2"></span> Step 2: Submit Verification</h3>
                     <label className="block text-sm font-bold text-gray-300 mb-3 px-1">Recharge Amount (₹)</label>
                     <div className="grid grid-cols-4 gap-3 mb-4">
                         {[100, 500, 1000, 5000].map(amt => (
                             <button type="button" key={amt} onClick={() => setAmount(amt)} className={`py-4 rounded-xl font-black text-lg transition-all active:scale-95 ${amount === amt ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/50' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'}`}>
                                 ₹{amt}
                             </button>
                         ))}
                     </div>
                     <input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-black/40 border border-gray-700 text-white font-black text-2xl px-6 py-5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none mb-2 shadow-inner transition-all text-center"
                        placeholder="Custom Amount"
                     />
                 </div>

                 <div>
                     <label className="block text-sm font-bold text-gray-300 mb-3 px-1">12-Digit UTR / Transaction Reference No.</label>
                     <input 
                        type="text" 
                        required
                        value={utrNumber} 
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full bg-black/40 border border-gray-700 text-white font-mono font-bold text-xl px-6 py-5 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none placeholder-gray-600 shadow-inner transition-all text-center tracking-widest"
                        placeholder="e.g. 301234567890"
                     />
                     <p className="text-xs font-medium text-gray-500 mt-3 px-1 text-center">You can find the UTR number in your payment app's history.</p>
                 </div>

                 {status.msg && (
                     <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className={`p-5 rounded-2xl flex items-center font-bold text-sm shadow-lg ${status.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/30'}`}>
                         <AlertCircle size={24} className="mr-3 shrink-0" /> <span className="leading-relaxed">{status.msg}</span>
                     </motion.div>
                 )}

                 <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl py-6 rounded-2xl shadow-[0_15px_30px_rgba(37,99,235,0.4)] transition-all active:scale-95 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                 >
                     <UploadCloud size={24} /> {isSubmitting ? 'VERIFYING RECORD...' : 'SUBMIT DEPOSIT TICKET'}
                 </button>
             </form>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
