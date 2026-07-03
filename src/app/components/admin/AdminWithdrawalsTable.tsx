'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Copy,
  Check,
  CreditCard,
  Building,
  Wallet,
  Smartphone,
  TrendingUp,
  Filter,
  Eye,
  RefreshCw,
  Calendar,
  DollarSign
} from 'lucide-react';

const PREDEFINED_REASONS = [
  'Incorrect Account Number / IBAN details',
  'Account title does not match registered name',
  'Insufficient wallet balance to cover fees',
  'Payment gateway provider maintenance/issues',
  'Suspicious account activity / security audit',
  'Custom Reason'
];

type Withdrawal = {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  } | null;
  method: string;
  amount: number;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  details: {
    accountTitle?: string;
    accountNumber?: string;
    bankName?: string;
    eWalletType?: string;
    extraInfo?: string;
  };
};

function CopyButton({ text }: { text?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 hover:bg-white/10 text-muted-foreground hover:text-white shrink-0 ml-1.5 transition-colors"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

export default function AdminWithdrawalsTable() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});

  // Confirm state for table-level actions
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    status: 'Completed' | 'Cancelled';
    amount: number;
    userName: string;
  } | null>(null);

  // Local confirm state for inside the detail modal
  const [modalConfirmStatus, setModalConfirmStatus] = useState<'Completed' | 'Cancelled' | null>(null);

  // States for rejection reasons
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [modalRejectionReason, setModalRejectionReason] = useState('');
  const [rejectionReasonSelect, setRejectionReasonSelect] = useState(PREDEFINED_REASONS[0]);
  const [modalRejectionReasonSelect, setModalRejectionReasonSelect] = useState(PREDEFINED_REASONS[0]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/withdrawals/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setWithdrawals(data.requests || []);
      } else {
        toast.error(data.message || 'Failed to load withdrawals');
      }
    } catch (err) {
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string, reason?: string) => {
    setUpdatingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/admin/withdrawals/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason })
      });

      if (res.ok) {
        toast.success(`Updated to ${status}`);
        fetchWithdrawals();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Helper: Get user initials
  const getInitials = (name?: string) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper: Get Method Icon
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'Bank Transfer':
        return <Building className="h-4 w-4 text-sky-400" />;
      case 'JazzCash':
        return <Smartphone className="h-4 w-4 text-amber-500" />;
      case 'EasyPaisa':
        return <Smartphone className="h-4 w-4 text-emerald-500" />;
      case 'SadaPay':
        return <CreditCard className="h-4 w-4 text-teal-400" />;
      default:
        return <Wallet className="h-4 w-4 text-slate-400" />;
    }
  };

  // Helper: Get Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pending
          </span>
        );
      case 'In Process':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/5">
            <Loader2 className="h-3 w-3 text-blue-400 animate-spin" />
            In Process
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/5">
            <XCircle className="h-3 w-3 text-rose-400" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    let pendingCount = 0, pendingSum = 0;
    let processCount = 0, processSum = 0;
    let completedCount = 0, completedSum = 0;
    let cancelledCount = 0, cancelledSum = 0;

    withdrawals.forEach((w) => {
      if (w.status === 'Pending') {
        pendingCount++;
        pendingSum += w.amount;
      } else if (w.status === 'In Process') {
        processCount++;
        processSum += w.amount;
      } else if (w.status === 'Completed') {
        completedCount++;
        completedSum += w.amount;
      } else if (w.status === 'Cancelled') {
        cancelledCount++;
        cancelledSum += w.amount;
      }
    });

    return {
      pending: { count: pendingCount, sum: pendingSum },
      inProcess: { count: processCount, sum: processSum },
      completed: { count: completedCount, sum: completedSum },
      cancelled: { count: cancelledCount, sum: cancelledSum },
      total: { count: withdrawals.length, sum: withdrawals.reduce((a, b) => a + b.amount, 0) }
    };
  }, [withdrawals]);

  // Filtering & Sorting
  const filteredAndSorted = useMemo(() => {
    let result = selectedStatus === 'All'
      ? withdrawals
      : withdrawals.filter((w) => w.status === selectedStatus);

    if (methodFilter !== 'All') {
      result = result.filter((w) => w.method === methodFilter);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter((w) => {
        const fullName = w.userId?.fullName?.toLowerCase() || '';
        const email = w.userId?.email?.toLowerCase() || '';
        const title = w.details?.accountTitle?.toLowerCase() || '';
        const num = w.details?.accountNumber?.toLowerCase() || '';
        const bank = w.details?.bankName?.toLowerCase() || '';
        return fullName.includes(q) || email.includes(q) || title.includes(q) || num.includes(q) || bank.includes(q);
      });
    }

    return [...result].sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortOption === 'amount-high') {
        return b.amount - a.amount;
      }
      if (sortOption === 'amount-low') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [withdrawals, selectedStatus, methodFilter, searchQuery, sortOption]);

  const renderDetailsModal = (w: Withdrawal) => {
    const isPendingOrProcessing = w.status === 'Pending' || w.status === 'In Process';

    return (
      <DialogContent 
        className="sm:max-w-[500px] bg-slate-950 border border-white/10 text-slate-100 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
        onInteractOutside={() => setModalConfirmStatus(null)}
      >
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col flex-1 min-h-0 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 shrink-0">
            <div>
              <DialogTitle className="text-lg font-bold text-slate-100 tracking-tight">
                Withdrawal Details
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Ref: {w._id}
              </p>
            </div>
            <div>
              {getStatusBadge(w.status)}
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-0 scrollbar-thin">
            {/* Requester */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Requesting User
              </h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {getInitials(w.userId?.fullName)}
                </div>
                <div>
                  <div className="font-semibold text-slate-200">
                    {w.userId?.fullName || 'Deleted User'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {w.userId?.email || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Amount
                </span>
                <span className="text-xl font-extrabold text-primary block mt-1">
                  ${w.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Requested Date
                </span>
                <span className="text-sm font-semibold text-slate-200 block mt-2 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {new Date(w.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Payout Destination */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Payout Destination
                </h4>
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  {getMethodIcon(w.method)}
                  {w.method}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Account Title:</span>
                  <span className="font-semibold text-slate-200 flex items-center text-right">
                    {w.details.accountTitle || 'N/A'}
                    {w.details.accountTitle && <CopyButton text={w.details.accountTitle} />}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">Account / IBAN:</span>
                  <span className="font-mono font-semibold text-slate-200 flex items-center text-right">
                    {w.details.accountNumber || 'N/A'}
                    {w.details.accountNumber && <CopyButton text={w.details.accountNumber} />}
                  </span>
                </div>

                {w.details.bankName && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Bank Name:</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-right">
                      <Building className="h-3.5 w-3.5 text-muted-foreground" />
                      {w.details.bankName}
                    </span>
                  </div>
                )}

                {w.details.eWalletType && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">Wallet Type:</span>
                    <span className="font-semibold text-slate-200 text-right">
                      {w.details.eWalletType}
                    </span>
                  </div>
                )}

                {w.details.extraInfo && (
                  <div className="pt-2.5 border-t border-white/5 mt-2">
                    <span className="text-[10px] font-bold text-muted-foreground block mb-1">Extra Info:</span>
                    <p className="text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                      {w.details.extraInfo}
                    </p>
                  </div>
                )}

                {w.status === 'Cancelled' && w.rejectionReason && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mt-3">
                    <span className="text-[10px] font-bold text-rose-400 block mb-1 uppercase tracking-wider">Rejection Reason</span>
                    <p className="text-xs text-rose-200 leading-relaxed font-semibold">{w.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer (with inline confirmation layout) */}
          <div className="shrink-0 pt-4 border-t border-white/5 space-y-4">
            {/* In-Modal Confirmation Overlay */}
            {modalConfirmStatus && (
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  {modalConfirmStatus === 'Completed' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Approve Withdrawal Payout?</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-400" />
                      <span>Reject Withdrawal Request?</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {modalConfirmStatus === 'Completed'
                    ? 'Confirm that you have completed the transfer. This will mark the request as Completed.'
                    : 'Confirm rejection of this request. This action cannot be undone.'}
                </p>

                {modalConfirmStatus === 'Cancelled' && (
                  <div className="space-y-3 mt-2 text-left">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Reason for Rejection</Label>
                      <Select 
                        value={modalRejectionReasonSelect} 
                        onValueChange={(val) => {
                          setModalRejectionReasonSelect(val);
                          if (val !== 'Custom Reason') {
                            setModalRejectionReason('');
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-slate-950 border-white/5 rounded-xl h-9 text-xs text-slate-300 focus:ring-0">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border-white/10 text-slate-100">
                          {PREDEFINED_REASONS.map((r) => (
                            <SelectItem key={r} value={r} className="text-xs">
                              {r}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {modalRejectionReasonSelect === 'Custom Reason' && (
                      <div className="space-y-1.5 animate-in fade-in duration-200">
                        <textarea
                          placeholder="Enter custom reason..."
                          value={modalRejectionReason}
                          onChange={(e) => setModalRejectionReason(e.target.value)}
                          className="w-full h-16 bg-slate-950 border border-white/5 focus:border-rose-500/50 rounded-xl p-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 text-xs pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setModalConfirmStatus(null);
                      setModalRejectionReasonSelect(PREDEFINED_REASONS[0]);
                      setModalRejectionReason('');
                    }}
                    className="h-8 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg"
                    disabled={updatingIds[w._id]}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={async () => {
                      const finalReason = modalRejectionReasonSelect === 'Custom Reason' ? modalRejectionReason : modalRejectionReasonSelect;
                      await updateStatus(w._id, modalConfirmStatus, finalReason);
                      setModalConfirmStatus(null);
                      setModalRejectionReasonSelect(PREDEFINED_REASONS[0]);
                      setModalRejectionReason('');
                    }}
                    className={`h-8 font-semibold rounded-lg ${
                      modalConfirmStatus === 'Completed' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                    }`}
                    disabled={
                      updatingIds[w._id] || 
                      (modalConfirmStatus === 'Cancelled' && 
                        ((modalRejectionReasonSelect === 'Custom Reason' && !modalRejectionReason.trim()) || !modalRejectionReasonSelect)
                      )
                    }
                  >
                    {updatingIds[w._id] && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                    Confirm
                  </Button>
                </div>
              </div>
            )}

            {!modalConfirmStatus && (
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <DialogClose asChild>
                  <Button variant="ghost" className="hover:bg-white/5 text-slate-300 rounded-xl order-last sm:order-first">
                    Close
                  </Button>
                </DialogClose>

                {w.status === 'Pending' && (
                  <Button
                    onClick={async () => {
                      await updateStatus(w._id, 'In Process');
                    }}
                    className="bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-1.5"
                    disabled={updatingIds[w._id]}
                  >
                    {updatingIds[w._id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                    Mark Processing
                  </Button>
                )}

                {isPendingOrProcessing && (
                  <>
                    <Button
                      onClick={() => setModalConfirmStatus('Completed')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1.5"
                      disabled={updatingIds[w._id]}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => setModalConfirmStatus('Cancelled')}
                      variant="destructive"
                      className="rounded-xl font-semibold flex items-center gap-1.5"
                      disabled={updatingIds[w._id]}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    );
  };

  const statusTabItems = ['All', 'Pending', 'In Process', 'Completed', 'Cancelled'];

  const getStatusCount = (status: string) => {
    switch (status) {
      case 'All': return stats.total.count;
      case 'Pending': return stats.pending.count;
      case 'In Process': return stats.inProcess.count;
      case 'Completed': return stats.completed.count;
      case 'Cancelled': return stats.cancelled.count;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 flex items-center gap-2 tracking-tight">
            <TrendingUp className="h-6 w-6 text-primary" />
            Withdrawal Management
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Review, process, and track client withdrawal transactions.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchWithdrawals}
          disabled={loading}
          className="h-9 bg-slate-900/50 border-white/5 text-slate-200 hover:bg-slate-900 hover:text-white rounded-xl flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-3xl border border-amber-500/10 bg-amber-500/5 backdrop-blur-xl p-5 shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Pending Requests</span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="h-4 w-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground text-amber-200">
              ${stats.pending.sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-amber-400/80 mt-1 uppercase tracking-wide">
              {stats.pending.count} active pending requests
            </p>
          </div>
        </motion.div>

        {/* Processing Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-3xl border border-blue-500/10 bg-blue-500/5 backdrop-blur-xl p-5 shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">In Process</span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground text-blue-200">
              ${stats.inProcess.sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-blue-400/80 mt-1 uppercase tracking-wide">
              {stats.inProcess.count} requests being processed
            </p>
          </div>
        </motion.div>

        {/* Completed Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-emerald-500/5 backdrop-blur-xl p-5 shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Completed Payouts</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground text-emerald-200">
              ${stats.completed.sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-emerald-400/80 mt-1 uppercase tracking-wide">
              {stats.completed.count} completed successfully
            </p>
          </div>
        </motion.div>

        {/* Total Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 backdrop-blur-xl p-5 shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Total Volume</span>
            <div className="h-8 w-8 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground text-primary-200">
              ${stats.total.sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-primary/80 mt-1 uppercase tracking-wide">
              {stats.total.count} transactions in history
            </p>
          </div>
        </motion.div>
      </div>

      {/* Control Panel: Tabs, Search, and Filters */}
      <div className="bg-slate-900/15 border border-white/5 rounded-3xl p-5 md:p-6 space-y-5 backdrop-blur-xl">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto scrollbar-none">
          {statusTabItems.map((tab) => {
            const isActive = selectedStatus === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`relative px-4 py-2 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/25 shadow-md shadow-primary/5'
                    : 'bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white border border-transparent'
                }`}
              >
                {tab}
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  isActive ? 'bg-primary/25 text-primary-100' : 'bg-white/5 text-muted-foreground'
                }`}>
                  {getStatusCount(tab)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search user, title, number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/40 border-white/5 focus:border-primary/40 focus:ring-1 focus:ring-primary/20 text-slate-100 rounded-xl h-10 w-full"
            />
          </div>

          {/* Select Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[140px] bg-slate-900/40 border-white/5 rounded-xl h-10 text-xs">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-white/10 text-slate-100">
                  <SelectItem value="All">All Methods</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="JazzCash">JazzCash</SelectItem>
                  <SelectItem value="EasyPaisa">EasyPaisa</SelectItem>
                  <SelectItem value="SadaPay">SadaPay</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[170px] bg-slate-900/40 border-white/5 rounded-xl h-10 text-xs">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-slate-950 border-white/10 text-slate-100">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                  <SelectItem value="amount-low">Amount: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="relative rounded-3xl border border-white/5 bg-slate-950/40 overflow-hidden shadow-2xl backdrop-blur-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-center gap-3">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-xs text-muted-foreground font-semibold">Loading transactions...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/80 text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Method</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Requested Date</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <div className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground mb-4">
                          <Wallet className="h-6 w-6 text-slate-500" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-200">No requests found</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                          We couldn't find any withdrawal requests matching your search query, status, or method filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredAndSorted.map((w) => (
                      <motion.tr
                        key={w._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        {/* User */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary font-bold text-xs shadow-inner shadow-primary/5">
                              {getInitials(w.userId?.fullName)}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-200 truncate max-w-[150px] md:max-w-none">
                                {w.userId?.fullName || 'Deleted User'}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[150px] md:max-w-none">
                                {w.userId?.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Method */}
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-slate-200">
                            <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                              {getMethodIcon(w.method)}
                            </div>
                            <span className="text-xs font-semibold">{w.method}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-4">
                          <div className="font-bold text-slate-100 text-sm md:text-base">
                            ${w.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>{new Date(w.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          {getStatusBadge(w.status)}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 bg-slate-900/40 hover:bg-slate-900 text-slate-200 hover:text-white border-white/5 rounded-lg flex items-center gap-1.5"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>Details</span>
                                </Button>
                              </DialogTrigger>
                              {renderDetailsModal(w)}
                            </Dialog>

                            <div className="flex items-center gap-2 min-w-[80px] justify-end">
                              {updatingIds[w._id] ? (
                                <div className="h-8 w-18 flex items-center justify-center">
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                              ) : (w.status === 'Pending' || w.status === 'In Process') ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-emerald-500/10 hover:bg-emerald-600 border-emerald-500/20 text-emerald-400 hover:text-white rounded-lg transition-all"
                                    onClick={() => setConfirmAction({
                                      id: w._id,
                                      status: 'Completed',
                                      amount: w.amount,
                                      userName: w.userId?.fullName || 'Deleted User'
                                    })}
                                    title="Approve & Complete"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-rose-500/10 hover:bg-rose-600 border-rose-500/20 text-rose-400 hover:text-white rounded-lg transition-all"
                                    onClick={() => setConfirmAction({
                                      id: w._id,
                                      status: 'Cancelled',
                                      amount: w.amount,
                                      userName: w.userId?.fullName || 'Deleted User'
                                    })}
                                    title="Reject & Cancel"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2.5 py-1 bg-white/5 rounded-lg border border-white/5">
                                  Finalized
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal overlay (triggered from table row action clicks) */}
      <Dialog 
        open={confirmAction !== null} 
        onOpenChange={(open) => { 
          if (!open) {
            setConfirmAction(null);
            setRejectionReasonSelect(PREDEFINED_REASONS[0]);
            setRejectionReasonInput('');
          }
        }}
      >
        {confirmAction && (
          <DialogContent className="sm:max-w-[420px] bg-slate-950 border border-white/10 text-slate-100 rounded-3xl shadow-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                  confirmAction.status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm shadow-rose-500/5'
                }`}>
                  {confirmAction.status === 'Completed' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-100">
                    {confirmAction.status === 'Completed' ? 'Confirm Approval' : 'Confirm Rejection'}
                  </DialogTitle>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Ref: {confirmAction.id}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {confirmAction.status === 'Completed' ? (
                  <>
                    Are you sure you want to <strong>approve</strong> the withdrawal request of{' '}
                    <strong className="text-primary">${confirmAction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> for{' '}
                    <strong>{confirmAction.userName}</strong>? Please ensure you have dispatched the funds via their requested payment method.
                  </>
                ) : (
                  <>
                    Are you sure you want to <strong>reject and cancel</strong> the withdrawal request of{' '}
                    <strong className="text-rose-400">${confirmAction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> for{' '}
                    <strong>{confirmAction.userName}</strong>? This action is permanent and cannot be undone.
                  </>
                )}
              </p>

              {confirmAction.status === 'Cancelled' && (
                <div className="space-y-3 mt-3 text-left">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300 font-semibold">Reason for Rejection</Label>
                    <Select 
                      value={rejectionReasonSelect} 
                      onValueChange={(val) => {
                        setRejectionReasonSelect(val);
                        if (val !== 'Custom Reason') {
                          setRejectionReasonInput('');
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-slate-900 border-white/5 rounded-xl h-10 text-xs text-slate-200">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-950 border-white/10 text-slate-100">
                        {PREDEFINED_REASONS.map((r) => (
                          <SelectItem key={r} value={r} className="text-xs">
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {rejectionReasonSelect === 'Custom Reason' && (
                    <div className="space-y-1.5 animate-in fade-in duration-200">
                      <textarea
                        placeholder="Enter custom rejection reason here..."
                        value={rejectionReasonInput}
                        onChange={(e) => setRejectionReasonInput(e.target.value)}
                        className="w-full h-20 bg-slate-900 border border-white/5 focus:border-rose-500/50 rounded-xl p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setConfirmAction(null);
                    setRejectionReasonSelect(PREDEFINED_REASONS[0]);
                    setRejectionReasonInput('');
                  }}
                  className="hover:bg-white/5 text-slate-300 rounded-xl text-xs h-9"
                  disabled={updatingIds[confirmAction.id]}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    const finalReason = rejectionReasonSelect === 'Custom Reason' ? rejectionReasonInput : rejectionReasonSelect;
                    await updateStatus(confirmAction.id, confirmAction.status, finalReason);
                    setConfirmAction(null);
                    setRejectionReasonSelect(PREDEFINED_REASONS[0]);
                    setRejectionReasonInput('');
                  }}
                  className={`rounded-xl text-xs h-9 font-semibold ${
                    confirmAction.status === 'Completed'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-rose-600 hover:bg-rose-700 text-white'
                  }`}
                  disabled={
                    updatingIds[confirmAction.id] || 
                    (confirmAction.status === 'Cancelled' && 
                      ((rejectionReasonSelect === 'Custom Reason' && !rejectionReasonInput.trim()) || !rejectionReasonSelect)
                    )
                  }
                >
                  {updatingIds[confirmAction.id] && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />}
                  Confirm {confirmAction.status === 'Completed' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
