"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard,
  ShieldAlert
} from "lucide-react";

interface SidebarTab {
  title: string;
  icon: React.ElementType;
  permission?: string;
}

interface CustomSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: SidebarTab[];
  isAdminView?: boolean;
}

export function CustomSidebar({ activeTab, setActiveTab, tabs, isAdminView = false }: CustomSidebarProps) {
  const { user, logout } = useAuth();
  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.isAdmin || user.role === "admin" || user.role === "Super Admin") return true;
    return user.customPermissions?.includes(permission) || false;
  };
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!user) return null;

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const renderTabList = () => {
    if (isAdminView) {
      return (
        <div className="space-y-1.5">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider px-4 text-glow-gold">
              Admin Panel
            </span>
          )}
          <div className="space-y-1">
            {tabs.map(renderTabButton)}
          </div>
        </div>
      );
    }

    const adminTabTitles = [
      "Assign Roles",
      "Equity Packages",
      "KYC Requests",
      "Withdrawal Requests",
      "Role Management",
      "Permission Management",
      "Admin Profit",
      "Deposit Requests"
    ];

    const userTabs = tabs.filter(tab => !adminTabTitles.includes(tab.title));
    const adminTabs = tabs.filter(tab => adminTabTitles.includes(tab.title));

    return (
      <>
        {/* User Workspace Section */}
        <div className="space-y-1.5">
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4">
              Workspace
            </span>
          )}
          <div className="space-y-1">
            {userTabs.map(renderTabButton)}
          </div>
        </div>

        {/* Admin Console Section (only if admin tabs exist in standard view) */}
        {adminTabs.length > 0 && (
          <div className="space-y-1.5">
            {!isCollapsed && (
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider px-4 text-glow-gold">
                Admin Panel
              </span>
            )}
            <div className="space-y-1">
              {adminTabs.map(renderTabButton)}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderTabButton = (tab: SidebarTab) => {
    const Icon = tab.icon;
    const isActive = activeTab === tab.title;

    return (
      <button
        key={tab.title}
        onClick={() => {
          setActiveTab(tab.title);
          setIsMobileOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-primary/20 to-primary/5 text-primary border border-primary/20 border-glow-emerald"
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
        }`}
        title={tab.title}
      >
        <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary text-glow-emerald" : ""}`} />
        {!isCollapsed && <span className="truncate">{tab.title}</span>}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-3 left-4 z-[60] p-2 rounded-xl glass-panel text-foreground border border-white/10"
        aria-label="Toggle Sidebar"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          onClick={toggleMobileSidebar}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Main Sidebar Wrapper */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out flex flex-col border-r border-white/5 glass-panel ${
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* Header Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
                <span className="font-bold text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {isAdminView ? "Al Ashraf Admin" : "Al Ashraf"}
                </span>
            )}
          </Link>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex h-7 w-7 rounded-lg items-center justify-center hover:bg-white/5 border border-white/5 text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Quick Deposit button */}
        {!isAdminView && (
          <div className="p-4 border-b border-white/5">
            <button
              onClick={() => setActiveTab("Deposit")}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 ${
                isCollapsed ? "px-2" : ""
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-white" />
              {!isCollapsed && <span className="text-white">Quick Deposit</span>}
            </button>
          </div>
        )}

        {/* Tabs / Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {renderTabList()}
        </div>

        {/* Footer / User Profile Section */}
        <div className="p-4 border-t border-white/5 relative">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 w-full text-left focus:outline-none"
            >
              <div className="relative h-9 w-9 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5 flex items-center justify-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                )}
                {/* KYC status dot */}
                <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 ${
                  user.kyc?.status === "approved" ? "bg-emerald-500" :
                  user.kyc?.status === "pending" ? "bg-amber-500" : "bg-red-500"
                }`} />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate leading-none mb-1">
                    {user.fullName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate leading-none">
                    {user.email}
                  </p>
                </div>
              )}
            </button>
          </div>

          {/* User Options Dropdown Popover */}
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className={`absolute z-50 bottom-16 left-4 right-4 p-2 rounded-2xl border border-white/10 glass-panel shadow-2xl space-y-1 ${
                isCollapsed ? "w-48 left-16" : ""
              }`}>
                {hasPermission("view_account") && (
                  <button
                    onClick={() => {
                      setActiveTab("Account");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-300"
                  >
                    <UserIcon className="h-4 w-4" />
                    My Profile
                  </button>
                )}
                {isAdminView ? (
                  <Link
                    href="/user"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-accent hover:bg-white/5 hover:text-foreground transition-all duration-300"
                  >
                    <LayoutDashboard className="h-4 w-4 text-accent text-glow-gold" />
                    User Workspace
                  </Link>
                ) : (
                  (user.isAdmin || user.role === "admin" || user.role === "Super Admin" || user.customPermissions?.includes("access_admin_dashboard")) && (
                    <>
                      <Link
                        href="/admin"
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-accent hover:bg-white/5 hover:text-foreground transition-all duration-300"
                      >
                        <LayoutDashboard className="h-4 w-4 text-accent text-glow-gold" />
                        Admin Panel
                      </Link>
                      {user.role === "Super Admin" && (
                        <Link
                          href="/super-admin"
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-yellow-400 hover:bg-white/5 hover:text-foreground transition-all duration-300"
                        >
                          <ShieldAlert className="h-4 w-4 text-yellow-400" />
                          Audit Panel
                        </Link>
                      )}
                    </>
                  )
                )}
                <div className="h-px bg-white/5 my-1" />
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
