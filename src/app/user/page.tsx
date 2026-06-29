"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomSidebar } from "@/components/custom/CustomSidebar";
import { useAuth } from "../../../context/AuthContext";
import { NotificationBell } from "@/components/custom/NotificationBell";

import Dashboard from "../components/user/user-dashboard";
import CommissionHistory from "../components/CommissionHistory";
import HierarchyTree from "../components/HierarchyTree";
import MyInvestments from "../components/packages/PurchasedPackages";
import BuyEquityUnitsForm from "../components/BuyEquityUnitsForm";
import ReferralInfo from "../components/ReferralInfo";
import Account from "../components/user/user-profile";
import Settings from "../components/user/settings";
import { IUser } from "../../../models/User";
import KYCForm from "../components/user/kyc/KYCForm";
import WithdrawalForm from "../components/user/WithdrawalForm";
import RequestDeposit from "../components/requestDeposit/component";
import DepositHistory from "../components/requestDeposit/DepositHistory";
import GetHelp from "../components/user/GetHelp";
import Link from "next/link";

import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileCheck,
  FolderOpen,
  ArrowDownUp,
  ShieldAlert,
  TrendingUp,
  History,
} from "lucide-react";

function UserWorkspaceContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [depositRefreshTrigger, setDepositRefreshTrigger] = useState(0);

  const handleDepositRefresh = () => {
    setDepositRefreshTrigger((prev) => prev + 1);
    setActiveTab("Deposit History");
  };

  const referralCode = user?.referralCode || "";
  const referralLink =
    typeof window !== "undefined" && user
      ? `${window.location.origin}/register?ref=${referralCode}`
      : "";

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const tabPermissions: Record<string, string> = {
    "Dashboard": "view_dashboard",
    "Active Packages": "view_investments",
    "Commission History": "view_commissions",
    "Referrals": "view_referrals",
    "Equity Units Converter": "convert_units",
    "KYC": "view_kyc",
    "Request Withdrawal": "request_withdrawal",
    "Deposit": "request_deposit",
    "Deposit History": "view_dashboard",
    "Account": "view_account",
    "Settings": "manage_settings",
    "Get Help": "get_help",
  };

  const hasPermission = (tabTitle: string) => {
    // Admins always have access to all tabs
    if (user?.isAdmin || user?.role === "admin" || user?.role === "Super Admin") return true;

    // Dashboard, Deposit, Deposit History, and Get Help are open by default to all logged-in users
    if (tabTitle === "Dashboard" || tabTitle === "Get Help" || tabTitle === "Deposit" || tabTitle === "Deposit History") return true;

    const requiredPermission = tabPermissions[tabTitle];
    if (!requiredPermission) return false;

    return user?.customPermissions?.includes(requiredPermission) || false;
  };

  const sidebarTabs = [
    { title: "Dashboard", icon: LayoutDashboard, permission: "view_dashboard" },
    { title: "Active Packages", icon: FolderOpen, permission: "view_investments" },
    { title: "Commission History", icon: BarChart3, permission: "view_commissions" },
    { title: "Referrals", icon: Users, permission: "view_referrals" },
    { title: "Equity Units Converter", icon: ArrowDownUp, permission: "convert_units" },
    { title: "Deposit History", icon: History, permission: "view_dashboard" },
    { title: "KYC", icon: FileCheck, permission: "view_kyc" },
  ];

  const allowedTabs = sidebarTabs.filter((tab) => hasPermission(tab.title));

  // Sync tab from URL query params
  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get("tab");
      if (tab) {
        const matchedTab = sidebarTabs.find(
          (t) => t.title.toLowerCase() === tab.toLowerCase()
        );
        if (matchedTab && hasPermission(matchedTab.title)) {
          setActiveTab(matchedTab.title);
        } else {
          // Check if it's one of the other pages not in standard sidebar
          const otherTabs = ["Request Withdrawal", "Deposit", "Account", "Settings", "Get Help"];
          const matchedOther = otherTabs.find(
            (t) => t.toLowerCase() === tab.toLowerCase()
          );
          if (matchedOther && hasPermission(matchedOther)) {
            setActiveTab(matchedOther);
          }
        }
      }
    }
  }, [searchParams, user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-slate-100 text-lg">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
          <span>Loading Workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <CustomSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={allowedTabs}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-slate-950/45 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-sm font-semibold">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" /> Back to Website
            </Link>
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-xs font-bold text-accent uppercase tracking-wider text-glow-gold">
              {activeTab}
            </div>
            <NotificationBell onTabChange={(tabTitle) => {
              const matchedTab = sidebarTabs.find(
                (t) => t.title.toLowerCase() === tabTitle.toLowerCase()
              );
              if (matchedTab && hasPermission(matchedTab.title)) {
                setActiveTab(matchedTab.title);
              } else {
                const otherTabs = ["Request Withdrawal", "Deposit", "Account", "Settings", "Get Help"];
                const matchedOther = otherTabs.find(
                  (t) => t.toLowerCase() === tabTitle.toLowerCase()
                );
                if (matchedOther && hasPermission(matchedOther)) {
                  setActiveTab(matchedOther);
                }
              }
            }} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {!hasPermission(activeTab) ? (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-900/20 border border-white/5 rounded-3xl text-center space-y-4 max-w-lg mx-auto mt-12">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="h-6 w-6 text-red-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Access Denied</h3>
                <p className="text-sm text-muted-foreground">You do not have the required permissions to view this panel. Please contact an administrator if you believe this is an error.</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "Dashboard" && <Dashboard />}

              {activeTab === "Commission History" && (
                <div className="space-y-6">
                  <ReferralInfo referralLink={referralLink} referralCode={referralCode} />
                  <CommissionHistory />
                </div>
              )}

              {activeTab === "Referrals" && (
                <div className="space-y-6">
                  <ReferralInfo referralLink={referralLink} referralCode={referralCode} />
                  <HierarchyTree />
                </div>
              )}

              {activeTab === "Active Packages" && <MyInvestments />}

              {activeTab === "Equity Units Converter" && <BuyEquityUnitsForm />}

              {activeTab === "Account" && <Account user={user as IUser} />}

              {activeTab === "Settings" && <Settings />}

              {activeTab === "Get Help" && <GetHelp />}

              {activeTab === "KYC" && <KYCForm kyc={user.kyc} />}

              {activeTab === "Request Withdrawal" && <WithdrawalForm />}

              {activeTab === "Deposit" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground">Fund Account</h2>
                    <p className="text-xs text-muted-foreground">Request equity deposit to start purchasing packages.</p>
                  </div>
                  <RequestDeposit onSuccess={handleDepositRefresh} />
                </div>
              )}

              {activeTab === "Deposit History" && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground">Deposit Requests History</h2>
                    <p className="text-xs text-muted-foreground">Track the statuses of your deposit receipts.</p>
                  </div>
                  <DepositHistory refreshTrigger={depositRefreshTrigger} />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function UserWorkspacePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-slate-950 text-slate-100 text-lg">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
          <span>Loading Workspace...</span>
        </div>
      </div>
    }>
      <UserWorkspaceContent />
    </Suspense>
  );
}
