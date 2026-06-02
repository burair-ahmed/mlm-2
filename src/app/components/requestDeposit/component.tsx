'use client';

import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { toast } from 'sonner';
import { 
  ChevronDown, 
  Upload, 
  ArrowUpRight, 
  HelpCircle, 
  FileCheck 
} from 'lucide-react';

export default function RequestDeposit() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !paymentMethod || !proof) {
      toast.error('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('paymentMethod', paymentMethod);
    formData.append('notes', notes);
    formData.append('userId', String(user?._id ?? ''));
    formData.append('email', String(user?.email ?? ''));

    if (proof && proof instanceof File) {
      formData.append('proof', proof, proof.name);
    } else {
      toast.error('Invalid proof file.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/deposit/request', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit deposit request');

      toast.success('Deposit request submitted successfully!');
      setAmount('');
      setPaymentMethod('');
      setNotes('');
      setProof(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-6 bg-slate-900/30 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl glass-panel relative overflow-hidden">
      {/* Subtle emerald decorative glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-emerald pointer-events-none opacity-10" />

      <h2 className="text-xl font-extrabold text-foreground mb-6 flex items-center gap-2 pb-3 border-b border-white/5">
        <ArrowUpRight className="h-5 w-5 text-primary text-glow-emerald" />
        <span>Request a Deposit</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Investor Email
          </label>
          <input 
            type="email" 
            value={user?.email || ''} 
            readOnly 
            disabled 
            className="w-full bg-white/5 border border-white/10 text-muted-foreground/80 rounded-xl px-4 py-3 text-sm cursor-not-allowed opacity-60" 
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Amount (PKR)
          </label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 25000"
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Payment Method
          </label>
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all duration-300 appearance-none cursor-pointer"
              required
            >
              <option value="" disabled className="bg-slate-950 text-muted-foreground">Select payment method</option>
              <option value="Bank Transfer" className="bg-slate-950 text-foreground">Bank Transfer</option>
              <option value="JazzCash" className="bg-slate-950 text-foreground">JazzCash</option>
              <option value="EasyPaisa" className="bg-slate-950 text-foreground">EasyPaisa</option>
              <option value="Other" className="bg-slate-950 text-foreground">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Notes / Transaction Details
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Sender name, payment reference or bank notes"
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30 min-h-[85px] resize-y"
          />
        </div>

        {/* Proof of Payment */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Upload Proof of Payment
          </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleProofChange} 
            className="w-full bg-white/5 border border-white/10 text-foreground rounded-xl px-4 py-2.5 text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 file:transition-all focus:outline-none transition-all duration-300 cursor-pointer"
            required 
          />
          {proof && (
            <div className="mt-2.5 flex items-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold w-fit">
              <FileCheck className="h-4 w-4 text-glow-emerald" />
              <span>Selected: {proof.name}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={submitting} 
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-primary/20 mt-6 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting Request...' : 'Submit Deposit Request'}
          <Upload className="h-4 w-4" />
        </button>
      </form>

      {/* Payment Info Cards */}
      <div className="mt-10 pt-8 border-t border-white/5">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-4 w-4 text-accent text-glow-gold" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Official Gateways & Accounts</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bank Transfer */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/40 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-glow-emerald pointer-events-none opacity-5" />
            <h4 className="text-sm font-extrabold text-primary text-glow-emerald mb-3 uppercase tracking-wider">Bank Transfer</h4>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <p><strong className="text-foreground">Bank Name:</strong> Meezan Bank</p>
              <p><strong className="text-foreground">Account Title:</strong> Al Ashraf Holdings</p>
              <p><strong className="text-foreground">Account Number:</strong> 01234567890123</p>
              <p><strong className="text-foreground">IBAN:</strong> PK12MEZN0000123456789012</p>
            </div>
          </div>

          {/* JazzCash */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/40 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-glow-gold pointer-events-none opacity-5" />
            <h4 className="text-sm font-extrabold text-accent text-glow-gold mb-3 uppercase tracking-wider">JazzCash</h4>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <p><strong className="text-foreground">Account Name:</strong> Al Ashraf Holdings</p>
              <p><strong className="text-foreground">Mobile Number:</strong> 0300-1234567</p>
            </div>
          </div>

          {/* EasyPaisa */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/40 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-glow-emerald pointer-events-none opacity-5" />
            <h4 className="text-sm font-extrabold text-primary text-glow-emerald mb-3 uppercase tracking-wider">EasyPaisa</h4>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <p><strong className="text-foreground">Account Name:</strong> Al Ashraf Holdings</p>
              <p><strong className="text-foreground">Mobile Number:</strong> 0345-7654321</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

