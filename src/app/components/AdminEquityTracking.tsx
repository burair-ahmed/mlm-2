'use client';
import { useEffect, useState } from 'react';

interface EquityOwnership {
  _id: string;
  email: string;
  equityOwnership: Array<{
    packageId: {
      _id: string;
      name: string;
      equityUnits: number;
    };
    units: number;
  }> | null; // Ensure it can be null
}

export default function AdminEquityTracking() {
  const [equityData, setEquityData] = useState<EquityOwnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('/api/admin/equity', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        setEquityData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading equity data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Equity Ownership</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">User</th>
            <th className="text-left py-2">Package</th>
            <th className="text-left py-2">Units</th>
            <th className="text-left py-2">Value</th>
          </tr>
        </thead>
        <tbody>
  {equityData.length > 0 ? (
    equityData.map((user) =>
      user.equityOwnership && Array.isArray(user.equityOwnership) ? (
        user.equityOwnership.map((ownership, i) => (
          <tr key={`${user._id}-${i}`} className="border-t">
            <td className="py-2">{user.email}</td>
            <td className="py-2">{ownership.packageId ? ownership.packageId.name : 'Unknown Package'}</td>
            <td className="py-2">{ownership.units}</td>
            <td className="py-2">
  {ownership.packageId && ownership.packageId.equityUnits
    ? `$${(ownership.units * ownership.packageId.equityUnits).toFixed(2)}`
    : 'N/A'}
</td>
          </tr>
        ))
      ) : (
        <tr key={user._id} className="border-t">
          <td className="py-2">{user.email}</td>
          <td colSpan={3} className="py-2 text-center">No ownership data</td>
        </tr>
      )
    )
  ) : (
    <tr>
      <td colSpan={4} className="text-center py-4">No equity ownership data found.</td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
}
