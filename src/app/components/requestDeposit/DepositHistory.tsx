'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Calendar, Eye, Clock, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

interface DepositRequest {
  _id: string;
  amount: number;
  pkrAmount?: number;
  paymentMethod: string;
  notes?: string;
  proofUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
}

interface DepositHistoryProps {
  refreshTrigger?: number;
}

export default function DepositHistory({ refreshTrigger = 0 }: DepositHistoryProps) {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyDeposits = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/deposit/my-requests', {
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        toast.error('Session expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      } else {
        toast.error(data.message || 'Failed to load deposit history');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching deposit history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDeposits();
  }, [refreshTrigger]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case 'Rejected':
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Clock className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="mx-auto mt-8 bg-slate-900/30 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl glass-panel relative overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-gold pointer-events-none opacity-5" />

      <h2 className="text-xl font-extrabold text-foreground mb-6 flex items-center gap-2 pb-3 border-b border-white/5">
        <ShieldCheck className="h-5 w-5 text-accent text-glow-gold" />
        <span>Deposit History & Status</span>
      </h2>

      <div className="border border-white/5 rounded-2xl bg-slate-900/10 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-4">Gateway</th>
                <th className="p-4">Amount (USD)</th>
                <th className="p-4">Amount (PKR)</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground animate-pulse text-xs">
                    Loading deposit history...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground text-xs font-medium">
                    No deposit requests found.
                  </td>
                </tr>
              ) : (
                requests.map((r) => {
                  const pkrAmount = r.pkrAmount || (r.amount * 280);
                  return (
                    <tr key={r._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold text-foreground">{r.paymentMethod}</td>
                      <td className="p-4 font-extrabold text-primary text-glow-emerald">
                        ${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-xs text-muted-foreground font-semibold">
                        {pkrAmount.toLocaleString()} PKR
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant="outline" 
                          className={`rounded-full px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wide flex items-center w-fit ${getStatusClass(r.status)}`}
                        >
                          {getStatusIcon(r.status)}
                          {r.status}
                        </Badge>
                        {r.status === 'Rejected' && r.rejectionReason && (
                          <div className="text-[10px] text-red-400 font-semibold mt-1 max-w-[120px] truncate" title={r.rejectionReason}>
                            Reason: {r.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl flex items-center gap-1 bg-white/5 border-white/10 hover:bg-white/10 text-xs px-3"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-950 text-slate-100 border border-white/10 max-w-lg rounded-3xl p-6 glass-panel overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-gold pointer-events-none opacity-5" />
                            <DialogTitle className="font-extrabold text-lg border-b border-white/5 pb-3 mb-4 flex items-center gap-2">
                              <span>Deposit Request Details</span>
                            </DialogTitle>
                            <div className="space-y-4 text-sm">
                              <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs">
                                <div>
                                  <span className="text-[10px] uppercase text-muted-foreground font-bold block mb-0.5">Amount (USD)</span>
                                  <p className="font-extrabold text-sm text-primary">${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase text-muted-foreground font-bold block mb-0.5">Amount (PKR)</span>
                                  <p className="font-bold text-sm text-foreground">{pkrAmount.toLocaleString()} PKR</p>
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase text-muted-foreground font-bold block mb-0.5">Gateway</span>
                                  <p className="font-bold text-sm text-foreground">{r.paymentMethod}</p>
                                </div>
                              </div>
                              {r.notes && (
                                <div>
                                  <span className="text-[10px] uppercase text-muted-foreground font-bold block mb-1">Your Notes</span>
                                  <p className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs leading-relaxed max-h-[80px] overflow-y-auto">{r.notes}</p>
                                </div>
                              )}
                              {r.status === 'Rejected' && r.rejectionReason && (
                                <div>
                                  <span className="text-[10px] uppercase text-red-400 font-bold block mb-1">Rejection Reason</span>
                                  <p className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl text-xs leading-relaxed max-h-[80px] overflow-y-auto">
                                    {r.rejectionReason}
                                  </p>
                                </div>
                              )}
                              <div>
                                <span className="text-[10px] uppercase text-muted-foreground font-bold block mb-2">Uploaded Proof of Payment</span>
                                <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-900/60 p-2">
                                  <img 
                                    src={r.proofUrl} 
                                    alt="Uploaded Payment Receipt" 
                                    className="w-full h-auto max-h-[250px] object-contain rounded-xl"
                                  />
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
