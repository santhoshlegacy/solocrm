"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ACTIVITIES, ActivityItem } from "@/lib/mock-data";
import {
  History,
  ArrowRight,
  Receipt,
  FileCheck,
  CloudUpload,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const RecentActivity: React.FC = () => {
  const getIcon = (type: ActivityItem["iconType"]) => {
    switch (type) {
      case "payment":
        return <Receipt className="h-5 w-5 text-[#d41514]" />;
      case "contract":
        return <FileCheck className="h-5 w-5 text-[#d41514]" />;
      case "upload":
        return <CloudUpload className="h-5 w-5 text-[#cdcbca]/60" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-amber-400" />;
      default:
        return <Receipt className="h-5 w-5 text-[#cdcbca]/60" />;
    }
  };

  const getBadgeStyle = (variant: ActivityItem["statusBadge"]["variant"]) => {
    switch (variant) {
      case "paid":
        return "bg-[#d41514]/10 text-[#e03837] border border-[#d41514]/25 rounded-md";
      case "contract":
        return "bg-white/[0.04] text-[#a1a1aa] border border-white/[0.08] rounded-md";
      case "delivered":
        return "bg-[#d41514]/15 text-[#e03837] border border-[#d41514]/30 rounded-md";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md";
      default:
        return "bg-white/[0.04] text-[#a1a1aa] border border-white/[0.08] rounded-md";
    }
  };

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.07] text-[#d41514] shadow-sm">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-white">
              Recent Activity &amp; Milestones
            </h3>
            <p className="text-xs text-[#71717a] font-normal">
              Latest invoices, deliverables, and verified signatures
            </p>
          </div>
        </div>

        <button className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#d41514] hover:text-[#e03837] transition-colors group">
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-2.5">
        {ACTIVITIES.map((act) => (
          <div
            key={act.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] transition-all gap-3 shadow-sm"
          >
            {/* Left section: icon + title + description */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.07] flex-shrink-0">
                {getIcon(act.iconType)}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-white truncate">
                    {act.title}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide",
                      getBadgeStyle(act.statusBadge.variant)
                    )}
                  >
                    {act.statusBadge.variant === "paid" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d41514]" />
                    )}
                    {act.statusBadge.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#71717a] font-normal mt-0.5">
                  <span className="truncate">{act.client}</span>
                  <span>•</span>
                  <span className="truncate">{act.description}</span>
                </div>
              </div>
            </div>

            {/* Right section: amount + time */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
              {act.amount && (
                <span className="font-display text-sm font-bold text-white tabular-nums">
                  {act.amount}
                </span>
              )}
              <span className="text-[11px] font-mono text-[#71717a]">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
