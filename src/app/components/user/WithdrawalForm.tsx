'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../context/AuthContext';
import { 
  ChevronDown, 
  HelpCircle, 
  Wallet, 
  ArrowUpRight 
} from 'lucide-react';
import { 
  CustomDialog, 
  CustomDialogHeader, 
  CustomDialogTitle, 
  CustomDialogFooter 
} from '@/components/custom/CustomDialog';

export default function WithdrawalForm() {
  const { user } = useAuth();
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
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const numericAmount = parseFloat(amount);
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
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch {
      toast.error('Network error, try again later');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-lg w-full mx-auto space-y-6 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl glass-panel relative overflow-hidden">
      {/* Subtle amber ambient glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-gold pointer-events-none opacity-10" />

      <h2 className="text-xl font-extrabold text-foreground mb-4 pb-3 border-b border-white/5 flex items-center gap-2">
        <Wallet className="h-5 w-5 text-accent text-glow-gold" />
        <span>Request Withdrawal</span>
      </h2>

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

