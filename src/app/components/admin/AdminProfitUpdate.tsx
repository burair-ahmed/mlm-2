"use client";

import { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  TrendingUp,
  DollarSign,
  Layers,
  Calendar,
  Percent,
  Award,
  Wallet,
  Coins,
} from "lucide-react";

interface Package {
  _id: string;
  name: string;
  category: string;
  type: string;
  quantity: number;
  equityUnits: number;
  purchaseDate: string;
  profitAmount: number;
  lastProfitDate?: string | null;
  returnPercentage?: number;
  estimatedReturn?: string;
  profitEstimation?: string;
  minHoldingPeriod?: number;
  minHoldingPeriodUnit?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminProfitUpdate() {
  const [purchasedPackages, setPurchasedPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [profitAmount, setProfitAmount] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch packages
  const fetchPurchasedPackages = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/get-all-purchased-packages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }

      const data = await response.json();
      setPurchasedPackages(data.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle profit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found.");
      return;
    }

    if (!selectedPackage || profitAmount === "" || profitAmount <= 0) {
      setError("Please select a package and enter a valid positive profit amount.");
      return;
    }

    try {
      const response = await fetch("/api/admin/update-profit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: selectedPackage._id,
          profitAmount,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Failed to update profit");
      } else {
        setSuccessMessage(`Successfully distributed $${Number(profitAmount).toFixed(2)} to ${selectedPackage.user?.email || "owner"}'s wallet balance!`);
        setError(null);
        setProfitAmount("");
        setSelectedPackage(null);
        // Refresh package list to reflect updated profitAmounts
        await fetchPurchasedPackages();
      }
    } catch {
      setError("Something went wrong while updating profit.");
    }
  };

  // Filter list of packages
  const filteredPackages = purchasedPackages.filter((pkg) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      pkg.name?.toLowerCase().includes(searchLower) ||
      pkg.category?.toLowerCase().includes(searchLower) ||
      pkg.user?.email?.toLowerCase().includes(searchLower) ||
      pkg.user?.name?.toLowerCase().includes(searchLower);

    const matchesCategory =
      activeCategory === "all" || pkg.type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate statistics banner metrics
  const totalPackages = purchasedPackages.length;
  const totalProfitsDistributed = purchasedPackages.reduce(
    (acc, pkg) => acc + (pkg.profitAmount || 0),
    0
  );
  const averagePayout = totalPackages > 0 ? totalProfitsDistributed / totalPackages : 0;

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" /> Package Profit Distributions
        </h2>
        <p className="text-xs text-muted-foreground">
          Distribute investment yields manually and monitor automated payouts across all active portfolios.
        </p>
      </div>

      {error && (
        <Alert className="bg-red-500/10 border-red-500/25 text-red-400 max-w-2xl">
          <AlertTitle className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
            Error
          </AlertTitle>
          <span className="text-xs">{error}</span>
        </Alert>
      )}

      {successMessage && (
        <Alert className="bg-emerald-500/10 border-emerald-500/25 text-emerald-400 max-w-2xl">
          <AlertTitle className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
            Success
          </AlertTitle>
          <span className="text-xs">{successMessage}</span>
        </Alert>
      )}

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Packages */}
        <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Active Portfolios
            </span>
            <p className="text-xl font-bold text-foreground">{totalPackages}</p>
          </div>
          <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <Layers className="h-5 w-5" />
          </div>
        </div>

