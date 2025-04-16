'use client';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function WithdrawalForm() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod] = useState('bank');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          paymentMethod,
          paymentDetails: {} // Add actual payment details
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Withdrawal failed');
      
      setSuccess('Withdrawal request submitted successfully!');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Withdrawal failed');
      setSuccess('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Request Withdrawal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            min="0.01"
            step="0.01"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Available balance: ${user?.balance?.toFixed(2)}
          </p>
        </div>
        
        {/* Add payment method selection and details */}
        
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Request Withdrawal
        </button>
      </form>
    </div>
  );
}