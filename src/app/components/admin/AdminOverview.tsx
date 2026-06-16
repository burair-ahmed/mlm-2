'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'sonner';
import { Users, DollarSign, Award, ShieldCheck } from 'lucide-react';

interface User {
  _id: string;
  email: string;
  fullName?: string;
  balance: number;
  commissionEarned: number;
  isAdmin: boolean;
  createdAt: string;
}

export default function AdminOverview() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-white/5 border border-white/5 rounded-3xl" />
      </div>
    );
  }

  const totalUsers = users.length;
  const totalBalance = users.reduce((acc, u) => acc + (u.balance || 0), 0);
  const totalCommission = users.reduce((acc, u) => acc + (u.commissionEarned || 0), 0);
  const totalAdmins = users.filter((u) => u.isAdmin).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Users</span>
            <p className="text-2xl font-extrabold text-foreground">{totalUsers}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Total Balance */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Balance</span>
            <p className="text-2xl font-extrabold text-emerald-400">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Total Commission */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Commission Paid</span>
            <p className="text-2xl font-extrabold text-accent text-glow-gold">${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 text-accent">
            <Award className="h-5 w-5" />
          </div>
        </div>

        {/* Total Admins */}
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 backdrop-blur-md flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Staff Admins</span>
            <p className="text-2xl font-extrabold text-indigo-400">{totalAdmins}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="border border-white/5 rounded-2xl bg-slate-900/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="font-bold text-base text-foreground">Registered Accounts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Account Balance</th>
                <th className="p-4">Commissions Earned</th>
                <th className="p-4">Staff Admin</th>
                <th className="p-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-xs">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{u.fullName || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      ${(u.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 font-semibold text-primary">
                      ${(u.commissionEarned || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.isAdmin 
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                          : 'bg-white/5 text-muted-foreground'
                      }`}>
                        {u.isAdmin ? 'Staff' : 'User'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
