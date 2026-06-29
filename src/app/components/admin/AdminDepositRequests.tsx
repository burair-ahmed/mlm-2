'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '../../../../context/AuthContext';
import { FileCheck, XCircle, Calendar, Eye, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type DepositRequest = {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  amount: number;
  pkrAmount?: number;
  paymentMethod: string;
  notes?: string;
  proofUrl: string;
  status: string;
  rejectionReason?: string;
  createdAt: string;
};

export default function AdminDepositRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const [toggledRequests, setToggledRequests] = useState<Record<string, boolean>>({});
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCurrency = (id: string) => {
    setToggledRequests((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/deposits/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      } else {
        toast.error(data.message || 'Failed to load deposits');
      }
    } catch {
      toast.error('Failed to fetch deposit requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, status: 'Approved' | 'Rejected', reason?: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/deposits/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Deposit request successfully ${status.toLowerCase()}!`);
        fetchDeposits();
      } else {
        toast.error(data.error || 'Failed to update request');
      }
    } catch {
      toast.error('Error processing deposit status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmReject = async () => {
    if (!rejectRequestId) return;
    if (!rejectReason.trim()) {
      toast.error('Please enter or select a rejection reason');
      return;
    }
    await handleUpdate(rejectRequestId, 'Rejected', rejectReason.trim());
    setIsRejectOpen(false);
    setRejectRequestId(null);
    setRejectReason('');
  };

  const filtered = selectedStatus === 'All'
    ? requests
    : requests.filter((r) => r.status === selectedStatus);

  if (!user?.isAdmin) {
    return <div className="text-center py-8 text-red-400">Unauthorized Access</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Deposit Requests</h2>
        <Button onClick={fetchDeposits} disabled={loading} variant="outline" size="sm">
          Refresh List
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-slate-900/20 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter Status</Label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px] bg-slate-950/60 border-white/10 rounded-xl text-xs">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-slate-950 text-slate-100 border-white/10">
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-white/5 rounded-2xl bg-slate-900/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground animate-pulse text-xs">
                    Loading requests...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs">
                    No deposit requests found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{r.userId?.fullName || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">{r.userId?.email || 'N/A'}</div>
                    </td>
                    <td className="p-4 font-medium text-foreground">{r.paymentMethod}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleCurrency(r._id)}
                        className="text-left font-bold focus:outline-none select-none hover:opacity-80 transition-opacity block group"
                        title="Click to toggle currency display (USD / PKR)"
                      >
                        {toggledRequests[r._id] ? (
                          <div>
                            <div className="text-accent text-glow-gold">
                              {(r.pkrAmount || (r.amount * 280)).toLocaleString()} PKR
                            </div>
                            <span className="text-[9px] text-muted-foreground block font-medium mt-0.5 group-hover:text-foreground">
                              Click to show USD
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div className="text-primary text-glow-emerald">
                              ${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                            </div>
                            <span className="text-[9px] text-muted-foreground block font-medium mt-0.5 group-hover:text-foreground">
                              Click to show PKR: ~{(r.pkrAmount || (r.amount * 280)).toLocaleString()} PKR
                            </span>
                          </div>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground flex items-center gap-1.5 mt-2.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant="outline" 
                        className={`rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wide ${
                          r.status === 'Approved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : r.status === 'Rejected'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1 bg-white/5 border-white/10 hover:bg-white/10">
                              <Eye className="h-3.5 w-3.5" /> View Proof
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-950 text-slate-100 border-white/10 max-w-lg rounded-3xl p-6 glass-panel overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-emerald pointer-events-none opacity-10" />
                            <DialogTitle className="font-extrabold text-lg border-b border-white/5 pb-3 mb-4">Deposit Details</DialogTitle>
                            <div className="space-y-4 text-sm">
                              <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div>
                                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Amount (USD)</span>
                                  <p className="font-extrabold text-sm text-primary">${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Amount (PKR)</span>
                                  <p className="font-bold text-sm text-foreground">
                                    {(r.pkrAmount || (r.amount * 280)).toLocaleString()} PKR
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase text-muted-foreground font-bold">Gateway</span>
                                  <p className="font-bold text-sm text-foreground">{r.paymentMethod}</p>
                                </div>
                              </div>
                              {r.notes && (
                                <div>
                                  <span className="text-[10px] uppercase text-muted-foreground font-bold block mb-1">Notes / Ref Info</span>
                                  <p className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs leading-relaxed">{r.notes}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-[10px] uppercase text-muted-foreground font-bold block mb-2">Uploaded Proof Image</span>
                                <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-900/60 p-2">
                                  <img 
                                    src={r.proofUrl} 
                                    alt="Payment Receipt Screenshot" 
                                    className="w-full h-auto max-h-[300px] object-contain rounded-xl"
                                  />
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {r.status === 'Pending' && (
                          <>
                            <Button 
                              onClick={() => handleUpdate(r._id, 'Approved')} 
                              disabled={isSubmitting}
                              size="sm" 
                              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-1 shadow-lg shadow-emerald-500/10"
                            >
                              <FileCheck className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button 
                              onClick={() => {
                                setRejectRequestId(r._id);
                                setRejectReason('');
                                setIsRejectOpen(true);
                              }} 
                              disabled={isSubmitting}
                              size="sm" 
                              variant="destructive"
                              className="rounded-xl flex items-center gap-1 shadow-lg shadow-destructive/10"
                            >
                              <XCircle className="h-3.5 w-3.5" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="bg-slate-950 text-slate-100 border border-white/10 max-w-md rounded-3xl p-6 glass-panel overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-gold pointer-events-none opacity-5" />
          <DialogTitle className="font-extrabold text-lg border-b border-white/5 pb-3 mb-4">
            Reject Deposit Request
          </DialogTitle>
          <div className="space-y-4 text-sm mt-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Predefined Rejection Reasons (Click to select)
              </Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  'Incorrect / invalid proof screenshot',
                  'Incorrect deposit amount requested',
                  'Transaction ID / details do not match',
                  'Duplicate request submission',
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setRejectReason(reason)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      rejectReason === reason
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-foreground'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Custom Rejection Reason
              </Label>
              <Textarea
                placeholder="Enter custom rejection reason here..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="bg-slate-950/60 border-white/10 rounded-xl text-xs min-h-[80px]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => {
                  setIsRejectOpen(false);
                  setRejectRequestId(null);
                  setRejectReason('');
                }}
                className="rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isSubmitting}
                onClick={confirmReject}
                className="rounded-xl flex items-center gap-1 shadow-lg shadow-destructive/10"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {isSubmitting ? 'Rejecting...' : 'Confirm Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