        {/* Total Profits */}
        <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Total Profits Distributed
            </span>
            <p className="text-xl font-bold text-emerald-400 text-glow-emerald">
              ${totalProfitsDistributed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 border-glow-emerald">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Avg return */}
        <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Average Return / Package
            </span>
            <p className="text-xl font-bold text-accent text-glow-gold">
              ${averagePayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="h-10 w-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-accent border-glow-gold">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/30 border border-white/5 p-4 rounded-2xl backdrop-blur-xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {["all", "trading", "long-term-rental", "long-term-industry"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                category === activeCategory
                  ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border-primary/25 border-glow-emerald"
                  : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {category === "all" ? "All Packages" 
                : category === "trading" ? "Trading"
                : category === "long-term-rental" ? "Rental"
                : "Industry"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search email, name or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all duration-300"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-sm text-muted-foreground animate-pulse">
          Loading purchased portfolios...
        </div>
      ) : filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const isRental = pkg.type === "long-term-rental";
            const isIndustry = pkg.type === "long-term-industry";
            const isTrading = pkg.type === "trading";

            // Card highlight and styling
            let cardStyle = "border-white/5 hover:border-blue-500/30 hover:shadow-blue-500/5";
            let typeLabel = "Trading";
            let typeColor = "text-blue-400 bg-blue-500/10 border-blue-500/20";
            let yieldInfo = "";

            if (isRental) {
              cardStyle = "border-white/5 hover:border-emerald-500/30 hover:shadow-emerald-500/5";
              typeLabel = "Rental";
              typeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 border-glow-emerald";
              yieldInfo = pkg.returnPercentage ? `${pkg.returnPercentage}% Fixed Return` : "";
            } else if (isIndustry) {
              cardStyle = "border-white/5 hover:border-amber-500/30 hover:shadow-amber-500/5";
              typeLabel = "Industry";
              typeColor = "text-accent bg-amber-500/10 border-amber-500/20 border-glow-gold";
              yieldInfo = pkg.estimatedReturn ? `Est: ${pkg.estimatedReturn}` : "";
            } else if (isTrading) {
              yieldInfo = pkg.returnPercentage ? `${pkg.returnPercentage}% Yield` : (pkg.profitEstimation || "");
            }

            const firstLetter = pkg.user?.email ? pkg.user.email.charAt(0).toUpperCase() : "U";

            return (
              <div
                key={pkg._id}
                className={`bg-slate-900/40 border rounded-2xl backdrop-blur-xl p-5 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group ${cardStyle}`}
              >
                {/* Header User details */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                      {firstLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate max-w-[125px]" title={pkg.user?.email}>
                        {pkg.user?.email || "N/A"}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {pkg.user?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-bold tracking-wide uppercase shrink-0 ${typeColor}`}>
                    {typeLabel}
                  </span>
                </div>

                {/* Package details */}
                <div className="bg-white/3 p-3 rounded-xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs gap-2">
                    <span className="font-extrabold text-foreground truncate">{pkg.name}</span>
                    <span className="text-[9px] text-muted-foreground capitalize bg-white/5 px-2 py-0.5 rounded-md shrink-0">
                      {pkg.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px] text-muted-foreground">
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider">Holding Period</span>
                      <span className="font-semibold text-foreground">
                        {pkg.minHoldingPeriod ? `${pkg.minHoldingPeriod} ${pkg.minHoldingPeriodUnit}` : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider">Return Model</span>
                      <span className="font-semibold text-foreground truncate block">
                        {yieldInfo || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Units & profit stats grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/3 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                      <Layers className="h-3 w-3" /> Units
                    </span>
                    <p className="font-bold text-foreground">
                      {pkg.equityUnits || pkg.quantity || 0} Units
                    </p>
                  </div>
                  <div className="bg-white/3 p-2.5 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] text-muted-foreground uppercase flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Profit Paid
                    </span>
                    <p className="font-bold text-emerald-400 text-glow-emerald">
                      ${(pkg.profitAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="text-[10px] text-muted-foreground space-y-1 bg-white/3 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Purchased: {new Date(pkg.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  {pkg.lastProfitDate && (
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Last Payout: {new Date(pkg.lastProfitDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Trigger Yield payout */}
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  <Coins className="h-3.5 w-3.5" />
                  <span>Payout Yield</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-muted-foreground bg-slate-900/10 border border-white/5 rounded-2xl">
          No portfolios found matching active filters.
        </div>
      )}

      {/* Payout Dialog */}
      {selectedPackage && (
        <Dialog
          open={!!selectedPackage}
          onOpenChange={(open) => {
            if (!open) setSelectedPackage(null);
          }}
        >
          <DialogContent className="bg-slate-900 border border-white/10 text-slate-100 max-w-md rounded-2xl backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground pb-2 border-b border-white/5">
                Distribute Investment Yield
              </DialogTitle>
            </DialogHeader>

            {/* Spec grid */}
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs mt-2">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <Award className="h-3 w-3" /> Package Name
                </span>
                <p className="font-bold text-foreground truncate">{selectedPackage.name}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <Percent className="h-3 w-3" /> Type
                </span>
                <div>
                  <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-bold tracking-wide uppercase inline-block ${
                    selectedPackage.type === "trading" ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                    : selectedPackage.type === "long-term-rental" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-accent bg-amber-500/10 border-amber-500/20"
                  }`}>
                    {selectedPackage.type === "trading" ? "Trading" : selectedPackage.type === "long-term-rental" ? "Rental" : "Industry"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <Wallet className="h-3 w-3" /> Owner Email
                </span>
                <p className="font-bold text-foreground truncate" title={selectedPackage.user?.email}>
                  {selectedPackage.user?.email || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Profit Paid So Far
                </span>
                <p className="font-bold text-emerald-400 text-glow-emerald">
                  ${(selectedPackage.profitAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="profitAmount" className="text-xs font-bold text-muted-foreground">
                  Distribution Amount ($)
                </Label>
                <Input
                  id="profitAmount"
                  type="number"
                  step="0.01"
                  value={profitAmount}
                  onChange={(e) =>
                    setProfitAmount(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full bg-white/5 border-white/10 rounded-xl text-xs text-foreground focus:border-primary/50 mt-1"
                  placeholder="Enter payout amount, e.g. 150.00"
                  min="0.01"
                  required
                />
              </div>

              <div className="text-[10px] text-muted-foreground leading-relaxed bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                {"⚠️ System Note: Submitting this distribution will instantly increment this package's profit statistics, credit the user's wallet liquid balance, and log a permanent ledger transaction."}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold text-xs rounded-xl"
                >
                  Submit Payout
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
