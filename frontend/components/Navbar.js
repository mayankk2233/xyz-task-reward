"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Coins, Code, Settings, Gamepad2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                TaskReward
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-1 border border-white/10 rounded-full px-4 py-1.5 bg-white/5">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">{user.balance || 0}</span>
                </div>
                
                <Link href="/dashboard" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>

                <Link href="/games" title="Arcade Games" className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-full transition-colors">
                  <Gamepad2 className="w-5 h-5" />
                </Link>

                {user.role === 'admin' && (
                  <Link href="/admin" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                  </Link>
                )}

                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-full transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
