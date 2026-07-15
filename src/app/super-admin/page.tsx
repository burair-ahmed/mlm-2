'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { 
  ShieldAlert, 
  Search, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Database, 
  Activity, 
  Users, 
  Clock, 
  X,
  RefreshCw,
  Eye,
  FileCode
} from 'lucide-react';

interface AuditLogEntry {
  _id: string;
  adminId?: {
    _id: string;
    userName: string;
    email: string;
    fullName?: string;
  };
  action: string;
  targetId: string;
  targetModel: string;
  details: string;
  createdAt: string;
}

export default function SuperAdminAuditDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // State Management
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [fetching, setFetching] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Settings Configuration State
  const [equityUnitPriceInput, setEquityUnitPriceInput] = useState('');
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // Lock/Unlock state for equity price editor
  const [settingsLocked, setSettingsLocked] = useState(true);
  const [lockPasswordInput, setLockPasswordInput] = useState('');
  const [lockError, setLockError] = useState('');
  const SETTINGS_LOCK_PASSWORD = process.env.NEXT_PUBLIC_SETTINGS_LOCK_PASSWORD || 'superadmin123';

  const handleUnlockSettings = () => {
    if (lockPasswordInput === SETTINGS_LOCK_PASSWORD) {
      setSettingsLocked(false);
      setLockError('');
      setLockPasswordInput('');
    } else {
      setLockError('Incorrect password. Please try again.');
    }
  };

  // Fetch current settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && typeof data.equityUnitPrice === 'number') {
            setEquityUnitPriceInput(data.equityUnitPrice.toString());
          }
        }
      } catch (error) {
        console.error("Failed to load settings in Super Admin:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSettings(true);
    setSettingsSuccess('');
    setSettingsError('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ equityUnitPrice: Number(equityUnitPriceInput) })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSettingsSuccess('Equity unit price updated successfully.');
      // Refresh logs
      fetchAuditLogs(1);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setUpdatingSettings(false);
    }
  };

  // Authentication checking
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch logs
  const fetchAuditLogs = async (page: number) => {
    if (!user || user.role !== 'Super Admin') return;
    setFetching(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        action: actionFilter,
        targetModel: modelFilter,
        search: searchQuery
      });

      const response = await fetch(`/api/super-admin/audit-logs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setTotalLogs(data.total || 0);
        setTotalPages(data.pages || 1);
        setCurrentPage(data.page || 1);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setFetching(false);
    }
  };

  // Trigger fetch on filter change
  useEffect(() => {
    setCurrentPage(1);
    fetchAuditLogs(1);
  }, [actionFilter, modelFilter, searchQuery]);

  // Handle pagination clicks
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    fetchAuditLogs(page);
  };

  // Calculate statistics based on fetched logs
  const stats = useMemo(() => {
    const uniqueAdmins = new Set(logs.map(log => log.adminId?.email).filter(Boolean));
    const actionCounts = logs.reduce((acc: Record<string, number>, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});
    
    return {
      uniqueAdminsCount: uniqueAdmins.size,
      mostCommonAction: Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
    };
  }, [logs]);

  // Format dates beautifully
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return dateString;
    }
  };

  // Map action slugs to pretty tags
  const getActionBadgeStyle = (action: string) => {
    const isApprove = action.includes('approve') || action.includes('create');
    const isReject = action.includes('reject') || action.includes('delete');
    
    if (isApprove) {
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    }
    if (isReject) {
      return 'bg-red-500/10 text-red-400 border border-red-500/20';
    }
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-slate-100 text-lg font-sans">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-4 w-4 bg-yellow-400 rounded-full animate-bounce" />
          <span>Validating Super Admin Authorization...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Double check authorization
  if (user.role !== 'Super Admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
        <div className="relative p-8 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-xl shadow-2xl max-w-md w-full text-center space-y-6">
          <div className="mx-auto h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight">Access Denied</h1>
            <p className="text-sm text-slate-400">
              Only users with the role of <span className="text-red-400 font-semibold">Super Admin</span> can access the system audit panels.
            </p>
          </div>
          <button
            onClick={() => router.push('/user')}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to User Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-yellow-400">
              <ShieldAlert className="h-5 w-5" />
              <span className="text-xs font-semibold tracking-widest uppercase">System Audit Panel</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Administrative Logs</h1>
            <p className="text-sm text-slate-400">Forensic records of all administrative actions and status updates.</p>
          </div>
          
          <button
            onClick={() => router.push('/user')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer self-start md:self-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit Audit Workspace
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Events Logged</p>
              <h2 className="text-2xl font-bold text-white mt-1">{totalLogs}</h2>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Active Administrators</p>
              <h2 className="text-2xl font-bold text-white mt-1">{stats.uniqueAdminsCount}</h2>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Frequent Logged Action</p>
              <h2 className="text-base font-bold text-white mt-2 truncate max-w-[200px]">{stats.mostCommonAction}</h2>
            </div>
          </div>
        </div>

        {/* Equity Unit Price Card */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md shadow-lg overflow-hidden">

          {/* Card header — no generic title, just context + lock status */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9.17 9.17A4 4 0 0115 12a4 4 0 01-5.83 3.54M6.34 6.34l11.32 11.32"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Equity Unit Price</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug max-w-xs">
                  Sets the USD value of 1 equity unit. Affects profit distribution, buy/sell conversions, and all USD valuations across the platform.
                </p>
              </div>
            </div>
            {/* Current value pill + lock badge */}
            <div className="flex flex-col items-end gap-1.5 shrink-0 ml-4">
              <div className="px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-bold tabular-nums">
                ${equityUnitPriceInput || '—'} <span className="text-yellow-500/60 font-normal text-xs">/ unit</span>
              </div>
              {!settingsLocked ? (
                <button
                  onClick={() => { setSettingsLocked(true); setSettingsSuccess(''); setSettingsError(''); setLockError(''); }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-red-400 transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Re-lock
                </button>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Read-only
                </span>
              )}
            </div>
          </div>

          {/* Card body — relative wrapper so overlay stays inside */}
          <div className="relative">

            {/* ── Real edit form — always rendered, blurred when locked ── */}
            <div className={`px-6 py-5 transition-all duration-500 ${settingsLocked ? 'opacity-20 blur-sm pointer-events-none select-none' : 'opacity-100'}`}>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                Editing unlocked — changes apply platform-wide immediately
              </div>
              <form onSubmit={handleUpdateSettings} className="flex flex-col sm:flex-row items-end gap-4 max-w-xl">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    New Price per Equity Unit (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={equityUnitPriceInput}
                    onChange={(e) => setEquityUnitPriceInput(e.target.value)}
                    placeholder="e.g. 10.00"
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-slate-950/50 text-sm text-slate-200 focus:outline-none focus:border-yellow-500/50 transition-all duration-300 ring-1 ring-emerald-500/10"
                    required
                    autoFocus={!settingsLocked}
                  />
                </div>
                <button
                  type="submit"
                  disabled={updatingSettings}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-400 hover:text-white hover:bg-yellow-500 rounded-xl text-xs font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingSettings ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
              {settingsSuccess && <p className="mt-3 text-xs font-semibold text-emerald-400">{settingsSuccess}</p>}
              {settingsError && <p className="mt-3 text-xs font-semibold text-red-400">{settingsError}</p>}
            </div>

            {/* ── Frosted lock overlay — horizontal row, stays inside card ── */}
            {settingsLocked && (
              <div className="absolute inset-0 flex items-center px-6"
                style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.78) 100%)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              >
                <div className="w-full flex flex-col sm:flex-row items-center gap-3">

                  {/* Context label */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Equity Unit Price</p>
                      <p className="text-[10px] text-slate-400">Enter password to modify</p>
                    </div>
                  </div>

                  <div className="hidden sm:block h-7 w-px bg-white/8 shrink-0" />

                  {/* Password field */}
                  <div className="flex-1 w-full">
                    <div className="relative">
                      <input
                        type="password"
                        value={lockPasswordInput}
                        onChange={(e) => { setLockPasswordInput(e.target.value); setLockError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleUnlockSettings()}
                        placeholder="Admin password to unlock editing..."
                        className="w-full px-4 py-2.5 pr-10 rounded-xl border border-amber-500/20 bg-slate-950/70 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/15 transition-all duration-300"
                        autoFocus
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-3 top-2.5 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    {lockError && <p className="mt-1 text-[11px] font-semibold text-red-400">{lockError}</p>}
                  </div>

                  {/* Unlock CTA */}
                  <button
                    type="button"
                    onClick={handleUnlockSettings}
                    className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900 text-xs font-bold tracking-wide transition-all duration-200 shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 active:scale-95 whitespace-nowrap"
                  >
                    Unlock to Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Filters and Controls */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md shadow-lg space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit descriptions, actions, target models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/50 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 transition-all duration-300"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap gap-4 items-center">
              
              {/* Action Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Action:</span>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-white/10 bg-slate-950/50 text-xs text-slate-200 focus:outline-none focus:border-yellow-500/50 transition-all duration-300 cursor-pointer"
                >
                  <option value="all">All Actions</option>
                  <option value="approve_kyc">Approve KYC</option>
                  <option value="reject_kyc">Reject KYC</option>
                  <option value="approve_deposit">Approve Deposit</option>
                  <option value="reject_deposit">Reject Deposit</option>
                  <option value="approve_resale">Approve Resale</option>
                  <option value="reject_resale">Reject Resale</option>
                </select>
              </div>

              {/* Target Model Filter */}
              <div className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-xs text-slate-400">Entity:</span>
                <select
                  value={modelFilter}
                  onChange={(e) => setModelFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-white/10 bg-slate-950/50 text-xs text-slate-200 focus:outline-none focus:border-yellow-500/50 transition-all duration-300 cursor-pointer"
                >
                  <option value="all">All Models</option>
                  <option value="User">User</option>
                  <option value="DepositRequest">DepositRequest</option>
                  <option value="PurchasedPackage">PurchasedPackage</option>
                </select>
              </div>

              {/* Reset button */}
              {(actionFilter !== 'all' || modelFilter !== 'all' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setActionFilter('all');
                    setModelFilter('all');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Audit Log Table */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-4">Timestamp</th>
                  <th className="py-4 px-4">Action</th>
                  <th className="py-4 px-4">Administrator</th>
                  <th className="py-4 px-4">Target Entity</th>
                  <th className="py-4 px-4">Description</th>
                  <th className="py-4 px-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {fetching ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <div className="flex justify-center items-center gap-2 text-slate-400">
                        <RefreshCw className="h-4 w-4 animate-spin text-yellow-400" />
                        <span>Querying audit records...</span>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      No matching audit records found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr 
                      key={log._id}
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="py-4 px-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {formatDateTime(log.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${getActionBadgeStyle(log.action)}`}>
                          {log.action.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-200">
                          {log.adminId?.fullName || log.adminId?.userName || 'System'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {log.adminId?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300 border border-white/5">
                          {log.targetModel}
                        </span>
                        <div className="text-[11px] text-slate-500 font-mono mt-1">
                          {log.targetId}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-300 max-w-[280px] truncate">
                        {log.details}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/20 transition-all duration-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-4">
              <span className="text-xs text-slate-400">
                Page <span className="text-slate-200 font-semibold">{currentPage}</span> of <span className="text-slate-200 font-semibold">{totalPages}</span> ({totalLogs} items)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || fetching}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all duration-300"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || fetching}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all duration-300"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-2xl w-full rounded-2xl border border-white/10 bg-slate-900 shadow-2xl p-6 overflow-hidden space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Log Details</h3>
              </div>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-3">
                <span className="text-slate-400">Audit Log ID:</span>
                <span className="col-span-2 font-mono text-xs text-slate-200">{selectedLog._id}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-3">
                <span className="text-slate-400">Timestamp:</span>
                <span className="col-span-2 text-slate-200">{formatDateTime(selectedLog.createdAt)}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-3">
                <span className="text-slate-400">Action:</span>
                <span className="col-span-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getActionBadgeStyle(selectedLog.action)}`}>
                    {selectedLog.action.replace('_', ' ')}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-3">
                <span className="text-slate-400">Acting Admin:</span>
                <div className="col-span-2 space-y-0.5">
                  <div className="font-semibold text-slate-200">
                    {selectedLog.adminId?.fullName || selectedLog.adminId?.userName || 'System'}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedLog.adminId?.email || 'N/A'} (ID: {selectedLog.adminId?._id || 'System'})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-3">
                <span className="text-slate-400">Target Entity:</span>
                <div className="col-span-2 space-y-1">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-slate-300 border border-white/5 inline-block">
                    {selectedLog.targetModel}
                  </span>
                  <div className="text-xs text-slate-400 font-mono">{selectedLog.targetId}</div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 block mb-1">Details:</span>
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/50 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all duration-300"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
