'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ArrowUpRight } from 'lucide-react';

export default function BuyEquityUnitsForm() {
  const { user, refreshUser } = useAuth();
  const [units, setUnits] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const PRICE_PER_UNIT = 10; // $10 per equity unit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericUnits = Number(units);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/equity/buy-units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ units: numericUnits })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Purchase failed');
      }

      setSuccess(`Successfully purchased ${numericUnits} equity units!`);
      setUnits('');
      refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 max-w-lg mx-auto relative overflow-hidden">
      {/* Subtle emerald ambient glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-emerald pointer-events-none opacity-20" />
      
      <h3 className="text-xl font-extrabold text-foreground mb-6 flex items-center justify-between border-b border-white/5 pb-4">
        <span>Convert Units to Equity</span>
        <span className="text-xs text-accent px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-semibold tracking-wide text-glow-gold">
          ${PRICE_PER_UNIT}/Unit
        </span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Units to Buy
          </label>
          <input
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
            min="1"
            placeholder="e.g. 50"
            required
          />
          
          <div className="grid grid-cols-2 gap-4 mt-5 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5 uppercase tracking-wider font-semibold">Total Cost</span>
              <span className="text-lg font-extrabold text-accent text-glow-gold">
                ${(Number(units) * PRICE_PER_UNIT).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5 uppercase tracking-wider font-semibold">Available Balance</span>
              <span className="text-lg font-extrabold text-foreground">
                ${user?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl transition-all">
            {error}
          </div>
        )}
        {success && (
          <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5 rounded-xl transition-all">
            {success}
          </div>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-primary/20 mt-6"
        >
          Purchase Equity Units <ArrowUpRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

