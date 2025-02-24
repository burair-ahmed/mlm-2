'use client';
import { useState } from 'react';

export default function CreateEquityPackageForm() {
  const [name, setName] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [equityUnits, setEquityUnits] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/equity/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name,
          totalUnits: Number(totalUnits),
          equityUnits: Number(equityUnits)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create package');
      }

      setSuccess('Package created successfully!');
      setName('');
      setTotalUnits('');
      setEquityUnits('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create package');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h3 className="text-lg font-semibold mb-4">Create New Equity Package</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Package Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Units</label>
          <input
            type="number"
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Equity Units</label>
          <input
            type="number"
            value={equityUnits}
            onChange={(e) => setEquityUnits(e.target.value)}
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Package
        </button>
      </form>
    </div>
  );
}
