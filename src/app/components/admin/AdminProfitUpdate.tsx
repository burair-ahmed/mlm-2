"use client";

import { useState, useEffect, useMemo } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingUp,
  DollarSign,
  Layers,
  Calendar,
  Award,
  Coins,
  ChevronDown,
  ChevronUp,
  Users,
  Send,
  Loader2
} from "lucide-react";

interface Package {
  _id: string;
  packageId?: string;
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
  status?: string;
  user?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface GroupedPackage {
  packageId: string;
  name: string;
  type: string;
  category: string;
  totalUnits: number;
  totalActiveBuyers: number;
  totalProfitDistributed: number;
  portfolios: Package[];
}

export default function AdminProfitUpdate() {
  const [purchasedPackages, setPurchasedPackages] = useState<Package[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
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
  
  // Expanded packages state (keys are packageId or name)
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});

  // Inputs for Bulk payouts (keyed by package group key)
  const [bulkValues, setBulkValues] = useState<Record<string, string>>({});
  const [bulkModes, setBulkModes] = useState<Record<string, "fixed" | "percentage">>({});
  const [submittingBulk, setSubmittingBulk] = useState<Record<string, boolean>>({});

  // Inputs for Individual payouts (keyed by portfolioId)
  const [indivValues, setIndivValues] = useState<Record<string, string>>({});
  const [indivModes, setIndivModes] = useState<Record<string, "fixed" | "percentage">>({});
  const [submittingIndiv, setSubmittingIndiv] = useState<Record<string, boolean>>({});

