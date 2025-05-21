// src/config/userTabs.tsx
import Dashboard from "../app/components/user/user-dashboard"
import CommissionHistory from "../app/components/CommissionHistory"
import HierarchyTree from "../app/components/HierarchyTree"
import MyInvestments from "../app/components/packages/PurchasedPackages"
import BuyEquityUnitsForm from "../app/components/BuyEquityUnitsForm"
// import ReferralInfo from "../app/components/ReferralInfo"
import Account from "../app/components/user/user-profile"
import Settings from "../app/components/user/settings"
import KYCForm from "../app/components/user/kyc/KYCForm"
import WithdrawalForm from "../app/components/user/WithdrawalForm"

export interface TabConfig {
  key: string            // unique id
  label: string          // “Dashboard”, “Referrals”, …
  slug: string           // permission required to see it
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FC<any>
}

export const ALL_TABS: TabConfig[] = [
  { key: "dashboard",       label: "Dashboard",             slug: "access_admin_dashboard", component: Dashboard },
  { key: "commissions",     label: "Commission History",     slug: "view_commissions",       component: CommissionHistory },
  { key: "referrals",       label: "Referrals",              slug: "view_users",             component: HierarchyTree },
  { key: "packages",        label: "Active Packages",        slug: "manage_purchased_packages", component: MyInvestments },
  { key: "converter",       label: "Equity Units Converter", slug: "package.buy",            component: BuyEquityUnitsForm },
  { key: "profile",         label: "Account",                slug: "profile.view",           component: Account },
  { key: "settings",        label: "Settings",               slug: "user.manage",            component: Settings },
  { key: "kyc",             label: "KYC",                    slug: "view_kyc",               component: KYCForm },
  { key: "withdrawal",      label: "Request Withdrawal",     slug: "view_withdrawals",       component: WithdrawalForm },
]
