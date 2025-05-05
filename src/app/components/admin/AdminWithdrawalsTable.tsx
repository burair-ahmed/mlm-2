'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';

type Withdrawal = {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  method: string;
  amount: number;
  status: string;
  createdAt: string;
  details: {
    accountTitle?: string;
    accountNumber?: string;
    bankName?: string;
    eWalletType?: string;
    extraInfo?: string;
  };
};

export default function AdminWithdrawalsTable() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/withdrawals/list'); // You need to create this API
      const data = await res.json();
      setWithdrawals(data.requests);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/withdrawals/update/[id]`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Updated to ${status}`);
      fetchWithdrawals();
    } else {
      toast.error('Failed to update status');
    }
  };

  const filtered = selectedStatus === 'All'
    ? withdrawals
    : withdrawals.filter((w) => w.status === selectedStatus);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Withdrawal Requests</h2>

      <div className="flex items-center gap-4">
        <Label>Status Filter</Label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Process">In Process</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-2">User</th>
              <th className="p-2">Method</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Details</th>
              <th className="p-2">Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w._id} className="border-t">
                <td className="p-2">
                  <div className="font-medium">{w.userId.fullName}</div>
                  <div className="text-xs text-muted-foreground">{w.userId.email}</div>
                </td>
                <td className="p-2">{w.method}</td>
                <td className="p-2">${w.amount.toLocaleString()}</td>
                <td className="p-2">
                  <Badge variant="outline">{w.status}</Badge>
                </td>
                <td className="p-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">View</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h3 className="font-bold text-lg">Details</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Account Title:</strong> {w.details.accountTitle}</p>
                        <p><strong>Account No:</strong> {w.details.accountNumber}</p>
                        {w.details.bankName && <p><strong>Bank:</strong> {w.details.bankName}</p>}
                        {w.details.eWalletType && <p><strong>Wallet Type:</strong> {w.details.eWalletType}</p>}
                        {w.details.extraInfo && <p><strong>Extra:</strong> {w.details.extraInfo}</p>}
                      </div>
                    </DialogContent>
                  </Dialog>
                </td>
                <td className="p-2">
                  <Select onValueChange={(val) => updateStatus(w._id, val)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Process">In Process</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
