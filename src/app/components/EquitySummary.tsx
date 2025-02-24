import React from 'react';

interface User {
  balance: number;
  equityUnits: number;
  commissionEarned: number;
}

export default function EquitySummary({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Cash Balance</h3>
        <p className="text-2xl">${user?.balance?.toFixed(2)}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Equity Units</h3>
        <p className="text-2xl">{user?.equityUnits}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold">Total Commission</h3>
        <p className="text-2xl">${user?.commissionEarned?.toFixed(2)}</p>
      </div>
    </div>
  );
}
