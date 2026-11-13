"use client";

import React from "react";
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
  ChevronDown,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { USER_PROFILE } from "@/lib/mock-data";
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
  { id: "leads", href: "/leads", label: "Leads", icon: Kanban, badge: "9" },
  { id: "network", href: "/network", label: "Network", icon: Network },
  { id: "settings", href: "/settings", label: "Settings", icon: Sliders },
];

const BUSINESS_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", href: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", href: "/clients", label: "Clients", icon: Users, badge: "5" },
  { id: "sales", href: "/sales", label: "Sales", icon: CreditCard },
  { id: "analytics", href: "/analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", href: "/settings", label: "Settings", icon: Sliders },
];

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname();
  const { currentMode } = useWorkspaceMode();

  const navItems = currentMode === "business" ? BUSINESS_NAV_ITEMS : FREELANCER_NAV_ITEMS;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between p-5",
        // Luxury Milled Titanium Obsidian Pillar
        "bg-[#09090c] border-r border-white/[0.06] shadow-[4px_0_30px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {/* Top Branding & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand / Logo */}
        <Link href="/" prefetch={true} className="flex items-center gap-3 px-1 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d41514] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-transform group-hover:scale-105">
            <span className="font-display font-extrabold text-base text-white tracking-tighter">
              S
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              SoloCRM
              <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-white/[0.05] text-[#a1a1aa] font-medium border border-white/[0.08]">
                {currentMode === "business" ? "BIZ" : "SOLO"}
              </span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
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
                  "relative flex items-center justify-between px-3 py-2 rounded-r-lg text-xs font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-white/[0.04] text-white font-semibold border-l-2 border-[#d41514] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]"
                    : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.02] border-l-2 border-transparent"
                )}
              >
                {/* Tab icon & label */}
                <span className="relative z-10 flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-[#d41514]"
                        : "text-[#71717a] group-hover:text-[#e4e4e7]"
                    )}
                  />
                  <span>{item.label}</span>
                </span>

                {/* Badge if present */}
                {item.badge && (
                  <span
                    className={cn(
                      "relative z-10 px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors",
                      isActive
                        ? "bg-[#d41514]/15 text-[#d41514] border border-[#d41514]/30"
                        : "bg-white/[0.04] text-[#a1a1aa] border border-white/[0.07] group-hover:text-white"
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
        <div className="rounded-lg border border-white/[0.07] bg-[#111114] p-3 shadow-sm hover:border-white/[0.12] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative h-8 w-8 flex-shrink-0">
                <img
                  src={USER_PROFILE.avatar}
                  alt={USER_PROFILE.name}
                  className="h-full w-full rounded-md object-cover ring-1 ring-white/10"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#d41514] ring-2 ring-[#09090c]" />
              </div>

              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-white truncate">
                  {USER_PROFILE.name}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] truncate">
                  {currentMode} Mode
                </span>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Terminate session"
                title="Sign Out"
                className="rounded p-1.5 text-[#71717a] hover:bg-[#d41514]/15 hover:text-[#d41514] transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
};
