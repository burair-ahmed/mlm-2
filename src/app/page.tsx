'use client'

import Image from "next/image";
import { useAuth } from '../../context/AuthContext';
import Link from "next/link";
import HierarchyTree from "./components/HierarchyTree";
import PurchaseForm from "./components/PurchaseForm";
import TransactionHistory from "./components/TransactionHistory";
import { useEffect, useState } from 'react';
import CommissionHistory from "./components/CommissionHistory";

export default function Home() {
  const { user, logout, loading } = useAuth();
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (user) {
      setReferralLink(`${window.location.origin}/register?ref=${user.referralCode}`);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <main className="p-4 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Equity Platform</h1>
          <nav>
            {user ? (
              <div className="flex items-center gap-4">
                <span>Welcome {user.email}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="text-blue-600 hover:text-blue-500">
                  Login
                </Link>
                <Link href="/register" className="text-blue-600 hover:text-blue-500">
                  Register
                </Link>
                <Link href="/admin" className="text-blue-600 hover:text-blue-500">
                  Admin
                </Link>
              </div>
            )}
          </nav>
        </div>
        
        {user && (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-semibold">Account Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Balance: ${user.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Your Referral Code:</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {user.referralCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(user.referralCode);
                      alert('Referral code copied!');
                    }}
                    className="text-blue-600 hover:text-blue-500 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium mb-2">Your Referral Link:</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    alert('Referral link copied!');
                  }}
                  className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Copy Link
                </button>
              </div>
            </div>
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4">Referral Hierarchy</h3>
              <HierarchyTree />
            </div>
            <PurchaseForm />
            <TransactionHistory />
            <CommissionHistory/>
          </div>
        )}
      </main>
    </div>
  );
}