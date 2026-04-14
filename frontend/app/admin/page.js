"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { Users, LayoutList, Banknote, Plus, Search, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); // users, tasks, withdrawals
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '', description: '', reward: 10, link: '', maxCompletions: 0
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.data);
      } else if (activeTab === 'tasks') {
        const res = await api.get('/admin/tasks');
        setTasks(res.data.data);
      } else if (activeTab === 'withdrawals') {
        const res = await api.get('/admin/withdrawals');
        setWithdrawals(res.data.data);
      } else if (activeTab === 'deposits') {
        const res = await api.get('/admin/deposits');
        setDeposits(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.post('/admin/tasks', newTask);
      setShowTaskForm(false);
      setNewTask({ title: '', description: '', reward: 10, link: '', maxCompletions: 0 });
      fetchData();
    } catch (error) {
      alert('Error creating task');
    } finally {
      setIsCreating(false);
    }
  };

  const processWithdrawal = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
    try {
      await api.put(`/admin/withdrawals/${id}`, { status, adminNote: `Processed by admin` });
      fetchData();
    } catch (error) {
      alert('Error processing withdrawal');
    }
  };

  const processDeposit = async (id, status) => {
    if (!window.confirm(`Confirm marking this deposit ticket as ${status.toUpperCase()}?`)) return;
    try {
      await api.put(`/admin/deposits/${id}`, { status });
      fetchData();
    } catch (error) {
      alert('Error processing deposit');
    }
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-rose-400 flex items-center gap-2">
            Admin Panel
          </h1>
          <p className="text-gray-400">Manage total platform functionality with admin privileges.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto">
          {[
            { id: 'users', label: 'Manage Users', icon: Users },
            { id: 'tasks', label: 'Manage Tasks', icon: LayoutList },
            { id: 'withdrawals', label: 'Review Withdrawals', icon: Banknote },
            { id: 'deposits', label: 'Verify User Deposits', icon: Banknote },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              
              {/* === USERS TAB === */}
              {activeTab === 'users' && (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs uppercase bg-black/20 text-gray-400">
                        <tr>
                          <th className="px-6 py-4">Username</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Balance</th>
                          <th className="px-6 py-4">Referrals</th>
                          <th className="px-6 py-4">Joined At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-6 py-4 font-medium text-white">{u.username} <span className="text-xs text-rose-400 block">{u.role === 'admin' && 'Admin'}</span></td>
                            <td className="px-6 py-4">{u.email}</td>
                            <td className="px-6 py-4 text-yellow-400 font-mono font-bold">{u.balance}</td>
                            <td className="px-6 py-4">{u.referredUsers?.length || 0}</td>
                            <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* === TASKS TAB === */}
              {activeTab === 'tasks' && (
                <div className="space-y-6">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowTaskForm(!showTaskForm)}
                      className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Create New Task
                    </button>
                  </div>

                  {showTaskForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-6 border border-rose-500/20">
                      <h3 className="text-xl font-bold mb-4">Create New Task</h3>
                      <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-sm text-gray-400">Title</label>
                          <input type="text" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm text-gray-400">Description</label>
                          <textarea required rows="2" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none"></textarea>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Reward (Coins)</label>
                          <input type="number" min="1" required value={newTask.reward} onChange={e => setNewTask({...newTask, reward: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Task Link URL</label>
                          <input type="url" required value={newTask.link} onChange={e => setNewTask({...newTask, link: e.target.value})} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Max Completions (0 = unlimited)</label>
                          <input type="number" min="0" value={newTask.maxCompletions} onChange={e => setNewTask({...newTask, maxCompletions: Number(e.target.value)})} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none" />
                        </div>
                        <div className="md:col-span-2 mt-4 flex justify-end gap-3">
                          <button type="button" onClick={() => setShowTaskForm(false)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg">Cancel</button>
                          <button type="submit" disabled={isCreating} className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold">{isCreating ? 'Creating...' : 'Publish Task'}</button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map(t => (
                      <div key={t._id} className="glass-card p-5 border border-white/5 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg leading-tight">{t.title}</h4>
                            <span className="bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded text-xs shrink-0">{t.reward} Coins</span>
                          </div>
                          <p className="text-sm text-gray-400 mb-4">{t.description}</p>
                        </div>
                        <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                          <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <span className={`text-sm ${t.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{t.status}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Completions</p>
                            <span className="text-sm text-white">{t.completedBy.length} / {t.maxCompletions === 0 ? '∞' : t.maxCompletions}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* === WITHDRAWALS TAB === */}
              {activeTab === 'withdrawals' && (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs uppercase bg-black/20 text-gray-400">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Payment Info</th>
                          <th className="px-6 py-4">Requested</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {withdrawals.length === 0 ? (
                          <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No withdrawal requests found.</td></tr>
                        ) : withdrawals.map(w => (
                          <tr key={w._id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-6 py-4">
                              <span className="text-white block font-medium">{w.user?.username}</span>
                              <span className="text-xs text-gray-500">{w.user?.email}</span>
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-yellow-400">{w.amount}</td>
                            <td className="px-6 py-4 text-xs font-mono bg-black/30 rounded p-2 m-2 inline-block max-w-[200px] truncate">{w.paymentDetails}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(w.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                w.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                w.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {w.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {w.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => processWithdrawal(w._id, 'approved')} className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded transition-colors" title="Approve">
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => processWithdrawal(w._id, 'rejected')} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors" title="Reject & Refund">
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* === DEPOSITS TAB === */}
              {activeTab === 'deposits' && (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs uppercase bg-black/20 text-gray-400">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Recharge Amount</th>
                          <th className="px-6 py-4">UTR Number</th>
                          <th className="px-6 py-4">Requested</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deposits.length === 0 ? (
                          <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No deposit requests pending.</td></tr>
                        ) : deposits.map(d => (
                          <tr key={d._id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="px-6 py-4">
                              <span className="text-white block font-medium">{d.user?.username}</span>
                              <span className="text-xs text-gray-500">{d.user?.email}</span>
                            </td>
                            <td className="px-6 py-4 font-mono font-bold text-yellow-400">₹{d.amount}</td>
                            <td className="px-6 py-4 font-mono text-white bg-black/40 px-2 py-1 rounded tracking-widest">{d.utrNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                d.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                d.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {d.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {d.status === 'pending' && (
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => processDeposit(d._id, 'approved')} className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded transition-colors" title="Verify & Credit Amount">
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                  <button onClick={() => processDeposit(d._id, 'rejected')} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors" title="Reject Fake UTR">
                                    <XCircle className="w-5 h-5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </div>

      </div>
    </ProtectedRoute>
  );
}
