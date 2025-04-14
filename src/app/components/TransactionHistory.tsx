'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

interface Transaction {
  _id: string;
  amount: number;
  equityUnits: number;
  type: string;
  createdAt: string;
  description?: string;
}

const ITEMS_PER_PAGE = 5;

export default function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState<string>('all');
  const [transactionCounts, setTransactionCounts] = useState<Record<string, number>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    try {
      if (!user?._id) return;

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      if (activeType !== 'all') params.append('type', activeType);

      const response = await fetch(`/api/transactions?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch transactions');

      const res = await response.json();
      setTransactions(res.transactions || []);
      setTotalPages(res.totalPages || 1);
      setTransactionCounts(res.counts || { all: 0 }); // Ensures `transactionCounts['all']` is always valid
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, activeType, page]);

  const staticTypeOrder = ['all', 'deposit', 'purchase', 'commission', 'profit-withdrawal', 'cash_to_equity'];

const transactionTypes = staticTypeOrder.filter((type) => type === 'all' || transactionCounts[type] > 0);



  const getAmountDisplay = (tx: Transaction) => {
    return tx.amount > 0
      ? `$${tx.amount.toFixed(2)}`
      : `${tx.equityUnits} Equity Units`;
  };

  const getColorClass = (type: string) => {
    if (type === 'commission' || type === 'profit-withdrawal') return 'text-green-600';
    if (type === 'equity_purchase' || type === 'cash_to_equity') return 'text-blue-600';
    return 'text-red-600';
  };

  const handleFilterChange = (type: string) => {
    setActiveType(type);
    setPage(1);
  };

  if (loading) return <div className="text-gray-500 p-4">Loading transactions...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-4">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {transactionTypes.map((type) => {
          const isActive = type === activeType;
          const count = transactionCounts[type] || 0;

          return (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`flex items-center px-3 py-1 rounded-full transition-all font-medium
                ${isActive
                  ? 'bg-black text-white'
                  : 'bg-black/10 text-black/70 hover:bg-black hover:text-white'
                }`}
            >
              <span className="capitalize mr-2">{type.replace(/_/g, ' ')}</span>
              <span className={`px-2 py-0.5 text-sm rounded-full 
                ${isActive
                  ? 'bg-white text-black'
                  : 'bg-white text-black/70'
                }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
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
              transactions.map((tx) => (
                <tr key={tx._id} className="border-t">
                  <td className="py-2">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className={`py-2 capitalize ${getColorClass(tx.type)}`}>
                    {tx.type.replace(/_/g, ' ')}
                  </td>
                  <td className={`py-2 ${getColorClass(tx.type)}`}>
                    {getAmountDisplay(tx)}
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

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
