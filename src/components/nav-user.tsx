"use client";

import {
  BellIcon,
  // CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "@/components/ui/badge";

// import { useReactTable } from "@tanstack/react-table"

// import { useEffect, useState } from "react"

// interface User {
//   email: string
//   balance: number
// }

interface NavUserProps {
  setActiveTab: (tab: string) => void;
}

export function NavUser({ setActiveTab }: NavUserProps) {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.profilePicture} alt={user.fullName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.fullName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.profilePicture} alt={user.fullName} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex">
                    <span className="truncate font-medium">
                      {user.fullName}
                    </span>
                    <span className="font-[10px]">
                      {user.kyc?.status === "pending" && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-200 text-yellow-800 text-[10px] pl-[5px] pr-[6px]"
                        >
                          Pending
                        </Badge>
                      )}

                      {user.kyc?.status === "approved" && (
                        <Badge
                          variant="secondary"
                          className="bg-green-200 text-green-800 text-[10px] pl-[5px] pr-[6px]"
                        >
                          Approved
                        </Badge>
                      )}

                      {user.kyc?.status === "rejected" && (
                        <Badge
                          variant="secondary"
                          className="bg-red-200 text-red-800 text-[10px] pl-[5px] pr-[6px]"
                        >
                          KYC Rejected
                        </Badge>
                      )}

                      {user.kyc?.status === "unverified" && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-200 text-gray-800 text-[10px] pl-[5px] pr-[6px]"
                        >
                          unverified
                        </Badge>
                      )}
                    </span>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setActiveTab("Account")}>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
