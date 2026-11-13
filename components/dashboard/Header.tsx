"use client";

import React from "react";
import { Search, Bell, Plus, Briefcase, Building2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useWorkspaceMode } from "@/lib/workspace-context";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onNewAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewAction }) => {
  const { currentMode, setCurrentMode, isPending } = useWorkspaceMode();

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-white/[0.06] bg-[#08080a]/85 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-6 lg:px-8 gap-4">
        {/* Left: Ergonomic Quick Search */}
        <div className="flex flex-1 max-w-md items-center">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a] pointer-events-none" />
            <input
              type="text"
              placeholder={
                currentMode === "freelancer"
                  ? "Search leads, retainers, deliverables (⌘K)..."
                  : "Search B2B accounts, sales, invoices (⌘K)..."
              }
              className="w-full rounded-lg border border-white/[0.07] bg-[#111114] pl-9 pr-12 py-1.5 text-xs text-white placeholder:text-[#71717a] focus:border-[#d41514] focus:ring-1 focus:ring-[#d41514]/30 focus:outline-none transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/[0.09] bg-[#18181d] px-1.5 py-0.5 text-[10px] font-mono text-[#a1a1aa] shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Center: Dual-Mode Segmented Capsule */}
        <div className="flex items-center">
          <div className="relative flex items-center p-1 rounded-lg bg-[#111114] border border-white/[0.07]">
            <button
              type="button"
              onClick={() => setCurrentMode("freelancer")}
              className={cn(
                "relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150",
                currentMode === "freelancer"
                  ? "text-white font-medium"
                  : "text-[#71717a] hover:text-[#d4d4d8]"
              )}
            >
              {currentMode === "freelancer" && (
                <motion.div
                  layoutId="workspace-mode-pill"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 30,
                  }}
                  className="absolute inset-0 rounded-md bg-[#1a1a20] border border-white/[0.12] shadow-sm"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-[#d41514]" />
                <span>Freelancer</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentMode("business")}
              className={cn(
                "relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150",
                currentMode === "business"
                  ? "text-white font-medium"
                  : "text-[#71717a] hover:text-[#d4d4d8]"
              )}
            >
              {currentMode === "business" && (
                <motion.div
                  layoutId="workspace-mode-pill"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 30,
                  }}
                  className="absolute inset-0 rounded-md bg-[#1a1a20] border border-white/[0.12] shadow-sm"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-[#d41514]" />
                <span>Business</span>
              </span>
            </button>

            {isPending && (
              <span className="absolute -right-5 top-1/2 -translate-y-1/2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#d41514]" />
              </span>
            )}
          </div>
        </div>

        {/* Right Controls: Notifications & Precision CTA */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-[#111114] text-[#a1a1aa] hover:border-white/[0.14] hover:text-white transition-all"
          >
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#d41514]" />
          </button>

          {/* Primary Action Button in Laser Crimson */}
          <button
            onClick={onNewAction}
            className="flex items-center gap-1.5 rounded-lg bg-[#d41514] hover:bg-[#bd1211] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_2px_8px_-1px_rgba(212,21,20,0.45)] active:scale-95 transition-all"
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
