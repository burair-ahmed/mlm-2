"use client";

import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import TransactionHistory from "../TransactionHistory";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* 1. Header cards */}
      <SectionCards />

      {/* 2. Chart analytics section */}
      <ChartAreaInteractive />

      {/* 3. Transaction history */}
      <div className="rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
        <div className="space-y-1 mb-6">
          <h3 className="text-xl font-bold text-foreground">Transaction Logs</h3>
          <p className="text-xs text-muted-foreground">List of your latest deposits, purchases, withdrawals, and commissions.</p>
        </div>
        <TransactionHistory />
      </div>
    </div>
  );
}