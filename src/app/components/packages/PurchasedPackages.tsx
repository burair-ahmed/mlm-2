"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  Lock, 
  Unlock, 
  HelpCircle, 
  FolderCheck,
  ArrowDownToLine
} from "lucide-react";

type CommonFields = {
  _id: string;
  type: "long-term-rental" | "long-term-industry" | "trading";
  name: string;
  category: string;
  quantity: number;
  equityUnits: number;
  minHoldingPeriod?: number;
  minHoldingPeriodUnit?: string;
  purchaseDate: string;
};

type LongTermRentalPackage = CommonFields & {
  type: "long-term-rental";
  returnPercentage: number;
  resaleAllowed: boolean;
  profitAmount: number;
};

type LongTermIndustryPackage = CommonFields & {
  type: "long-term-industry";
  estimatedReturn: number;
  buybackOption: boolean;
  resaleAllowed: boolean;
  profitAmount: number;
};

type TradingPackage = CommonFields & {
  type: "trading";
  returnPercentage: number;
  profitEstimation: string;
  dailyInsights: string;
  profitAmount: number;
};

type PurchasedPackage =
  | LongTermRentalPackage
  | LongTermIndustryPackage
  | TradingPackage;

const getHoldingPeriodInMs = (value: number, unit: string) => {
  const unitMap: Record<string, number> = {
    second: 1000,
    seconds: 1000,
    minute: 60 * 1000,
    minutes: 60 * 1000,
    hour: 60 * 60 * 1000,
    hours: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
  };
  return value * (unitMap[unit.toLowerCase()] || 0);
};

const formatTimeLeft = (ms: number) => {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

const MyInvestments = () => {
  const [purchasedPackages, setPurchasedPackages] = useState<PurchasedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const fetchPurchasedPackages = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/transactions/my-investments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();
        if (Array.isArray(data.data)) {
          setPurchasedPackages(data.data);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedPackages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWithdraw = async (packageId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("/api/transactions/withdraw-profit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Withdraw failed");

      alert("Profit withdrawn successfully!");
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <FolderCheck className="h-5 w-5 text-primary text-glow-emerald" />
          <span>Active Portfolios</span>
        </h3>
        <span className="text-xs text-muted-foreground bg-white/5 border border-white/5 px-3 py-1 rounded-full font-semibold">
          {purchasedPackages.length} Holdings
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 rounded-3xl border border-white/5 bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="max-w-lg mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
          {error}
        </div>
      ) : purchasedPackages.length === 0 ? (
        <div className="text-center py-16 rounded-3xl border border-white/5 bg-slate-900/10 flex flex-col items-center justify-center gap-3">
          <HelpCircle className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-semibold text-muted-foreground">No active investments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedPackages.map((pkg) => {
            const purchaseTime = new Date(pkg.purchaseDate).getTime();
            const holdingMs = getHoldingPeriodInMs(
              pkg.minHoldingPeriod || 0,
              pkg.minHoldingPeriodUnit || "day"
            );
            const timeElapsed = currentTime - purchaseTime;
            const isEligibleToSell = timeElapsed >= holdingMs;
            const remainingTime = holdingMs - timeElapsed;

            return (
              <div 
                key={pkg._id}
                className="relative rounded-3xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/40 hover:border-primary/20 backdrop-blur-xl p-6 transition-all duration-300 group shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Accent glows based on eligibility */}
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none opacity-10 ${
                  isEligibleToSell ? "bg-glow-emerald" : "bg-glow-gold"
                }`} />

                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h4 className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                      {pkg.name}
                    </h4>
                    <span className="text-[9px] text-accent font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-glow-gold uppercase tracking-wider shrink-0">
                      {pkg.category}
                    </span>
                  </div>

                  {/* Core statistics grid */}
                  <div className="grid grid-cols-2 gap-3 mt-4 bg-white/5 p-3 rounded-2xl border border-white/5 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block mb-0.5 uppercase tracking-wider font-semibold">Quantity</span>
                      <span className="font-extrabold text-foreground">{pkg.quantity} Units</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-0.5 uppercase tracking-wider font-semibold">Unit Price</span>
                      <span className="font-extrabold text-accent text-glow-gold">${pkg.equityUnits}</span>
                    </div>
                  </div>

                  {/* Dynamic properties based on package type */}
                  <div className="mt-4 space-y-2 text-xs border-t border-white/5 pt-4 text-muted-foreground">
                    {pkg.type === "long-term-rental" && (
                      <>
                        <div className="flex justify-between">
                          <span>Return Yield</span>
                          <span className="text-foreground font-semibold">{pkg.returnPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resale Rights</span>
                          <span className="text-foreground font-semibold">{pkg.resaleAllowed ? "Allowed" : "Restricted"}</span>
                        </div>
                      </>
                    )}

                    {pkg.type === "long-term-industry" && (
                      <>
                        <div className="flex justify-between">
                          <span>Estimated Yield</span>
                          <span className="text-foreground font-semibold">{pkg.estimatedReturn}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Buyback Options</span>
                          <span className="text-foreground font-semibold">{pkg.buybackOption ? "Active" : "None"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resale Rights</span>
                          <span className="text-foreground font-semibold">{pkg.resaleAllowed ? "Allowed" : "Restricted"}</span>
                        </div>
                      </>
                    )}

                    {pkg.type === "trading" && (
                      <>
                        <div className="flex justify-between">
                          <span>Return Yield</span>
                          <span className="text-foreground font-semibold">{pkg.returnPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Insights Status</span>
                          <span className="text-foreground font-semibold truncate max-w-[130px]">{pkg.dailyInsights}</span>
                        </div>
                      </>
                    )}

                    {pkg.minHoldingPeriod && (
                      <div className="flex justify-between items-center text-[10px] bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
                        <span className="flex items-center gap-1">
                          {isEligibleToSell ? (
                            <Unlock className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Lock className="h-3 w-3 text-amber-500" />
                          )}
                          Holding Lock
                        </span>
                        <span className="text-foreground font-bold uppercase">
                          {pkg.minHoldingPeriod} {pkg.minHoldingPeriodUnit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* yields box & actions */}
                <div className="mt-5 space-y-4">
                  {/* Accrued Yield Info */}
                  <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-glow-emerald" />
                      <span>Accrued Yield</span>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400 text-glow-emerald">
                      {pkg.profitAmount || 0} Units
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2.5">
                    <button
                      disabled={!pkg.profitAmount}
                      onClick={() => handleWithdraw(pkg._id)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-2.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 text-emerald-400 hover:text-white hover:bg-emerald-500 rounded-xl text-[10px] font-bold transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-emerald-400 disabled:cursor-not-allowed"
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                      Withdraw Yield
                    </button>

                    <button
                      disabled={!isEligibleToSell}
                      className={`flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded-xl text-[10px] font-bold border transition-all duration-300 ${
                        isEligibleToSell
                          ? "bg-gradient-to-r from-primary to-primary-foreground text-white border-primary/20 hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20"
                          : "bg-white/5 text-muted-foreground border-white/5 cursor-not-allowed"
                      }`}
                    >
                      {isEligibleToSell ? (
                        <span>Request Sell</span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Locked ({formatTimeLeft(remainingTime)})
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyInvestments;

