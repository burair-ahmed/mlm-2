// components/DashboardTabs.tsx

'use client';

import { DASHBOARD_TABS } from '../../constants/dashboardTabs';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from '@/components/ui/button';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardTabs({ activeTab, setActiveTab }: Props) {
  const { user } = useAuth();

  const allowedTabs = DASHBOARD_TABS.filter(tab =>
    user?.customPermissions?.includes(tab.permission)
  );

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {allowedTabs.map((tab) => (
        <Button
          key={tab.slug}
          variant={activeTab === tab.slug ? 'default' : 'outline'}
          onClick={() => setActiveTab(tab.slug)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
