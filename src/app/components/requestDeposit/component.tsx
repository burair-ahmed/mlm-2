'use client';

import { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

export default function RequestDeposit() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [proof, setProof] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!amount || !paymentMethod || !proof) {
    toast.error('Please fill all required fields.');
    return;
  }

  const formData = new FormData();
formData.append('amount', amount);
formData.append('paymentMethod', paymentMethod);
formData.append('notes', notes);
formData.append('userId', String(user?._id ?? ''));
formData.append('email', String(user?.email ?? ''));


  if (proof && proof instanceof File) {
    formData.append('proof', proof, proof.name); // ✅ Explicit file with filename
  } else {
    toast.error('Invalid proof file.');
    return;
  }

  try {
    setSubmitting(true);
    const res = await fetch('/api/deposit/request', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit deposit request');

    toast.success('Deposit request submitted successfully!');
    setAmount('');
    setPaymentMethod('');
    setNotes('');
    setProof(null);
  } catch (err) {
    toast.error((err as Error).message);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Request a Deposit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div>
          <Label>Email</Label>
          <Input value={user?.email || ''} readOnly className="bg-gray-100" />
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount">Amount (PKR)</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter deposit amount"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <Label>Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="JazzCash">JazzCash</SelectItem>
              <SelectItem value="EasyPaisa">EasyPaisa</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <Label>Notes / Transaction Details</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional note or sender reference"
          />
        </div>

        {/* Proof of Payment */}
        <div>
          <Label>Upload Proof of Payment</Label>
          <Input type="file" accept="image/*" onChange={handleProofChange} required />
          {proof && <p className="text-sm mt-1 text-gray-600">Selected: {proof.name}</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Submitting...' : 'Submit Deposit Request'}
        </Button>
      </form>

      {/* Payment Info Cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Bank Transfer</CardTitle>
    </CardHeader>
    <CardContent className="space-y-1 text-sm text-gray-700">
      <p><strong>Bank Name:</strong> Meezan Bank</p>
      <p><strong>Account Title:</strong> Al Ashraf Holdings</p>
      <p><strong>Account Number:</strong> 01234567890123</p>
      <p><strong>IBAN:</strong> PK12MEZN0000123456789012</p>
    </CardContent>
  </Card>

  <Card className="w-full">
    <CardHeader>
      <CardTitle>JazzCash</CardTitle>
    </CardHeader>
    <CardContent className="space-y-1 text-sm text-gray-700">
      <p><strong>Account Name:</strong> Al Ashraf Holdings</p>
      <p><strong>Mobile Number:</strong> 0300-1234567</p>
    </CardContent>
  </Card>

  <Card className="w-full">
    <CardHeader>
      <CardTitle>EasyPaisa</CardTitle>
    </CardHeader>
    <CardContent className="space-y-1 text-sm text-gray-700">
      <p><strong>Account Name:</strong> Al Ashraf Holdings</p>
      <p><strong>Mobile Number:</strong> 0345-7654321</p>
    </CardContent>
  </Card>
</div>

    </div>
  );
}
