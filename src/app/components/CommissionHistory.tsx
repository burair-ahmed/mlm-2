"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { 
  CustomTable, 
  CustomTableHeader, 
  CustomTableBody, 
  CustomTableRow, 
  CustomTableHead, 
  CustomTableCell 
} from "@/components/custom/CustomTable";
import { Calendar } from "lucide-react";

interface Commission {
  _id: string;
  amount: number;
  createdAt: string;
  sourceUser: string;
  description: string;
}

export default function CommissionHistory() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        if (!user?._id) return;

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch(`/api/transactions/commissions?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch commissions");

        const data = await response.json();
        setCommissions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load commissions");
        setCommissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground animate-pulse text-sm">
        Loading commission logs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/25 p-4 rounded-2xl text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border border-white/5 bg-slate-900/30 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">Commission History</h3>
        <p className="text-xs text-muted-foreground">List of downline commissions credited to your account.</p>
      </div>

      {/* Table for larger screens */}
      <div className="hidden md:block">
        <CustomTable>
          <CustomTableHeader>
            <CustomTableRow>
              <CustomTableHead>Date</CustomTableHead>
              <CustomTableHead>Amount</CustomTableHead>
              <CustomTableHead>Source User</CustomTableHead>
              <CustomTableHead>Description</CustomTableHead>
            </CustomTableRow>
          </CustomTableHeader>
          <CustomTableBody>
            {commissions.length > 0 ? (
              commissions.map((commission) => (
                <CustomTableRow key={commission._id}>
                  <CustomTableCell className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(commission.createdAt).toLocaleDateString()}
                  </CustomTableCell>
                  <CustomTableCell className="text-primary font-bold text-glow-emerald">
                    +${commission.amount.toFixed(2)}
                  </CustomTableCell>
                  <CustomTableCell className="font-mono text-xs">{commission.sourceUser}</CustomTableCell>
                  <CustomTableCell>{commission.description}</CustomTableCell>
                </CustomTableRow>
              ))
            ) : (
              <CustomTableRow>
                <CustomTableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  No commissions credited yet.
                </CustomTableCell>
              </CustomTableRow>
            )}
          </CustomTableBody>
        </CustomTable>
      </div>

      {/* Stacked cards for mobile view */}
      <div className="md:hidden space-y-3">
        {commissions.length > 0 ? (
          commissions.map((commission) => (
            <div
              key={commission._id}
              className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-3 shadow-lg relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(commission.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs font-bold text-accent text-glow-gold uppercase">Referral Yield</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xl font-extrabold text-primary text-glow-emerald">
                  +${commission.amount.toFixed(2)}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Source: {commission.sourceUser}</span>
              </div>
              <p className="text-xs text-muted-foreground border-t border-white/5 pt-2 leading-relaxed">
                {commission.description}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-xs text-muted-foreground">No commissions found.</div>
        )}
      </div>
    </div>
  );
}
