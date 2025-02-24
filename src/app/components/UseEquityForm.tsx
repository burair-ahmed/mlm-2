'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function UseEquityForm() {
  const { user, refreshUser } = useAuth();
  const [units, setUnits] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericUnits = Number(units);
    
    try {
      const response = await fetch('/api/equity/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ units: numericUnits })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Transaction failed');
      }

      setSuccess(`Used ${numericUnits} equity units!`);
      setUnits('');
      refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Use Equity Units</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Units to Use
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
            Available Units: {user?.equityUnits || 0}
          </p>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Purchase Equity
        </button>
      </form>
    </div>
  );
}