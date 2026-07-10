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

        {/* System Settings Card */}
        <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2 mb-4 text-yellow-400">
            <Database className="h-5 w-5 text-yellow-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">System Configuration</h3>
          </div>
          <form onSubmit={handleUpdateSettings} className="flex flex-col sm:flex-row items-end gap-4 max-w-xl">
            <div className="flex-1 w-full space-y-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Equity Unit Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={equityUnitPriceInput}
                onChange={(e) => setEquityUnitPriceInput(e.target.value)}
                placeholder="e.g. 10.00"
                className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-slate-950/50 text-sm text-slate-200 focus:outline-none focus:border-yellow-500/50 transition-all duration-300"
                required
              />
            </div>
            <button
              type="submit"
              disabled={updatingSettings}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-400 hover:text-white hover:bg-yellow-500 rounded-xl text-xs font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
          {settingsSuccess && (
            <p className="mt-3 text-xs font-semibold text-emerald-400">{settingsSuccess}</p>
          )}
          {settingsError && (
            <p className="mt-3 text-xs font-semibold text-red-400">{settingsError}</p>
          )}
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
