'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

interface Commission {
  _id: string;
  amount: number;
  createdAt: string;
  sourceUser: string;
  description: string;
}

export default function CommissionHistory() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        if (!user?._id) return;

        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`/api/transactions/commissions?userId=${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch commissions');

        const data = await response.json();
        setCommissions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load commissions');
        setCommissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [user]);

  if (loading) return <div className="text-gray-500 p-4">Loading commissions...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-4">Commission History</h3>

      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Source</th>
              <th className="text-left py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {commissions.length > 0 ? (
              commissions.map((commission) => (
                <tr key={commission._id} className="border-t">
                  <td className="py-2">
                    {new Date(commission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-green-600 py-2">
                    +${commission.amount.toFixed(2)}
                  </td>
                  <td className="py-2">{commission.sourceUser}</td>
                  <td className="py-2">{commission.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No commissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stacked cards for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {commissions.length > 0 ? (
          commissions.map((commission) => (
            <div key={commission._id} className="border p-4 rounded-md shadow-sm">
              <div className="text-sm text-gray-600">
                {new Date(commission.createdAt).toLocaleDateString()}
              </div>
              <div className="text-green-600 font-semibold text-lg mt-1">
                +${commission.amount.toFixed(2)}
              </div>
              <div className="text-sm mt-2">
                <strong>Source:</strong> {commission.sourceUser}
              </div>
              <div className="text-sm mt-1">
                <strong>Description:</strong> {commission.description}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No commissions found</div>
        )}
      </div>
    </div>
  );
}
