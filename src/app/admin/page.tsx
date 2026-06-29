'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { CustomSidebar } from '../../components/custom/CustomSidebar';
import { NotificationBell } from '../../components/custom/NotificationBell';

import AdminOverview from '../components/admin/AdminOverview';
import AdminEquityPackages from '../components/AdminEquityPackages';
import AdminProfitUpdate from '../components/admin/AdminProfitUpdate';
import AdminKYCRequests from '../components/admin/AdminKYCRequests';
import AdminWithdrawalsTable from '../components/admin/AdminWithdrawalsTable';
import AdminDepositRequests from '../components/admin/AdminDepositRequests';
import AssignRoleToUser from '../components/admin/roles/AssignRoleToUser';
import PermissionManagement from '../components/admin/roles/PermissionManagement';
import RoleManagement from '../components/admin/roles/RoleManagement';
import AdminResaleRequests from '../components/admin/AdminResaleRequests';

import {
  LayoutDashboard,
  UserPlus,
  Package,
  Layers,
  Banknote,
  Coins,
  ShieldAlert,
  Sliders,
  DollarSign,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

const adminTabsConfig = [
  { title: "Overview", icon: LayoutDashboard, permission: "access_admin_dashboard" },
  { title: "Assign Roles", icon: UserPlus, permission: "assign_roles" },
  { title: "Equity Packages", icon: Package, permission: "create_package" },
  { title: "KYC Requests", icon: Layers, permission: "approve_kyc" },
  { title: "Withdrawal Requests", icon: Banknote, permission: "handle_withdrawals" },
  { title: "Deposit Requests", icon: Coins, permission: "handle_deposits" },
  { title: "Role Management", icon: ShieldAlert, permission: "manage_roles" },
  { title: "Permission Management", icon: Sliders, permission: "create_permission" },
  { title: "Admin Profit", icon: DollarSign, permission: "profit_update" },
  { title: "Resale Requests", icon: RefreshCw, permission: "manage_purchased_packages" },
];

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");

  // Route guarding check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Compute allowed tabs based on permissions
  const allowedTabs = useMemo(() => {
    if (!user) return [];
    
    // Admins and Super Admins get all tabs
    if (user.isAdmin || user.role === 'admin' || user.role === 'Super Admin') {
      return adminTabsConfig;
    }

    return adminTabsConfig.filter(tab => 
      user.customPermissions?.includes(tab.permission)
    );
  }, [user]);

  // Adjust active tab if it's no longer allowed
  useEffect(() => {
    if (allowedTabs.length > 0 && !allowedTabs.find(t => t.title === activeTab)) {
      setActiveTab(allowedTabs[0].title);
    }
  }, [allowedTabs, activeTab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-slate-100 text-lg">
        <div className="animate-pulse flex items-center gap-2">
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
          <span>Loading Admin Panel...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Access check
  const hasAdminAccess = user.isAdmin || 
    user.role === 'admin' || 
    user.role === 'Super Admin' || 
    user.customPermissions?.includes("access_admin_dashboard");

  if (!hasAdminAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-8 text-center space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-2xl">
          <ShieldAlert className="h-8 w-8 text-red-400" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You do not have administrative privileges to access this panel. If you believe this is an error, please contact support.
          </p>
        </div>
        <button
          onClick={() => router.push("/user")}
          className="mt-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
        >
          Return to Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <CustomSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={allowedTabs}
        isAdminView={true}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 md:px-8 bg-slate-950/45 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-sm font-semibold">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" /> Admin Management Console
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-xs font-bold text-accent uppercase tracking-wider text-glow-gold">
              {activeTab}
            </div>
            <NotificationBell />
          </div>
        </header>

        {/* Content Panel */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === "Overview" && <AdminOverview />}
          {activeTab === "Assign Roles" && <AssignRoleToUser />}
          {activeTab === "Equity Packages" && <AdminEquityPackages />}
          {activeTab === "KYC Requests" && <AdminKYCRequests />}
          {activeTab === "Withdrawal Requests" && <AdminWithdrawalsTable />}
          {activeTab === "Deposit Requests" && <AdminDepositRequests />}
          {activeTab === "Role Management" && <RoleManagement />}
          {activeTab === "Permission Management" && <PermissionManagement />}
          {activeTab === "Admin Profit" && <AdminProfitUpdate />}
          {activeTab === "Resale Requests" && <AdminResaleRequests />}
        </main>
      </div>
    </div>
  );
}