'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SiteHeader } from "@/components/site-header"
import { useAuth } from "../../../context/AuthContext"
import { WithPermission } from "../components/permissions/WithPermission"

import Dashboard from "../components/user/user-dashboard"
import CommissionHistory from "../components/CommissionHistory"
import HierarchyTree from "../components/HierarchyTree"
import MyInvestments from '../components/packages/PurchasedPackages'
import BuyEquityUnitsForm from "../components/BuyEquityUnitsForm"
import ReferralInfo from "../components/ReferralInfo"
import Account from "../components/user/user-profile"
import Settings from "../components/user/settings"
import { IUser } from '../../../models/User'
import KYCForm from "../components/user/kyc/KYCForm"
import WithdrawalForm from "../components/user/WithdrawalForm"
import NoAccess from "../components/NoAccess/component"

import {
  LayoutDashboardIcon,
  BarChartIcon,
  UsersIcon,
  FolderIcon,
  FileCodeIcon,
} from "lucide-react"
import AssignRoleToUser from "../components/admin/roles/AssignRoleToUser"
import AdminEquityPackages from "../components/AdminEquityPackages"
import AdminKYCRequests from "../components/admin/AdminKYCRequests"
import AdminWithdrawalsTable from "../components/admin/AdminWithdrawalsTable"
import RoleManagement from "../components/admin/roles/RoleManagement"
import PermissionManagement from "../components/admin/roles/PermissionManagement"
import AdminProfitUpdate from "../components/admin/AdminProfitUpdate"
import RequestDeposit from "../components/requestDeposit/component"
import GetHelp from "../components/user/GetHelp"

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Dashboard")

  const referralCode = user?.referralCode || ''
  const referralLink = typeof window !== "undefined" && user
    ? `${window.location.origin}/register?ref=${referralCode}`
    : ''

  const hasPermission = (permission: string) => {
    return user?.customPermissions?.includes(permission)
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>
  }

  if (!user) return null

  const sidebarTabs = [
    { title: "Dashboard", icon: LayoutDashboardIcon, permission: "access_admin_dashboard" },
    { title: "Commission History", icon: BarChartIcon, permission: "view_commissions" },
    { title: "Referrals", icon: UsersIcon, permission: "view_referrals" },
    { title: "KYC", icon: FolderIcon, permission: "view_kyc" },
    { title: "Active Packages", icon: FolderIcon, permission: "view_investments" },
    { title: "Equity Units Converter", icon: FileCodeIcon, permission: "convert_units" },
    // { title: "Referrals", icon: FileCodeIcon, permission: "view_referrals" },
    { title: "Assign Roles", icon: FileCodeIcon, permission: "assign_roles" },
    { title: "Equity Packages", icon: FileCodeIcon, permission: "create_package" },
    { title: "KYC Requests", icon: FileCodeIcon, permission: "approve_kyc" },
    { title: "Withdrawal Requests", icon: FileCodeIcon, permission: "handle_withdrawals" },
    { title: "Role Management", icon: FileCodeIcon, permission: "manage_roles" },
    { title: "Permission Management", icon: FileCodeIcon, permission: "create_permission" },
    { title: "Admin Profit", icon: FileCodeIcon, permission: "profit_update" },
  ]

  const allowedTabs = sidebarTabs.filter(tab => hasPermission(tab.permission))

  return (
    <WithPermission
      slug="access_admin_dashboard"
      fallback={<p className="text-red-500">You don’t have access to this page.</p>}
    >
      <SidebarProvider>
        <AppSidebar
          setActiveTab={setActiveTab}
          onTabChange={setActiveTab}
          tabs={allowedTabs}
        />

        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col px-4 py-6">
            {activeTab === "Dashboard" && hasPermission("access_admin_dashboard") && <Dashboard />}

            {activeTab === "Commission History" && hasPermission("view_commissions") && (
              <>
                <ReferralInfo referralLink={referralLink} referralCode={referralCode} />
                <CommissionHistory />
              </>
            )}

            {activeTab === "Referrals" && hasPermission("view_referrals") && (
              <WithPermission slug="view_commissions" fallback={<NoAccess />}>
                <ReferralInfo referralLink={referralLink} referralCode={referralCode} />
                <HierarchyTree />
              </WithPermission>
            )}

            {activeTab === "Active Packages" && hasPermission("view_investments") && (
              <MyInvestments />
            )}

            {activeTab === "Equity Units Converter" && hasPermission("convert_units") && (
              <BuyEquityUnitsForm />
            )}

            {activeTab === "Account" && hasPermission("view_account") && (
              <Account user={user as IUser} />
            )}

            {activeTab === "Settings" && hasPermission("manage_settings") && (
              <Settings />
            )}
            {activeTab === "Get Help" && hasPermission("manage_settings") && (
              <GetHelp/>
            )}

            {activeTab === "KYC" && hasPermission("view_kyc") && (
              <KYCForm kyc={user.kyc} />
            )}

            {activeTab === "Request Withdrawal" && hasPermission("request_withdrawal") && (
              <WithdrawalForm />
            )}
            {activeTab === "Assign Roles" && hasPermission("assign_roles") && (
              <AssignRoleToUser/>
            )}
            {activeTab === "Equity Packages" && hasPermission("create_package") && (
              <AdminEquityPackages/>
            )}
            {activeTab === "KYC Requests" && hasPermission("approve_kyc") && (
              <AdminKYCRequests/>
            )}
            {activeTab === "Withdrawal Requests" && hasPermission("handle_withdrawals") && (
              <AdminWithdrawalsTable/>
            )}
            {activeTab === "Role Management" && hasPermission("manage_roles") && (
              <RoleManagement/>
            )}
            {activeTab === "Permission Management" && hasPermission("create_permission") && (
              <PermissionManagement/>
            )}
            {activeTab === "Admin Profit" && hasPermission("profit_update") && (
              <AdminProfitUpdate/>
            )}
            {activeTab === "Deposit" && (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Deposit</h2>
    {/* Replace this with your actual deposit component */}
    <RequestDeposit/>
  </div>
)}

          </div>
        </SidebarInset>
      </SidebarProvider>
    </WithPermission>
  )
}
