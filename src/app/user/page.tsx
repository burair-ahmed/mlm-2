"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomSidebar } from "@/components/custom/CustomSidebar";
import { useAuth } from "../../../context/AuthContext";

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
import AssignRoleToUser from "../components/admin/roles/AssignRoleToUser";
import AdminEquityPackages from "../components/AdminEquityPackages";
import AdminKYCRequests from "../components/admin/AdminKYCRequests";
import AdminWithdrawalsTable from "../components/admin/AdminWithdrawalsTable";
import RoleManagement from "../components/admin/roles/RoleManagement";
import PermissionManagement from "../components/admin/roles/PermissionManagement";
import AdminProfitUpdate from "../components/admin/AdminProfitUpdate";
import RequestDeposit from "../components/requestDeposit/component";
import GetHelp from "../components/user/GetHelp";
import Link from "next/link";

import {
  LayoutDashboard,
  BarChart3,
  Users,
  FileCheck,
  FolderOpen,
  ArrowDownUp,
  UserPlus,
  Package,
  Layers,
  Banknote,
  ShieldAlert,
  Sliders,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function UserWorkspacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");

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

  const hasPermission = (permission: string) => {
    // Admins always have access to all tabs
    if (user.isAdmin || user.role === "admin") return true;

    const defaultUserTabs = [
      "Dashboard",
      "Commission History",
      "Referrals",
      "KYC",
      "Active Packages",
      "Equity Units Converter",
      "Request Withdrawal",
      "Deposit",
      "Account",
      "Settings",
      "Get Help",
    ];

    const tab = sidebarTabs.find(
      (t) => t.permission === permission || t.title === permission
    );
    if (tab && defaultUserTabs.includes(tab.title)) {
      return true;
    }

    return user.customPermissions?.includes(permission) || false;
  };

  const sidebarTabs = [
    { title: "Dashboard", icon: LayoutDashboard, permission: "access_admin_dashboard" },
    { title: "Active Packages", icon: FolderOpen, permission: "view_investments" },
    { title: "Commission History", icon: BarChart3, permission: "view_commissions" },
    { title: "Referrals", icon: Users, permission: "view_referrals" },
    { title: "Equity Units Converter", icon: ArrowDownUp, permission: "convert_units" },
    { title: "KYC", icon: FileCheck, permission: "view_kyc" },
    
    // Admin Panels
    { title: "Assign Roles", icon: UserPlus, permission: "assign_roles" },
    { title: "Equity Packages", icon: Package, permission: "create_package" },
    { title: "KYC Requests", icon: Layers, permission: "approve_kyc" },
    { title: "Withdrawal Requests", icon: Banknote, permission: "handle_withdrawals" },
    { title: "Role Management", icon: ShieldAlert, permission: "manage_roles" },
    { title: "Permission Management", icon: Sliders, permission: "create_permission" },
    { title: "Admin Profit", icon: DollarSign, permission: "profit_update" },
  ];

  const allowedTabs = sidebarTabs.filter((tab) => hasPermission(tab.permission));

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <CustomSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={allowedTabs}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Workspace Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-slate-950/45 backdrop-blur-md sticky top-0 z-35">
          <h1 className="text-sm font-semibold">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" /> Back to Website
            </Link>
          </h1>
          <div className="text-xs font-bold text-accent uppercase tracking-wider text-glow-gold">
            {activeTab}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
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

          {activeTab === "Assign Roles" && <AssignRoleToUser />}

          {activeTab === "Equity Packages" && <AdminEquityPackages />}

          {activeTab === "KYC Requests" && <AdminKYCRequests />}

          {activeTab === "Withdrawal Requests" && <AdminWithdrawalsTable />}

          {activeTab === "Role Management" && <RoleManagement />}

          {activeTab === "Permission Management" && <PermissionManagement />}

          {activeTab === "Admin Profit" && <AdminProfitUpdate />}

          {activeTab === "Deposit" && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-foreground">Fund Account</h2>
                <p className="text-xs text-muted-foreground">Request equity deposit to start purchasing packages.</p>
              </div>
              <RequestDeposit />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
