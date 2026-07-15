"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Check, X, ClipboardList, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ResaleRequest {
  _id: string;
  type: string;
  name: string;
  category: string;
  quantity: number;
  equityUnits: number;
  purchaseDate: string;
  status: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function AdminResaleRequests() {
  const [requests, setRequests] = useState<ResaleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: "approve" | "reject";
    userName: string;
    packageName: string;
    refundAmount: number;
  } | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/resale-requests", { headers });
      if (res.data.success) {
        setRequests(res.data.data || []);
      } else {
        toast.error("Failed to load resale requests");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load resale requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    setActioningId(id);
    try {
      const res = await axios.post("/api/admin/resale-requests/approve", { purchasedPackageId: id }, { headers });
      if (res.data.success) {
        toast.success(res.data.message || "Resale approved successfully");
        fetchRequests();
      } else {
        toast.error(res.data.message || "Failed to approve resale");
      }
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to approve resale");
      } else {
        toast.error("Failed to approve resale");
      }
    } finally {
      setActioningId(null);
      setConfirmAction(null);
    }
  };

  const handleReject = async (id: string) => {
    setActioningId(id);
    try {
      const res = await axios.post("/api/admin/resale-requests/reject", { purchasedPackageId: id }, { headers });
      if (res.data.success) {
        toast.success(res.data.message || "Resale rejected successfully");
        fetchRequests();
      } else {
        toast.error(res.data.message || "Failed to reject resale");
      }
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to reject resale");
      } else {
        toast.error("Failed to reject resale");
      }
    } finally {
      setActioningId(null);
      setConfirmAction(null);
    }
  };

  return (
    <Card className="p-6 bg-slate-900/30 border-white/5 backdrop-blur-xl rounded-3xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary text-glow-emerald" />
          <span>Resale/Sell Requests</span>
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRequests}
          disabled={loading}
          className="bg-white/5 border-white/10 hover:bg-white/10 text-xs rounded-xl"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No pending resale requests found.
        </div>
      ) : (
        <div className="border border-white/5 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5 border-b border-white/5">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="font-bold">User Details</TableHead>
                <TableHead className="font-bold">Package Name</TableHead>
                <TableHead className="font-bold">Quantity</TableHead>
                <TableHead className="font-bold text-right">Refund Amount</TableHead>
                <TableHead className="font-bold">Purchase Date</TableHead>
                <TableHead className="font-bold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req._id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell>
                    <div className="font-semibold text-foreground">{req.user?.name || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{req.user?.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-foreground">{req.name}</div>
                    <div className="text-[10px] text-accent uppercase font-bold tracking-wider">{req.category}</div>
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {req.quantity} Unit{req.quantity > 1 ? "s" : ""}
                  </TableCell>
                  <TableCell className="text-right font-extrabold text-glow-emerald text-emerald-400">
                    {req.equityUnits} Units
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {new Date(req.purchaseDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        disabled={actioningId !== null}
                        onClick={() => setConfirmAction({
                          id: req._id,
                          type: "approve",
                          userName: req.user?.name || "N/A",
                          packageName: req.name,
                          refundAmount: req.equityUnits
                        })}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actioningId !== null}
                        onClick={() => setConfirmAction({
                          id: req._id,
                          type: "reject",
                          userName: req.user?.name || "N/A",
                          packageName: req.name,
                          refundAmount: req.equityUnits
                        })}
                        className="font-semibold rounded-xl text-xs flex items-center gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmAction !== null} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="bg-slate-950 border border-white/10 rounded-2xl text-slate-100 max-w-md">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <DialogTitle className="text-lg font-bold text-white uppercase tracking-wider">
                {confirmAction?.type === "approve" ? "Confirm Resale Approval" : "Confirm Resale Rejection"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-400 text-xs leading-relaxed">
              {confirmAction?.type === "approve" ? (
                <>
                  Are you sure you want to <strong className="text-emerald-400">APPROVE</strong> this resale request?
                  This will refund <strong className="text-white">{confirmAction.refundAmount} Equity Units</strong> to{" "}
                  <strong className="text-white">{confirmAction.userName}</strong> and reclaim the package units for{" "}
                  <span className="text-amber-400">&ldquo;{confirmAction.packageName}&rdquo;</span>.
                </>
              ) : (
                <>
                  Are you sure you want to <strong className="text-rose-400">REJECT</strong> this resale request?
                  The package will remain active for <strong className="text-white">{confirmAction?.userName}</strong>.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
              className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (confirmAction) {
                  if (confirmAction.type === "approve") {
                    handleApprove(confirmAction.id);
                  } else {
                    handleReject(confirmAction.id);
                  }
                }
              }}
              disabled={actioningId !== null}
              className={`flex-1 font-bold rounded-xl text-xs ${
                confirmAction?.type === "approve"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-rose-600 hover:bg-rose-500 text-white"
              }`}
            >
              {actioningId ? "Processing..." : confirmAction?.type === "approve" ? "Approve Resale" : "Reject Resale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
