'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '../../../../context/AuthContext';

export default function WithdrawalForm() {
  const { user } = useAuth();
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState({
    accountTitle: '',
    accountNumber: '',
    bankName: '',
    eWalletType: '',
    extraInfo: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [agree, setAgree] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const numericAmount = parseFloat(amount);
  if (!user) return <div>Loading user data...</div>;
  const remainingBalance = user?.balance - (isNaN(numericAmount) ? 0 : numericAmount);

  const handleSubmit = () => {
    if (!method || !amount || !details.accountNumber) {
      toast.error('Please fill all required fields');
      return;
    }

    if (numericAmount > user.balance) {
        toast.error('Insufficient balance');
        return;
    }
    
    setShowDialog(true);
};

const confirmSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/withdrawals/request', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ method, amount: parseFloat(amount), details }),
        });
        
      const data = await res.json();
      if (res.ok) {
          toast.success('Withdrawal request submitted successfully!');
        setAmount('');
        setMethod('');
        setDetails({
            accountTitle: '',
            accountNumber: '',
            bankName: '',
            eWalletType: '',
          extraInfo: '',
        });
        setShowDialog(false);
        setAgree(false);
    } else {
        toast.error(data.error || 'Something went wrong');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        toast.error('Network error, try again later');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-lg w-full mx-auto space-y-4 p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-lg font-semibold">Request Withdrawal</h2>

      <div>
        <Label>Withdrawal Method</Label>
        <Select onValueChange={setMethod} value={method}>
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            <SelectItem value="JazzCash">JazzCash</SelectItem>
            <SelectItem value="EasyPaisa">EasyPaisa</SelectItem>
            <SelectItem value="SadaPay">SadaPay</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Amount ($)</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 5000"
        />
        {!isNaN(numericAmount) && numericAmount > 0 && (
          <p className="text-sm text-muted-foreground">
            Remaining Balance: ${remainingBalance.toLocaleString()}
          </p>
        )}
      </div>

      <div>
        <Label>Account Holder Name</Label>
        <Input
          value={details.accountTitle}
          onChange={(e) => setDetails({ ...details, accountTitle: e.target.value })}
        />
      </div>

      <div>
        <Label>Account / Wallet Number</Label>
        <Input
          value={details.accountNumber}
          onChange={(e) => setDetails({ ...details, accountNumber: e.target.value })}
        />
      </div>

      {method === 'Bank Transfer' && (
        <div>
          <Label>Bank Name</Label>
          <Input
            value={details.bankName}
            onChange={(e) => setDetails({ ...details, bankName: e.target.value })}
            placeholder="e.g. HBL, Meezan"
          />
        </div>
      )}

      {['JazzCash', 'EasyPaisa', 'SadaPay', 'Other'].includes(method) && (
        <div>
          <Label>Wallet Type (Optional)</Label>
          <Input
            value={details.eWalletType}
            onChange={(e) => setDetails({ ...details, eWalletType: e.target.value })}
            placeholder="e.g. Personal, Business"
          />
        </div>
      )}

      <div>
        <Label>Extra Info (Optional)</Label>
        <Textarea
          value={details.extraInfo}
          onChange={(e) => setDetails({ ...details, extraInfo: e.target.value })}
          placeholder="Additional instructions or reference"
        />
      </div>

      <Button disabled={loading} onClick={handleSubmit} className="w-full">
        {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p>You are about to request ${numericAmount.toLocaleString()} withdrawal via <strong>{method}</strong>.</p>
            <p><strong>Account Title:</strong> {details.accountTitle}</p>
            <p><strong>Account/Wallet Number:</strong> {details.accountNumber}</p>
            {method === 'Bank Transfer' && <p><strong>Bank Name:</strong> {details.bankName}</p>}
            {['JazzCash', 'EasyPaisa', 'SadaPay', 'Other'].includes(method) && details.eWalletType && (
              <p><strong>Wallet Type:</strong> {details.eWalletType}</p>
            )}
            {details.extraInfo && <p><strong>Extra Info:</strong> {details.extraInfo}</p>}
            <div className="flex items-center space-x-2 pt-2">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <Label htmlFor="agree">I confirm the above information is correct.</Label>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!agree || loading} onClick={confirmSubmit}>
              {loading ? 'Processing...' : 'Confirm Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
