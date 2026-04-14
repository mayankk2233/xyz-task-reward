"use client";
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Link as LinkIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authProvider = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await authProvider.register(formData.username, formData.email, formData.password, formData.referralCode);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-violet-500"></div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Join TaskReward and start earning today.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  name="username" type="text" required
                  value={formData.username} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 text-white placeholder-gray-500 transition-all transform-gpu"
                  placeholder="cooluser99"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  name="email" type="email" required
                  value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 text-white placeholder-gray-500 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  name="password" type="password" required minLength={6}
                  value={formData.password} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 text-white placeholder-gray-500 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Referral Code (Optional)</label>
                <span className="text-xs text-fuchsia-400 font-medium">+50 Coins Bonus</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  name="referralCode" type="text"
                  value={formData.referralCode} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 text-white placeholder-gray-500 transition-all uppercase"
                  placeholder="FRIENDCODE"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-6 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
             <div className="relative mb-6">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                 <div className="relative flex justify-center text-sm"><span className="px-3 bg-gray-900/10 text-gray-400 font-medium">Or quick register with</span></div>
             </div>
             
             <div className="flex justify-center w-full bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                 <GoogleLogin
                     onSuccess={async (credentialResponse) => {
                         try {
                           const base64Url = credentialResponse.credential.split('.')[1];
                           const payload = JSON.parse(window.atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
                           await authProvider.googleLogin({ token: credentialResponse.credential, email: payload.email, name: payload.name, referralCode: formData.referralCode });
                         } catch (err) { setError("Google login system encountered an error."); }
                     }}
                     onError={() => { setError("Google login popup closed or blocked."); }}
                     useOneTap
                     text="signup_with"
                     theme="filled_black"
                     shape="pill"
                 />
             </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:text-fuchsia-400 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
