'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function BuyEquityUnitsForm() {
  const { user, refreshUser } = useAuth();
  const [units, setUnits] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const PRICE_PER_UNIT = 10; // $10 per equity unit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericUnits = Number(units);
    
    try {
      const response = await fetch('/api/equity/buy-units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ units: numericUnits })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Purchase failed');
      }

      setSuccess(`Purchased ${numericUnits} units!`);
      setUnits('');
      refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Buy Equity Units ($10/unit)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Units to Buy
          </label>
          <input
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Total Cost: ${(Number(units) * PRICE_PER_UNIT).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            Available Balance: ${user?.balance?.toFixed(2)}
          </p>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Purchase Equity Units
        </button>
      </form>
    </div>
  );
}
