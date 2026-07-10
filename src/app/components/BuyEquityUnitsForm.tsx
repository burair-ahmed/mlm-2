'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function BuyEquityUnitsForm() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [units, setUnits] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState(10);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && typeof data.equityUnitPrice === 'number') {
            setPricePerUnit(data.equityUnitPrice);
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericUnits = Number(units);
    setError('');
    setSuccess('');
    
    try {
      const endpoint = activeTab === 'buy' ? '/api/equity/buy-units' : '/api/equity/sell-units';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ units: numericUnits })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `${activeTab === 'buy' ? 'Purchase' : 'Conversion'} failed`);
      }

      setSuccess(`Successfully ${activeTab === 'buy' ? 'purchased' : 'converted'} ${numericUnits} equity units!`);
      setUnits('');
      refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl mb-8 max-w-lg mx-auto relative overflow-hidden">
      {/* Subtle emerald ambient glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-emerald pointer-events-none opacity-20" />
      
      <h3 className="text-xl font-extrabold text-foreground mb-6 flex items-center justify-between border-b border-white/5 pb-4">
        <span>{activeTab === 'buy' ? 'Convert Units to Equity' : 'Convert Equity back to Wallet'}</span>
        <span className="text-xs text-accent px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 font-semibold tracking-wide text-glow-gold">
          ${pricePerUnit}/Unit
        </span>
      </h3>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 mb-6">
        <button
          type="button"
          onClick={() => {
            setActiveTab('buy');
            setError('');
            setSuccess('');
            setUnits('');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
            activeTab === 'buy'
              ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/25 border-glow-emerald shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          Buy Equity Units
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('sell');
            setError('');
            setSuccess('');
            setUnits('');
          }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
            activeTab === 'sell'
              ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/25 border-glow-emerald shadow-lg'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          Convert to Balance
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {activeTab === 'buy' ? 'Units to Buy' : 'Units to Convert'}
          </label>
          <input
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 placeholder:text-muted-foreground/30"
            min="1"
            max={activeTab === 'sell' ? user?.equityUnits : undefined}
            placeholder={activeTab === 'buy' ? 'e.g. 50' : `Max ${user?.equityUnits || 0}`}
            required
          />
          
          <div className="grid grid-cols-2 gap-4 mt-5 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5 uppercase tracking-wider font-semibold">
                {activeTab === 'buy' ? 'Total Cost' : 'Total Cash Return'}
              </span>
              <span className="text-lg font-extrabold text-accent text-glow-gold">
                ${(Number(units) * pricePerUnit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5 uppercase tracking-wider font-semibold">
                {activeTab === 'buy' ? 'Available Deposit' : 'Available Equity'}
              </span>
              <span className="text-lg font-extrabold text-foreground">
                {activeTab === 'buy' 
                  ? `$${user?.depositedBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}`
                  : `${user?.equityUnits || 0} Units`
                }
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
          {activeTab === 'buy' ? (
            <>
              Purchase Equity Units <ArrowUpRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Convert to Wallet Balance <ArrowDownLeft className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

