"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  HelpCircleIcon,
  SettingsIcon,
} from "lucide-react"

// import { NavDocuments } from "@/components/nav-documents"
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
import Link from "next/link"

const data = {
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        { title: "Active Proposals", url: "#" },
        { title: "Archived", url: "#" },
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onTabChange?: (tab: string) => void;
  setActiveTab: (tab: string) => void;
  tabs: { title: string; icon: React.ElementType }[];
}

export function AppSidebar({ onTabChange, setActiveTab, tabs, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Al Ashraf Holdings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
       <NavMain setActiveTab={setActiveTab} />

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

        {/* <NavDocuments items={data.documents} setActiveTab={setActiveTab} /> */}
        <NavSecondary items={data.navSecondary} setActiveTab={setActiveTab} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser setActiveTab={setActiveTab} />
      </SidebarFooter>
    </Sidebar>
  )
}
