import React from 'react';

interface User {
  email: string;
  balance: number;
  withdrawnProfits: number;
}

export default function AccountOverview({ user }: { user: User }) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Account Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Balance: ${user.balance.toFixed(2)}</p>
          <p className="text-gray-600">Balance: ${user.withdrawnProfits.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
