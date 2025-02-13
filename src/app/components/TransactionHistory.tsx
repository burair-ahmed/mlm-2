'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  createdAt: string;
  description?: string;
}

export default function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (!user?._id) return;
  
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
  
        const response = await fetch(`/api/transactions?userId=${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) throw new Error('Failed to fetch transactions');
  
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTransactions();
  }, [user]);

  if (loading) return <div className="text-gray-500 p-4">Loading transactions...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map(tx => (
                <tr key={tx._id} className="border-t">
                  <td className="py-2">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className={`py-2 capitalize ${tx.type === 'commission' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type}
                  </td>
                  <td className={`py-2 ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-2">
                    {tx.description || 'No description'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}