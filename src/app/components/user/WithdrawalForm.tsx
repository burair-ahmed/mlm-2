'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../context/AuthContext';
import { 
  ChevronDown, 
  HelpCircle, 
  Wallet, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  CustomDialog, 
  CustomDialogHeader, 
  CustomDialogTitle, 
  CustomDialogFooter 
} from '@/components/custom/CustomDialog';
import { 
  CustomTable, 
  CustomTableHeader, 
  CustomTableBody, 
  CustomTableRow, 
  CustomTableHead, 
  CustomTableCell 
} from '@/components/custom/CustomTable';

export default function WithdrawalForm() {
  const { user, refreshUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'request' | 'history'>('request');
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState({
    accountTitle: '',
    accountNumber: '',
    bankName: '',
    eWalletType: '',
    extraInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [agree, setAgree] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const numericAmount = parseFloat(amount);

  const fetchHistory = async () => {
    if (!token) return;
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/users/withdrawals/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(data.requests || []);
      } else {
        toast.error(data.error || 'Failed to load history');
      }
    } catch {
      toast.error('Failed to connect to history server');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Pre-fetch history if active sub-tab is history
  useEffect(() => {
    if (activeSubTab === 'history') {
      fetchHistory();
    }
  }, [activeSubTab]);

  if (!user) return <div className="text-muted-foreground text-center py-8">Loading user data...</div>;
  const remainingBalance = user?.balance - (isNaN(numericAmount) ? 0 : numericAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!method || !amount || !details.accountNumber || !details.accountTitle) {
      toast.error('Please fill all required fields');
      return;
    }

    if (numericAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (numericAmount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    setShowDialog(true);
  };

  const confirmSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/withdrawals/request', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ method, amount: parseFloat(amount), details }),
      });
        
      const data = await res.json();
      if (res.ok) {
        toast.success('Withdrawal request submitted successfully!');
        setAmount('');
        setMethod('');
        setDetails({
          accountTitle: '',
          accountNumber: '',
          bankName: '',
          eWalletType: '',
          extraInfo: '',
        });
        setShowDialog(false);
        setAgree(false);
        // Refresh history and switch to history view
        await fetchHistory();
        refreshUser();
        setActiveSubTab('history');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch {
      toast.error('Network error, try again later');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-glow-emerald",
          icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
        };
      case 'Cancelled':
        return {
          badge: "bg-red-500/10 text-red-400 border-red-500/20",
          icon: <XCircle className="h-3.5 w-3.5 text-red-400" />
        };
      case 'In Process':
        return {
          badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          icon: <Clock className="h-3.5 w-3.5 text-cyan-400" />
        };
      case 'Pending':
      default:
        return {
          badge: "bg-amber-500/10 text-accent border-amber-500/20 text-glow-gold",
          icon: <Clock className="h-3.5 w-3.5 text-accent" />
        };
    }
  };
  
  return (
    <div className={`${activeSubTab === 'history' ? 'max-w-4xl' : 'max-w-lg'} w-full mx-auto space-y-6 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl glass-panel relative overflow-hidden transition-all duration-500`}>
      {/* Subtle amber ambient glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-gold pointer-events-none opacity-10" />

      <h2 className="text-xl font-extrabold text-foreground mb-4 pb-3 border-b border-white/5 flex items-center gap-2">
        <Wallet className="h-5 w-5 text-accent text-glow-gold" />
        <span>Request Withdrawal</span>
      </h2>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 mb-6">
        <button
          type="button"
          onClick={() => setActiveSubTab('request')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
            activeSubTab === 'request'
              ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/25 border-glow-emerald shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          New Request
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
            activeSubTab === 'history'
              ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/25 border-glow-emerald shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          Withdrawal History
        </button>
      </div>

      {activeSubTab === 'history' ? (
        historyLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground animate-pulse text-sm">
            Loading withdrawal history...
          </div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <CustomTable>
              <CustomTableHeader>
                <CustomTableRow>
                  <CustomTableHead>Date</CustomTableHead>
                  <CustomTableHead>Method</CustomTableHead>
                  <CustomTableHead>Amount</CustomTableHead>
                  <CustomTableHead>Details</CustomTableHead>
                  <CustomTableHead>Status</CustomTableHead>
                </CustomTableRow>
              </CustomTableHeader>
              <CustomTableBody>
                {history.map((req) => {
                  const badgeStyle = getStatusStyle(req.status);
                  return (
                    <CustomTableRow key={req._id}>
                      <CustomTableCell className="font-semibold text-foreground text-xs whitespace-nowrap">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </CustomTableCell>
                      <CustomTableCell className="text-xs font-medium text-foreground whitespace-nowrap">
                        {req.method}
                      </CustomTableCell>
                      <CustomTableCell className="text-xs font-bold text-accent text-glow-gold whitespace-nowrap">
                        ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </CustomTableCell>
                      <CustomTableCell className="text-xs text-muted-foreground min-w-[150px] max-w-[240px]">
                        <div className="font-semibold text-foreground text-[11px] truncate">
                          {req.details?.accountTitle}
                        </div>
                        <div className="text-[10px] truncate">
                          {req.details?.accountNumber}
                        </div>
                        {req.method === 'Bank Transfer' && req.details?.bankName && (
                          <div className="text-[10px] text-muted-foreground truncate">
                            {req.details.bankName}
                          </div>
                        )}
                        {req.details?.eWalletType && (
                          <div className="text-[10px] text-muted-foreground truncate">
                            Type: {req.details.eWalletType}
                          </div>
                        )}
                        {req.status === 'Cancelled' && req.rejectionReason && (
                          <div className="text-[10px] text-rose-400 font-semibold mt-1 bg-rose-500/5 border border-rose-500/10 rounded-lg px-2 py-1.5 italic whitespace-normal">
                            Reason: {req.rejectionReason}
                          </div>
                        )}
                      </CustomTableCell>
                      <CustomTableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold capitalize whitespace-nowrap ${badgeStyle.badge}`}>
                          {badgeStyle.icon}
                          {req.status}
                        </span>
                      </CustomTableCell>
                    </CustomTableRow>
                  );
                })}
              </CustomTableBody>
            </CustomTable>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm font-medium">
            No withdrawal requests found.
          </div>
        )
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Withdrawal Method
            </label>
            <div className="relative">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all duration-300 appearance-none cursor-pointer"
                required
              >
                <option value="" disabled className="bg-slate-950 text-muted-foreground">Select method</option>
                <option value="Bank Transfer" className="bg-slate-950 text-foreground">Bank Transfer</option>
                <option value="JazzCash" className="bg-slate-950 text-foreground">JazzCash</option>
                <option value="EasyPaisa" className="bg-slate-950 text-foreground">EasyPaisa</option>
                <option value="SadaPay" className="bg-slate-950 text-foreground">SadaPay</option>
                <option value="Other" className="bg-slate-950 text-foreground">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 500"
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
              required
              min="1"
            />
            
            <div className="grid grid-cols-2 gap-4 mt-3 bg-white/5 p-3 rounded-xl border border-white/5 text-[11px]">
              <div>
                <span className="text-muted-foreground block mb-0.5">Available Wallet</span>
                <span className="font-extrabold text-foreground">${user.balance.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-0.5">Remaining Balance</span>
                <span className={`font-extrabold ${remainingBalance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  ${remainingBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Holder Name */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Account Holder Name
            </label>
            <input
              type="text"
              value={details.accountTitle}
              onChange={(e) => setDetails({ ...details, accountTitle: e.target.value })}
              placeholder="Name as it appears on account"
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
              required
            />
          </div>

          {/* Number */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Account / Wallet Number
            </label>
            <input
              type="text"
              value={details.accountNumber}
              onChange={(e) => setDetails({ ...details, accountNumber: e.target.value })}
              placeholder="IBAN or mobile number"
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
              required
            />
          </div>

          {/* Bank name field */}
          {method === 'Bank Transfer' && (
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={details.bankName}
                onChange={(e) => setDetails({ ...details, bankName: e.target.value })}
                placeholder="e.g. HBL, Meezan Bank, Alfalah"
                className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
                required
              />
            </div>
          )}

          {/* Wallet type field */}
          {['JazzCash', 'EasyPaisa', 'SadaPay', 'Other'].includes(method) && (
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Wallet Type (Optional)
              </label>
              <input
                type="text"
                value={details.eWalletType}
                onChange={(e) => setDetails({ ...details, eWalletType: e.target.value })}
                placeholder="e.g. Personal or Business account"
                className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
              />
            </div>
          )}

          {/* Extra info */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Extra Info (Optional)
            </label>
            <textarea
              value={details.extraInfo}
              onChange={(e) => setDetails({ ...details, extraInfo: e.target.value })}
              placeholder="Additional details or reference notes"
              className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30 min-h-[70px] resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={loading || remainingBalance < 0}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-primary/20 mt-6 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {/* Confirmation Dialog using custom glassmorphic modal */}
      <CustomDialog open={showDialog} onOpenChange={setShowDialog}>
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-2 text-accent text-glow-gold">
            <HelpCircle className="h-5 w-5 text-accent" />
            <span>Confirm Withdrawal</span>
          </CustomDialogTitle>
        </CustomDialogHeader>

        <div className="space-y-4 text-sm text-foreground my-4">
          <p className="text-muted-foreground">
            Please double-check your withdrawal credentials. Incorrect details can lead to permanent loss of capital.
          </p>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-accent text-glow-gold">${numericAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-muted-foreground">Gateway / Method</span>
              <span className="font-bold text-foreground">{method}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-muted-foreground">Account Title</span>
              <span className="font-bold text-foreground">{details.accountTitle}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-muted-foreground">Account/Wallet #</span>
              <span className="font-bold text-foreground">{details.accountNumber}</span>
            </div>
            {method === 'Bank Transfer' && details.bankName && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Bank Name</span>
                <span className="font-bold text-foreground">{details.bankName}</span>
              </div>
            )}
            {details.eWalletType && (
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-muted-foreground">Wallet Type</span>
                <span className="font-bold text-foreground">{details.eWalletType}</span>
              </div>
            )}
            {details.extraInfo && (
              <div className="py-1">
                <span className="text-muted-foreground block mb-0.5">Notes</span>
                <p className="font-medium text-foreground bg-slate-900/60 p-2 rounded-lg border border-white/5">{details.extraInfo}</p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
            <input
              id="agree-withdrawal"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4.5 w-4.5 accent-primary rounded bg-white/5 border-white/10"
            />
            <label htmlFor="agree-withdrawal" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
              I certify that all banking credentials provided above are 100% correct, and I take full responsibility for this transfer request.
            </label>
          </div>
        </div>

        <CustomDialogFooter>
          <button
            onClick={() => setShowDialog(false)}
            className="px-5 py-2.5 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            Cancel
          </button>
          <button
            disabled={!agree || loading}
            onClick={confirmSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-foreground text-white font-bold text-sm rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {loading ? 'Processing...' : 'Confirm Request'}
          </button>
        </CustomDialogFooter>
      </CustomDialog>
    </div>
  );
}
