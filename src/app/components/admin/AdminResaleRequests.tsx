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
import { RefreshCw, Check, X, ClipboardList } from "lucide-react";

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
    if (!confirm("Are you sure you want to APPROVE this resale request? This will refund equity units back to the user and reclaim the package units.")) {
      return;
    }
    setActioningId(id);
    try {
      const res = await axios.post("/api/admin/resale-requests/approve", { purchasedPackageId: id }, { headers });
      if (res.data.success) {
        toast.success(res.data.message || "Resale approved successfully");
        fetchRequests();
      } else {
        toast.error(res.data.message || "Failed to approve resale");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to approve resale");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to REJECT this resale request? The package will remain active for the user.")) {
      return;
    }
    setActioningId(id);
    try {
      const res = await axios.post("/api/admin/resale-requests/reject", { purchasedPackageId: id }, { headers });
      if (res.data.success) {
        toast.success(res.data.message || "Resale rejected successfully");
        fetchRequests();
      } else {
        toast.error(res.data.message || "Failed to reject resale");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reject resale");
    } finally {
      setActioningId(null);
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
                        onClick={() => handleApprove(req._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actioningId !== null}
                        onClick={() => handleReject(req._id)}
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
    </Card>
  );
}
