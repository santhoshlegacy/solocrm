"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Network,
  Users,
  CreditCard,
  BarChart3,
  Sliders,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { createClient } from "@/utils/supabase/client";
import { useWorkspaceMode } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const FREELANCER_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", href: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", href: "/leads", label: "Leads", icon: Kanban },
  { id: "network", href: "/network", label: "Network", icon: Network },
  { id: "settings", href: "/settings", label: "Settings", icon: Sliders },
];

const BUSINESS_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", href: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", href: "/clients", label: "Clients", icon: Users },
  { id: "sales", href: "/sales", label: "Sales", icon: CreditCard },
  { id: "analytics", href: "/analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", href: "/settings", label: "Settings", icon: Sliders },
];

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const { currentMode } = useWorkspaceMode();
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [clientCount, setClientCount] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    initials: string;
    avatar?: string;
  }>({
    name: "Operator",
    email: "",
    initials: "OP",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Operator";
          const email = user.email || "";
          const avatar =
            user.user_metadata?.avatar_url || user.user_metadata?.picture;
          const initials =
            fullName
              .split(" ")
              .map((n: string) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "OP";

          setUserProfile({
            name: fullName,
            email,
            initials,
            avatar,
          });
        }

        // Live Supabase counts for navigation badges
        const { count: lCount } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true });
        if (typeof lCount === "number") setLeadCount(lCount);

        const { count: cCount } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true });
        if (typeof cCount === "number") setClientCount(cCount);
      } catch (err) {
        console.error("Sidebar user fetch error:", err);
      }
    };
    fetchUser();
  }, []);

  const baseNavItems = currentMode === "business" ? BUSINESS_NAV_ITEMS : FREELANCER_NAV_ITEMS;
  const navItems = baseNavItems.map((item) => {
    if (item.id === "leads" && leadCount !== null && leadCount > 0) {
      return { ...item, badge: String(leadCount) };
    }
    if (item.id === "clients" && clientCount !== null && clientCount > 0) {
      return { ...item, badge: String(clientCount) };
    }
    return item;
  });

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between p-5 print:hidden",
        // Premium Frosted Glass Fintech Sidebar
        "bg-white/[0.03] backdrop-blur-2xl border-r border-white/10 shadow-[4px_0_30px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {/* Top Branding & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand / Logo */}
        <Link href="/" prefetch={true} className="flex items-center gap-3 px-1 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#B270A2] to-[#7A5A97] shadow-[0_0_20px_rgba(232,180,248,0.35)] border border-white/20 transition-transform group-hover:scale-105">
            <span className="font-display font-extrabold text-lg text-white tracking-tighter">
              S
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-[#E2DCE7] flex items-center gap-1.5">
              SoloCRM
              <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[#E8B4F8] font-medium border border-white/10">
                {currentMode === "business" ? "BIZ" : "SOLO"}
              </span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              {currentMode === "business" ? "Enterprise Workspace" : "Freelance Operator OS"}
            </span>
          </div>
        </Link>

        {/* Dynamic Navigation */}
        <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                className={cn(
                  "relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-white/10 text-[#E8B4F8] font-semibold border border-white/10 shadow-[0_4px_20px_rgba(178,112,162,0.15)]"
                    : "text-[#A098A8] hover:text-[#E2DCE7] hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {/* Tab icon & label */}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-[#E8B4F8]"
                        : "text-[#A098A8] group-hover:text-[#E2DCE7]"
                    )}
                  />
                  <span>{item.label}</span>
                </span>

                {/* Badge if present */}
                {item.badge && (
                  <span
                    className={cn(
                      "relative z-10 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium transition-colors",
                      isActive
                        ? "bg-[#E8B4F8]/20 text-[#E8B4F8] border border-[#E8B4F8]/30"
                        : "bg-white/[0.05] text-[#A098A8] border border-white/10 group-hover:text-white"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Card */}
      <div className="flex flex-col gap-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-3 shadow-sm hover:border-white/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative h-9 w-9 flex-shrink-0">
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="h-full w-full rounded-xl object-cover ring-1 ring-white/15"
                  />
                ) : (
                  <div className="h-full w-full rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center font-mono text-[11px] font-bold text-[#E8B4F8]">
                    {userProfile.initials}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#E8B4F8] ring-2 ring-[#120B18] shadow-[0_0_8px_#E8B4F8]" />
              </div>

              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-[#E2DCE7] truncate">
                  {userProfile.name}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A098A8] truncate">
                  {currentMode === "business" ? "Business OS" : "Freelance OS"}
                </span>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Terminate session"
                title="Sign Out"
                className="rounded-lg p-2 text-[#A098A8] hover:bg-[#E8B4F8]/15 hover:text-[#E8B4F8] transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
};
