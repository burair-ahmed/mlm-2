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
import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight, Calendar, Info } from "lucide-react";

interface Transaction {
  _id: string;
  amount: number;
  equityUnits: number;
  type: string;
  createdAt: string;
  description?: string;
}

const ITEMS_PER_PAGE = 10;

export default function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [transactionCounts, setTransactionCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    try {
      if (!user?._id) return;

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (activeType !== "all") params.append("type", activeType);

      const response = await fetch(`/api/transactions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch transactions");

      const res = await response.json();
      setTransactions(res.transactions || []);
      setTotalPages(res.totalPages || 1);
      setTransactionCounts(res.counts || { all: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, activeType, page]);

  const staticTypeOrder = ["all", "deposit", "purchase", "commission", "profit-withdrawal", "cash_to_equity"];
  const transactionTypes = staticTypeOrder.filter((type) => type === "all" || transactionCounts[type] > 0);

  const getAmountDisplay = (tx: Transaction) => {
    return tx.amount > 0
      ? `$${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : `${tx.equityUnits} Units`;
  };

  const getTxTypeStyle = (type: string) => {
    if (type === "commission" || type === "deposit") {
      return {
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-glow-emerald",
        text: "text-emerald-400 font-bold",
        icon: <ArrowDownLeft className="h-4.5 w-4.5 text-emerald-400" />,
      };
    }
    if (type === "profit-withdrawal" || type === "withdrawal") {
      return {
        badge: "bg-red-500/10 text-red-400 border-red-500/20",
        text: "text-red-400 font-semibold",
        icon: <ArrowUpRight className="h-4.5 w-4.5 text-red-400" />,
      };
    }
    return {
      badge: "bg-amber-500/10 text-accent border-amber-500/20 text-glow-gold",
      text: "text-accent font-semibold",
      icon: <ArrowLeftRight className="h-4.5 w-4.5 text-accent" />,
    };
  };

  const handleFilterChange = (type: string) => {
    setActiveType(type);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground animate-pulse text-sm">
        Loading transaction history...
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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {transactionTypes.map((type) => {
          const isActive = type === activeType;
          const count = transactionCounts[type] || 0;

          return (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border-primary/25 border-glow-emerald"
                  : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              <span className="capitalize">{type.replace(/_/g, " ")}</span>
              <span
                className={`h-4.5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-md ${
                  isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Custom Table */}
      <CustomTable>
        <CustomTableHeader>
          <CustomTableRow>
            <CustomTableHead>Date</CustomTableHead>
            <CustomTableHead>Type</CustomTableHead>
            <CustomTableHead>Amount / Value</CustomTableHead>
            <CustomTableHead>Description</CustomTableHead>
          </CustomTableRow>
        </CustomTableHeader>
        <CustomTableBody>
          {transactions.length > 0 ? (
            transactions.map((tx) => {
              const style = getTxTypeStyle(tx.type);
              return (
                <CustomTableRow key={tx._id}>
                  <CustomTableCell className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </CustomTableCell>
                  <CustomTableCell>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold capitalize ${style.badge}`}>
                      {style.icon}
                      {tx.type.replace(/_/g, " ")}
                    </span>
                  </CustomTableCell>
                  <CustomTableCell className={style.text}>
                    {getAmountDisplay(tx)}
                  </CustomTableCell>
                  <CustomTableCell>
                    <span className="flex items-center gap-1.5 max-w-sm truncate text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {tx.description || "No description provided"}
                    </span>
                  </CustomTableCell>
                </CustomTableRow>
              );
            })
          ) : (
            <CustomTableRow>
              <CustomTableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                No transaction activities recorded.
              </CustomTableCell>
            </CustomTableRow>
          )}
        </CustomTableBody>
      </CustomTable>

      {/* Custom Stepper Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-2 text-sm text-muted-foreground">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-foreground text-xs font-bold rounded-xl disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-muted-foreground transition-all duration-300"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-foreground bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-foreground text-xs font-bold rounded-xl disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:text-muted-foreground transition-all duration-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
