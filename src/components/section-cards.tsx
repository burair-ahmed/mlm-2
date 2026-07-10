"use client";

import { TrendingDown, TrendingUp, Wallet, Users, ArrowUpRight, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Investment {
  profitAmount: number;
}

export function SectionCards() {
  const [totalProfit, setTotalProfit] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const { user } = useAuth();

  const [showProfitInUSD, setShowProfitInUSD] = useState(false);
  const [showWithdrawnInUSD, setShowWithdrawnInUSD] = useState(false);
  const [showBalanceInUSD, setShowBalanceInUSD] = useState(false);
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

  const formatValue = (value: number, inUSD: boolean) => {
    return inUSD
      ? `$${(value * pricePerUnit).toLocaleString()}`
      : `${value.toLocaleString()} Units`;
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/transactions/my-investments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success) {
          const investmentsData = data.data?.investments || data.data;

          const total = investmentsData.reduce(
            (sum: number, pkg: Investment) => sum + (pkg.profitAmount || 0),
            0
          );
          setTotalProfit(total);
        }
      } catch (err) {
        console.error("Failed to fetch investments:", err);
      }
    };

    fetchInvestments();
  }, []);

  useEffect(() => {
    const fetchReferralCount = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/users/referral-count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setReferralCount(data.referralCount);
        }
      } catch (err) {
        console.error("Failed to fetch referral count:", err);
      }
    };

    fetchReferralCount();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Withdrawable Yield */}
      <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-primary/20 backdrop-blur-xl p-6 transition-all duration-300 group shadow-2xl flex flex-col justify-between">
        {/* Glow overlay */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-emerald pointer-events-none opacity-20" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Withdrawable Yield</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-primary text-glow-emerald shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300">
              {formatValue(totalProfit, showProfitInUSD)}
            </h3>
            <button
              onClick={() => setShowProfitInUSD(!showProfitInUSD)}
              className="text-[10px] text-accent hover:underline font-bold mt-1 text-glow-gold tracking-wide uppercase"
            >
              {showProfitInUSD ? "Show in Units" : "Show Valuation in USD"}
            </button>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground border-t border-white/5 pt-3 mt-4 flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold flex items-center gap-0.5"><ArrowUpRight className="h-3.5 w-3.5" /> +12.5%</span>
          <span>from active portfolios</span>
        </div>
      </div>

      {/* 2. Withdrawn Profit */}
      <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-destructive/20 backdrop-blur-xl p-6 transition-all duration-300 group shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Withdrawn Profit</span>
            <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground hover:text-red-400 transition-colors duration-300">
              {formatValue(user?.withdrawnProfits || 0, showWithdrawnInUSD)}
            </h3>
            <button
              onClick={() => setShowWithdrawnInUSD(!showWithdrawnInUSD)}
              className="text-[10px] text-accent hover:underline font-bold mt-1 text-glow-gold tracking-wide uppercase"
            >
              {showWithdrawnInUSD ? "Show in Units" : "Show Valuation in USD"}
            </button>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground border-t border-white/5 pt-3 mt-4 flex items-center gap-1.5">
          <span>Processed safely to bank/wallet</span>
        </div>
      </div>

      {/* 3. Total Referrals */}
      <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-primary/20 backdrop-blur-xl p-6 transition-all duration-300 group shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Referrals</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground group-hover:text-blue-400 transition-colors duration-300">
              {referralCount} Users
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
              Level {user?.hierarchyLevel || 0} Network depth
            </p>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground border-t border-white/5 pt-3 mt-4 flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold flex items-center gap-0.5"><ArrowUpRight className="h-3.5 w-3.5" /> +8.9%</span>
          <span>signups this month</span>
        </div>
      </div>

      {/* 4. Equity Units Balance */}
      <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-accent/20 backdrop-blur-xl p-6 transition-all duration-300 group shadow-2xl flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-glow-gold pointer-events-none opacity-15" />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Equity Balance</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-accent text-glow-gold shrink-0">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground group-hover:text-accent transition-colors duration-300">
              {formatValue(user?.equityUnits || 0, showBalanceInUSD)}
            </h3>
            <button
              onClick={() => setShowBalanceInUSD(!showBalanceInUSD)}
              className="text-[10px] text-accent hover:underline font-bold mt-1 text-glow-gold tracking-wide uppercase"
            >
              {showBalanceInUSD ? "Show in Units" : "Show Valuation in USD"}
            </button>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground border-t border-white/5 pt-3 mt-4 flex items-center gap-1.5">
          <span>Active package capital</span>
        </div>
      </div>

      {/* 5. Deposited Capital */}
      <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-primary/20 backdrop-blur-xl p-6 transition-all duration-300 group shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Deposited Capital</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-primary shrink-0">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300">
              ${user?.depositedBalance?.toLocaleString() || 0}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
              Capital for purchases/conversions
            </p>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground border-t border-white/5 pt-3 mt-4 flex items-center gap-1.5">
          <span>Non-withdrawable cash</span>
        </div>
      </div>

      {/* 6. Wallet Balance */}
      <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/50 hover:border-primary/20 backdrop-blur-xl p-6 transition-all duration-300 group shadow-2xl flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Wallet Balance</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-primary shrink-0">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors duration-300">
              ${user?.balance?.toLocaleString() || 0}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
              Available liquid USD
            </p>
          </div>
        </div>
        <div className="text-[11px] text-muted-foreground border-t border-white/5 pt-3 mt-4 flex items-center gap-1.5">
          <span>Ready for withdrawal</span>
        </div>
      </div>
    </div>
  );
}
