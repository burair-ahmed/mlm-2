// constants/dashboardTabs.ts

export const DASHBOARD_TABS = [
  {
    label: 'Dashboard',
    slug: 'dashboard',
    permission: 'view:dashboard',
  },
  {
    label: 'Users',
    slug: 'users',
    permission: 'view:users',
  },
  {
    label: 'Roles',
    slug: 'roles',
    permission: 'manage:roles',
  },
  {
    label: 'Referrals',
    slug: 'referrals',
    permission: 'view:referrals',
  },
  {
    label: 'Packages',
    slug: 'packages',
    permission: 'view:packages',
  },
  {
    label: 'Withdrawals',
    slug: 'withdrawals',
    permission: 'manage:withdrawals',
  },
  // Add more as needed
];
