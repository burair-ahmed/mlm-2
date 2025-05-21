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
import HierarchyTree from "../components/HierarchyTree";
import MyInvestments from '../components/packages/PurchasedPackages';
import BuyEquityUnitsForm from "../components/BuyEquityUnitsForm";
import ReferralInfo from "../components/ReferralInfo"
import Account from "../components/user/user-profile"
import Settings from "../components/user/settings"
import { IUser } from '../../../models/User';
import KYCForm from "../components/user/kyc/KYCForm"
import WithdrawalForm from "../components/user/WithdrawalForm"
export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const referralCode = user?.referralCode || '';
  const referralLink = typeof window !== "undefined" && user 
  ? `${window.location.origin}/register?ref=${referralCode}`
  : '';


  const [activeTab, setActiveTab] = useState("Dashboard")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>
  }

  if (!user) return null


  // const renderAllTabs = () => (
  //   <>
  //     <div className={activeTab === "Dashboard" ? "" : "hidden"}>
  //       <Dashboard />
  //     </div>
  //     <div className={activeTab === "Commission History" ? "" : "hidden"}>
  //       <ReferralInfo referralLink={referralLink} referralCode={user.referralCode} />
  //       <CommissionHistory />
  //     </div>
  //     <div className={activeTab === "Referrals" ? "" : "hidden"}>
  //       <HierarchyTree />
  //     </div>
  //     <div className={activeTab === "Active Packages" ? "" : "hidden"}>
  //       <MyInvestments />
  //     </div>
  //     <div className={activeTab === "Unit Converter" ? "" : "hidden"}>
  //       <BuyEquityUnitsForm />
  //     </div>
  //   </>
  // )
  

  return (
      <WithPermission
    slug="view_users"
    fallback={<p className="text-red-500">You don’t have access to this page.</p>}
  >
    <SidebarProvider>
      <AppSidebar onTabChange={setActiveTab} setActiveTab={setActiveTab} />

      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col px-4 py-6">
          <div className={activeTab === "Dashboard" ? "" : "hidden"}>
            <Dashboard />
          </div>
          <div className={activeTab === "Commission History" ? "" : "hidden"}>
            <ReferralInfo referralLink={referralLink} referralCode={referralCode} />
            <CommissionHistory />
          </div>
          <div className={activeTab === "Referrals" ? "" : "hidden"}>
            <WithPermission
    slug="view_commissions"
    fallback={<p className="text-red-500">You don’t have access to this page.</p>}
  >
          <ReferralInfo referralLink={referralLink} referralCode={referralCode}/>
            <HierarchyTree />
            </WithPermission>
          </div>
          <div className={activeTab === "Active Packages" ? "" : "hidden"}>
            <MyInvestments />
          </div>
          <div className={activeTab === "Equity Units Converter" ? "" : "hidden"}>
            <BuyEquityUnitsForm />
          </div>
          <div className={activeTab === "Account" ? "" : "hidden"}>
            <Account user={user as IUser} />
          </div>
          <div className={activeTab === "Settings" ? "" : "hidden"}>
            <Settings />
          </div>
          <div className={activeTab === "KYC" ? "" : "hidden"}>
          <KYCForm kyc={user.kyc} />
          </div>
          <div className={activeTab === "Request Withdrawal" ? "" : "hidden"}>
          <WithdrawalForm/>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </WithPermission>
  )
  
}