  // Fetch packages
  const fetchPurchasedPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/get-all-purchased-packages");
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
  }, []);

  // Handle profit updates (Bulk or Individual)
  const handleDistribution = async (params: {
    payoutType: "bulk" | "individual";
    mode: "fixed" | "percentage";
    value: number;
    purchasedPackageId?: string;
    originalPackageId?: string;
    groupKey?: string;
  }) => {
    setError(null);
    setSuccessMessage(null);

    const { payoutType, mode, value, purchasedPackageId, originalPackageId, groupKey } = params;

    if (!value || value <= 0) {
      setError("Please specify a valid yield value.");
      return;
    }

    // Set loading indicator
    if (payoutType === "bulk" && groupKey) {
      setSubmittingBulk(prev => ({ ...prev, [groupKey]: true }));
    } else if (payoutType === "individual" && purchasedPackageId) {
      setSubmittingIndiv(prev => ({ ...prev, [purchasedPackageId]: true }));
    }

    try {
      const response = await fetch("/api/admin/update-profit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payoutType,
          mode,
          value,
          purchasedPackageId,
          originalPackageId
        }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Failed to distribute profits");
      } else {
        setSuccessMessage(data.message || "Profits successfully distributed!");
        
        // Reset inputs
        if (payoutType === "bulk" && groupKey) {
          setBulkValues(prev => ({ ...prev, [groupKey]: "" }));
        } else if (payoutType === "individual" && purchasedPackageId) {
          setIndivValues(prev => ({ ...prev, [purchasedPackageId]: "" }));
        }

        // Refresh list
        await fetchPurchasedPackages();
      }
    } catch {
      setError("Something went wrong while updating profit.");
    } finally {
      // Clear loading indicator
      if (payoutType === "bulk" && groupKey) {
        setSubmittingBulk(prev => ({ ...prev, [groupKey]: false }));
      } else if (payoutType === "individual" && purchasedPackageId) {
        setSubmittingIndiv(prev => ({ ...prev, [purchasedPackageId]: false }));
      }
    }
  };

  // Toggle package expansion
  const toggleExpand = (groupKey: string) => {
    setExpandedPackages(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  // Filter purchased portfolios
  const filteredPackages = useMemo(() => {
    return purchasedPackages.filter((pkg) => {
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
  }, [purchasedPackages, searchQuery, activeCategory]);

  // Group filtered portfolios under parent packages
  const groupedPackages = useMemo(() => {
    const groups: Record<string, GroupedPackage> = {};

    filteredPackages.forEach((pkg) => {
      // Fallback to pkg.name to support mock data without packageId
      const groupKey = pkg.packageId || pkg.name;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          packageId: pkg.packageId || "",
          name: pkg.name || "Unknown Package",
          type: pkg.type || "trading",
          category: pkg.category || "general",
          totalUnits: 0,
          totalActiveBuyers: 0,
          totalProfitDistributed: 0,
          portfolios: []
        };
      }

      if (pkg.status === "active") {
        groups[groupKey].totalUnits += pkg.quantity || 0;
      }
      groups[groupKey].totalProfitDistributed += pkg.profitAmount || 0;
      groups[groupKey].portfolios.push(pkg);
    });

    Object.keys(groups).forEach(key => {
      groups[key].totalActiveBuyers = groups[key].portfolios.filter(p => p.status === "active").length;
    });

    return Object.values(groups);
  }, [filteredPackages]);

  // Calculate statistics metrics
  const totalPortfolios = purchasedPackages.length;
  const totalProfitsDistributed = purchasedPackages.reduce(
    (acc, pkg) => acc + (pkg.profitAmount || 0),
    0
  ) * pricePerUnit;
  const averagePayout = totalPortfolios > 0 ? totalProfitsDistributed / totalPortfolios : 0;

  // Colors for styling based on package type
  const getPackageTypeStyles = (type: string) => {
    if (type === "long-term-rental") {
      return {
        badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 border-glow-emerald",
        border: "border-white/5 hover:border-emerald-500/30",
        btn: "bg-emerald-600 hover:bg-emerald-500 text-white"
      };
    }
    if (type === "long-term-industry") {
      return {
        badge: "text-amber-400 bg-amber-500/10 border-amber-500/20 border-glow-gold",
        border: "border-white/5 hover:border-amber-500/30",
        btn: "bg-amber-600 hover:bg-amber-500 text-white"
      };
    }
    return {
      badge: "text-blue-400 bg-blue-500/10 border-blue-500/20 border-glow-blue",
      border: "border-white/5 hover:border-blue-500/30",
      btn: "bg-blue-600 hover:bg-blue-500 text-white"
    };
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary animate-pulse" /> Package Profit Distributions
        </h2>
        <p className="text-xs text-muted-foreground">
          Group active portfolios by parent package. Distribute yields in bulk or pay users individually.
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
        <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Active Portfolios
            </span>
            <p className="text-xl font-bold text-foreground">{totalPortfolios}</p>
          </div>
          <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
            <Layers className="h-5 w-5" />
          </div>
        </div>

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

        <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl backdrop-blur-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Average Return / Portfolio
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

      {/* Grouped Packages Accordion List */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-sm text-muted-foreground animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
          Loading package groups...
        </div>
      ) : groupedPackages.length > 0 ? (
        <div className="space-y-4">
          {groupedPackages.map((group) => {
            const groupKey = group.packageId || group.name;
            const isExpanded = !!expandedPackages[groupKey];
            const theme = getPackageTypeStyles(group.type);
            
            const groupVal = bulkValues[groupKey] || "";
            const groupMode = bulkModes[groupKey] || "fixed";
            const loadingBulk = !!submittingBulk[groupKey];

            return (
              <div 
                key={groupKey}
                className={`bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl transition-all duration-300`}
              >
                {/* Header panel */}
                <div 
                  onClick={() => toggleExpand(groupKey)}
                  className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm truncate">{group.name}</span>
                        <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-bold tracking-wide uppercase shrink-0 ${theme.badge}`}>
                          {group.type.replace("long-term-", "")}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Category: {group.category}</p>
                    </div>
                  </div>

                  {/* Group Stats */}
                  <div className="flex items-center gap-6 text-xs text-muted-foreground border-t border-white/5 lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto">
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase tracking-wider block">Active Buyers</span>
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-blue-400" /> {group.totalActiveBuyers}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase tracking-wider block">Total Held Units</span>
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-purple-400" /> {group.totalUnits}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase tracking-wider block">Total Yield Distributed</span>
                      <span className="font-bold text-emerald-400 text-glow-emerald flex items-center gap-0.5">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> {(group.totalProfitDistributed * pricePerUnit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Bulk Distribution Form inside Header */}
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-xl w-full lg:w-auto"
                  >
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Bulk amount"
                        value={groupVal}
                        onChange={(ev) => setBulkValues(prev => ({ ...prev, [groupKey]: ev.target.value }))}
                        className="h-8 w-24 bg-slate-950/50 border-white/10 text-xs rounded-lg text-slate-100"
                        min="0.01"
                      />
                      <select
                        value={groupMode}
                        onChange={(ev) => setBulkModes(prev => ({ ...prev, [groupKey]: ev.target.value as "fixed" | "percentage" }))}
                        className="h-8 px-1 py-0 bg-slate-950/50 border border-white/10 rounded-lg text-[10px] text-slate-100 focus:outline-none cursor-pointer"
                      >
                        <option value="fixed">Fixed ($)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>

                    <Button
                      disabled={loadingBulk || !groupVal || Number(groupVal) <= 0}
                      onClick={() => handleDistribution({
                        payoutType: "bulk",
                        mode: groupMode,
                        value: Number(groupVal),
                        originalPackageId: group.packageId || undefined,
                        groupKey
                      })}
                      className={`h-8 px-3 text-[10px] font-bold rounded-lg transition-all duration-300 flex items-center gap-1 cursor-pointer ${theme.btn}`}
                    >
                      {loadingBulk ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Send className="h-3 w-3" />
                      )}
                      <span>Pay All</span>
                    </Button>
                    
                    {/* Accordion arrow indicator */}
                    <div 
                      onClick={() => toggleExpand(groupKey)}
                      className="p-1 rounded hover:bg-white/5 ml-2 cursor-pointer hidden lg:block"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Buyers List */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-slate-950/20 p-5 space-y-4">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="h-4 w-4" /> Active Buyers List
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-white/5">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="py-3 px-4">Buyer details</th>
                            <th className="py-3 px-4">Purchase Date</th>
                            <th className="py-3 px-4">Portfolios Held</th>
                            <th className="py-3 px-4">Accumulated Yield</th>
                            <th className="py-3 px-4">Last Payout Date</th>
                            <th className="py-3 px-4 text-right">Individual Distribution</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs text-slate-200">
                          {group.portfolios.map((portfolio) => {
                            const portVal = indivValues[portfolio._id] || "";
                            const portMode = indivModes[portfolio._id] || "fixed";
                            const loadingIndiv = !!submittingIndiv[portfolio._id];

                            return (
                              <tr key={portfolio._id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="font-semibold text-slate-200">{portfolio.user?.name || "N/A"}</div>
                                    {portfolio.status === "sell-requested" && (
                                      <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                        Pending Resale
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground font-mono">{portfolio.user?.email || "N/A"}</div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-slate-500" />
                                    {new Date(portfolio.purchaseDate).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-slate-300 font-mono">
                                  {portfolio.quantity || 0} Units
                                </td>
                                <td className="py-3.5 px-4 font-bold text-emerald-400 text-glow-emerald">
                                  ${(portfolio.profitAmount * pricePerUnit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-3.5 px-4 text-slate-400 font-mono text-[10px]">
                                  {portfolio.lastProfitDate ? (
                                    <div className="flex items-center gap-1 text-emerald-400/80">
                                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                                      {new Date(portfolio.lastProfitDate).toLocaleDateString()}
                                    </div>
                                  ) : (
                                    <span className="text-slate-500">None</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5 bg-slate-900/50 p-1 rounded-lg border border-white/5">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Yield amount"
                                      value={portVal}
                                      onChange={(ev) => setIndivValues(prev => ({ ...prev, [portfolio._id]: ev.target.value }))}
                                      className="h-7 w-24 bg-slate-950 border-white/10 text-[10px] rounded-md text-slate-100"
                                      min="0.01"
                                      disabled={portfolio.status !== "active"}
                                    />
                                    <select
                                      value={portMode}
                                      onChange={(ev) => setIndivModes(prev => ({ ...prev, [portfolio._id]: ev.target.value as "fixed" | "percentage" }))}
                                      className="h-7 px-1 py-0 bg-slate-950 border border-white/10 rounded-md text-[9px] text-slate-100 focus:outline-none cursor-pointer"
                                      disabled={portfolio.status !== "active"}
                                    >
                                      <option value="fixed">Fixed ($)</option>
                                      <option value="percentage">Percentage (%)</option>
                                    </select>
                                    <Button
                                      disabled={loadingIndiv || !portVal || Number(portVal) <= 0 || portfolio.status !== "active"}
                                      onClick={() => handleDistribution({
                                        payoutType: "individual",
                                        mode: portMode,
                                        value: Number(portVal),
                                        purchasedPackageId: portfolio._id
                                      })}
                                      className="h-7 px-2.5 text-[9px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center gap-1 cursor-pointer"
                                    >
                                      {loadingIndiv ? (
                                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                      ) : (
                                        <Send className="h-2.5 w-2.5" />
                                      )}
                                      <span>Pay</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-sm text-muted-foreground bg-slate-900/10 border border-white/5 rounded-2xl">
          No portfolios found matching active filters.
        </div>
      )}
    </div>
  );
}
