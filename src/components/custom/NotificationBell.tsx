"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Clock,
  ArrowDownCircle,
  ArrowUpCircle,
  ShieldCheck,
  Coins,
  TrendingUp,
  RefreshCw,
  Info
} from "lucide-react";
import { toast } from "sonner";

export interface NotificationItem {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "deposit" | "withdrawal" | "kyc" | "commission" | "profit" | "resale" | "system";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationBellProps {
  onTabChange?: (tabTitle: string) => void;
}

export function NotificationBell({ onTabChange }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
      } else {
        toast.error("Failed to mark all as read");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error marking all as read");
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    // If not read, mark as read
    if (!notif.isRead) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await fetch(`/api/notifications/${notif._id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNotifications((prev) =>
            prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
          );
        }
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }

    setIsOpen(false);

    // Navigate link if present
    if (notif.link) {
      // If we are on the user workspace page, we might want to change tabs locally
      if (onTabChange && notif.link.includes("/user?tab=")) {
        const urlParams = new URLSearchParams(notif.link.split("?")[1]);
        const tab = urlParams.get("tab");
        if (tab) {
          onTabChange(tab);
          return;
        }
      }
      router.push(notif.link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle className="h-5 w-5 text-emerald-400 text-glow-emerald" />;
      case "withdrawal":
        return <ArrowUpCircle className="h-5 w-5 text-amber-500 text-glow-gold" />;
      case "kyc":
        return <ShieldCheck className="h-5 w-5 text-blue-400" />;
      case "commission":
        return <Coins className="h-5 w-5 text-yellow-400 text-glow-gold" />;
      case "profit":
        return <TrendingUp className="h-5 w-5 text-cyan-400" />;
      case "resale":
        return <RefreshCw className="h-5 w-5 text-violet-400" />;
      default:
        return <Info className="h-5 w-5 text-slate-300" />;
    }
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const elapsed = now.getTime() - past.getTime();

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;

    if (elapsed < msPerMinute) {
      return "Just now";
    } else if (elapsed < msPerHour) {
      const mins = Math.round(elapsed / msPerMinute);
      return `${mins}m ago`;
    } else if (elapsed < msPerDay) {
      const hours = Math.round(elapsed / msPerHour);
      return `${hours}h ago`;
    } else {
      const days = Math.round(elapsed / msPerDay);
      if (days === 1) return "Yesterday";
      return `${days}d ago`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-muted-foreground hover:text-foreground transition-all duration-300 active:scale-95 focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? "animate-[swing_1.5s_ease-in-out_infinite]" : ""}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-extrabold text-white border-2 border-slate-950 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/10 bg-slate-950/95 backdrop-blur-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] text-primary border border-primary/20 font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary hover:text-primary-foreground font-semibold flex items-center gap-1.5 transition-colors focus:outline-none"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-muted-foreground">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Bell className="h-5 w-5 text-muted-foreground/60" />
                </div>
                <p className="text-xs font-semibold text-foreground mb-0.5">No notifications yet</p>
                <p className="text-[10px] text-muted-foreground">{"We'll alert you when critical events happen."}</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left p-4 hover:bg-white/[0.03] transition-colors flex gap-3.5 items-start focus:outline-none ${
                    !notif.isRead ? "bg-white/[0.01]" : ""
                  }`}
                >
                  {/* Icon Indicator */}
                  <div className="h-9 w-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-xs font-bold truncate leading-snug ${!notif.isRead ? "text-foreground" : "text-slate-200"}`}>
                        {notif.title}
                      </p>
                      
                      {/* Unread Indicator Dot */}
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1 shadow shadow-primary animate-pulse" />
                      )}
                    </div>
                    <p className={`text-[11px] leading-relaxed break-words ${!notif.isRead ? "text-muted-foreground font-medium" : "text-muted-foreground/75"}`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground/60 pt-1">
                      <Clock className="h-3 w-3" />
                      <span>{timeAgo(notif.createdAt)}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
