"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  // ListIcon,
  // SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
// import { useAuth } from '../../context/AuthContext';

const data = {
  // navMain: [
  //   {
  //     title: "Dashboard",
  //     url: "#",
  //     icon: LayoutDashboardIcon,
  //   },
  //   {
  //     title: "Lifecycle",
  //     url: "#",
  //     icon: ListIcon,
  //   },
  //   {
  //     title: "Analytics",
  //     url: "#",
  //     icon: BarChartIcon,
  //   },
  //   {
  //     title: "Projects",
  //     url: "#",
  //     icon: FolderIcon,
  //   },
  //   {
  //     title: "Team",
  //     url: "#",
  //     icon: UsersIcon,
  //   },
  // ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    
  ],
  documents: [
    {
      name: "KYC",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Request Withdrawal",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
}

// types.ts
export interface User {
  email: string;
  balance: number;
}
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onTabChange?: (tab: string) => void;
  setActiveTab: (tab: string) => void
}

export function AppSidebar({ onTabChange, setActiveTab, ...props }: AppSidebarProps) {
  const tabs = [
    { title: "Dashboard", icon: LayoutDashboardIcon },
    { title: "Commission History", icon: BarChartIcon },
    { title: "Referrals", icon: UsersIcon },
    { title: "Active Packages", icon: FolderIcon },
    { title: "Equity Units Converter", icon: FileCodeIcon },
  ]
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Al Ashraf Holdings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      <SidebarMenu>
          {tabs.map(({ title, icon: Icon }) => (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton onClick={() => onTabChange?.(title)} className="p-[15px]"> 
                <Icon className="h-4 w-4" />
                {title}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <NavDocuments items={data.documents} setActiveTab={setActiveTab} />
          <NavSecondary items={data.navSecondary} setActiveTab={setActiveTab} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
      <NavUser setActiveTab={setActiveTab}/>
      </SidebarFooter>
    </Sidebar>
  )
}
