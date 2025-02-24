'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function DepositForm() {
  const { user, refreshUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Deposit failed');
      
      setSuccess(`Successfully deposited $${amount}!`);
      setAmount('');
      refreshUser(); // Update user balance
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Add Funds (Dummy)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Deposit Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Funds
        </button>
      </form>
    </div>
  );
}