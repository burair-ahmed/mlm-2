'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
// import Link from "next/link";
// import HierarchyTree from "./components/HierarchyTree";
// import TransactionHistory from "./components/TransactionHistory";
// import CommissionHistory from "./components/CommissionHistory";
// import DepositForm from "./components/DepositForm";
// import BuyEquityUnitsForm from "./components/BuyEquityUnitsForm";
// import AccountOverview from "./components/AccountOverview";
// import ReferralInfo from "./components/ReferralInfo";
// import EquitySummary from "./components/EquitySummary";

// import UserInvestments from './components/UserInvestments';
// import IndustryPackage from './components/packages/IndustryPackage';
// import RentalPackage from './components/packages/RentalPackage';
// import TradingPackage from './components/packages/TradingPackage';
// import MyInvestments from './components/packages/PurchasedPackages';
import LandingPage from './home/page';

export default function Home() {
  const { user, loading } = useAuth();
  const [, setReferralLink] = useState('');

  useEffect(() => {
    if (user) {
      setReferralLink(`${window.location.origin}/register?ref=${user.referralCode}`);
    }
  }, [user]);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;

  return (
    <div className="p-0 mx-auto">
      {/* Navbar */}
      {/* <div className="flex justify-between items-center mb-8">
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
      </div> */}

      {user && (
     <LandingPage/>
      )}
    </div>
  );
}
