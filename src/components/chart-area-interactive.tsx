"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

type ChartDataPoint = {
  date: string;
  deposit?: number;
  purchase?: number;
  commission?: number;
  withdrawal?: number;
};

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [data, setData] = React.useState<ChartDataPoint[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/chart-data?days=${timeRange.replace("d", "")}`);
        const json = await res.json();

        if (res.ok && Array.isArray(json)) {
          setData(json);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [timeRange]);

  const colors = {
    deposit: "#10b981",     // Emerald
    purchase: "#f59e0b",    // Gold
    commission: "#8b5cf6",  // Violet
    withdrawal: "#ef4444",  // Red
  };

  return (
    <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary text-glow-emerald">
            <Activity className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Performance Analytics</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">Transaction Overview</h3>
          <p className="text-xs text-muted-foreground">Historical records of deposits, purchases, commissions, and withdrawals.</p>
        </div>

        {/* Custom Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Desktop Filter Row */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-white/5 border border-white/5">
            {[
              { label: "7 Days", value: "7d" },
              { label: "30 Days", value: "30d" },
              { label: "90 Days", value: "90d" },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setTimeRange(btn.value)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  timeRange === btn.value
                    ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/20 border-glow-emerald"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Mobile dropdown selector */}
          <div className="md:hidden relative w-full sm:w-40">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-all duration-300 appearance-none"
            >
              <option value="7d" className="bg-slate-950 text-slate-100">Last 7 Days</option>
              <option value="30d" className="bg-slate-950 text-slate-100">Last 30 Days</option>
              <option value="90d" className="bg-slate-950 text-slate-100">Last 3 Months</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs pt-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground font-medium">Deposits</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-muted-foreground font-medium">Purchases</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          <span className="text-muted-foreground font-medium">Commissions</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-muted-foreground font-medium">Withdrawals</span>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="h-[300px] w-full pt-4">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground animate-pulse">
            Loading analytics data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="fillDeposit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.deposit} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.deposit} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillPurchase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.purchase} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.purchase} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillCommission" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.commission} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.commission} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillWithdrawal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.withdrawal} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.withdrawal} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickMargin={10}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickMargin={10}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-2xl border border-white/10 glass-panel p-4 shadow-2xl space-y-2 text-xs">
                        <p className="font-bold text-foreground">
                          {new Date(payload[0].payload.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <div className="space-y-1">
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex items-center justify-between gap-6">
                              <span className="text-muted-foreground flex items-center gap-1.5 capitalize">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: colors[entry.name as keyof typeof colors] }}
                                />
                                {entry.name}
                              </span>
                              <span className="font-bold text-foreground">
                                ${Number(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="deposit"
                name="deposit"
                stroke={colors.deposit}
                strokeWidth={2}
                fill="url(#fillDeposit)"
              />
              <Area
                type="monotone"
                dataKey="purchase"
                name="purchase"
                stroke={colors.purchase}
                strokeWidth={2}
                fill="url(#fillPurchase)"
              />
              <Area
                type="monotone"
                dataKey="commission"
                name="commission"
                stroke={colors.commission}
                strokeWidth={2}
                fill="url(#fillCommission)"
              />
              <Area
                type="monotone"
                dataKey="withdrawal"
                name="withdrawal"
                stroke={colors.withdrawal}
                strokeWidth={2}
                fill="url(#fillWithdrawal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}