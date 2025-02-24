'use client';
import { useState } from 'react';

interface PackageDetailsProps {
    pkg: {
        _id: string;
      name: string;
      availableUnits: number;
      equityUnits: number;
    };
    onClose: () => void;
  }

export default function PackageDetails({ pkg, onClose }: PackageDetailsProps) {
  const [units, setUnits] = useState<number>(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBuy = async () => {
    setError('');
    setSuccess('');

    if (units <= 0 || units > pkg.availableUnits) {
      setError('Invalid unit quantity');
      return;
    }

    try {
      const response = await fetch('/api/equity/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ packageId: pkg._id, units })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to buy equity');
      }

      setSuccess('Equity purchase successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to buy equity');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">{pkg.name} Details</h3>
        <p>Available Units: {pkg.availableUnits}</p>
        <p>Price per Unit: ${pkg.equityUnits}</p>

        <label className="block mt-4 font-medium">Buy Units:</label>
        <input
          type="number"
          value={units}
          onChange={(e) => setUnits(Number(e.target.value))}
          className="w-full p-2 border rounded mt-1"
          min="1"
          max={pkg.availableUnits}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
            Close
          </button>
          <button onClick={handleBuy} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
