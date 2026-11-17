"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  ShieldCheck,
  X,
  CheckCheck,
  Inbox,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspaceMode } from "@/lib/workspace-context";

interface HeaderProps {
  onNewAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewAction }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentMode, searchQuery, setSearchQuery, triggerNewAction } =
    useWorkspaceMode();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; title: string; time: string; read: boolean }>
  >([
    {
      id: "notif-1",
      title: "Google OAuth workspace identity synchronized",
      time: "Just now",
      read: false,
    },
    {
      id: "notif-2",
      title: "Client Portal token generated for Veloce AI",
      time: "2h ago",
      read: false,
    },
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K focuses search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close notifications dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    if (isNotificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationsOpen]);

  const handleNewButtonClick = () => {
    if (onNewAction) {
      onNewAction();
      return;
    }

    if (currentMode === "freelancer") {
      if (pathname === "/leads") {
        triggerNewAction();
      } else {
        router.push("/leads?new=true");
      }
    } else {
      if (pathname === "/sales") {
        triggerNewAction();
      } else {
        router.push("/sales?new=true");
      }
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-white/10 bg-white/[0.02] backdrop-blur-2xl print:hidden">
      <div className="flex h-full items-center justify-between px-6 lg:px-8 gap-4">
        {/* Left: Ergonomic Quick Search Pill */}
        <div className="flex flex-1 max-w-md items-center">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A098A8] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentMode === "freelancer"
                  ? "Search leads, retainers, deliverables (⌘K)..."
                  : "Search B2B accounts, sales, invoices (⌘K)..."
              }
              className="w-full rounded-full border border-white/10 bg-white/[0.04] pl-10 pr-16 py-2 text-xs text-[#E2DCE7] placeholder:text-[#A098A8] focus:border-[#E8B4F8] focus:ring-1 focus:ring-[#E8B4F8]/30 focus:outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#A098A8] hover:text-[#E2DCE7] transition-colors"
                title="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            ) : (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-[#A098A8] shadow-sm pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Center: Fixed Architecture Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono tracking-wider shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#E8B4F8] shadow-[0_0_8px_#E8B4F8]" />
          <span className="text-[#E2DCE7] font-medium">
            {currentMode === "business" ? "BUSINESS OS" : "FREELANCE OS"}
          </span>
          <ShieldCheck className="h-3.5 w-3.5 text-[#E8B4F8]" />
        </div>

        {/* Right Controls: Notifications & Precision CTA */}
        <div className="flex items-center gap-3">
          {/* Notification Bell Dropdown Container */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="Notifications"
              title="System Notifications"
              className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                isNotificationsOpen
                  ? "border-[#E8B4F8]/50 bg-white/10 text-[#E8B4F8]"
                  : "border-white/10 bg-white/[0.04] text-[#A098A8] hover:border-white/20 hover:text-white"
              }`}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E8B4F8] ring-2 ring-[#120B18] shadow-[0_0_8px_#E8B4F8]" />
              )}
            </button>

            {/* Frosted Glass Fintech Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#140D1B]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-3.5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#E8B4F8]" />
                      <span className="text-xs font-semibold text-white">System Events</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-[#E8B4F8]/20 px-2 py-0.5 text-[10px] font-mono text-[#E8B4F8] border border-[#E8B4F8]/30">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-mono text-[#A098A8] hover:text-[#E8B4F8] transition-colors flex items-center gap-1"
                      >
                        <CheckCheck className="h-3 w-3" />
                        Mark Read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-white/[0.06]">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition-colors hover:bg-white/[0.04] ${
                            !n.read ? "bg-white/[0.03]" : "opacity-70"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-[#E2DCE7] leading-relaxed">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-[#A098A8] whitespace-nowrap font-mono">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#A098A8]">
                          <Inbox className="h-4 w-4" />
                        </div>
                        <p className="text-xs text-white font-medium">No new notifications</p>
                        <p className="text-[10px] text-[#A098A8] font-mono">
                          System telemetry nominal • Edge gateway active
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 border-t border-white/10 bg-white/[0.02] text-center">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#A098A8]">
                      SoloCRM Enterprise Event Log
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Primary Action Button in Frosted Pink / Purple Gradient Pill */}
          <button
            onClick={handleNewButtonClick}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(178,112,162,0.35),inset_0_1px_0_0_rgba(255,255,255,0.25)] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">
              {currentMode === "freelancer" ? "New Lead" : "New Sale"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
