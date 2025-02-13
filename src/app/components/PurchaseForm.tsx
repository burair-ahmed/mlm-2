'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function PurchaseForm() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('/api/transactions/purchase', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' ,  Authorization: `Bearer ${token}`,},
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMessage('Purchase successful!');
      setError('');
      setAmount('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-4">Purchase Equity</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Investment Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            step="0.01"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Purchase
        </button>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}