"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DEADLINES } from "@/lib/mock-data";
import { CheckSquare, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const ActiveDeadlines: React.FC = () => {
  const getProgressColor = (variant: "primary" | "secondary" | "dim") => {
    switch (variant) {
      case "primary":
        return "bg-[#d41514]";
      case "secondary":
        return "bg-[#d41514]/70";
      case "dim":
        return "bg-[#333]";
      default:
        return "bg-[#d41514]";
    }
  };

  return (
    <GlassCard className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-[#d41514]" />
          <h3 className="font-display text-base font-bold text-white tracking-tight">
            Active Deadlines
          </h3>
        </div>
        <span className="rounded-md bg-[#d41514]/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#e03837] border border-[#d41514]/25">
          3 This Week
        </span>
      </div>

      {/* Deadline Items */}
      <div className="flex flex-col gap-2.5">
        {DEADLINES.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white truncate">
                {item.title}
              </span>
              <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-[#a1a1aa] border border-white/[0.08]">
                {item.dueDate}
              </span>
            </div>

            <p className="text-[11px] text-[#71717a] font-normal truncate">
              {item.description}
            </p>

            {/* Progress Bar & Percentage */}
            <div className="mt-1 flex items-center gap-2.5">
              <div className="h-1.5 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", getProgressColor(item.colorVariant))}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#a1a1aa] tabular-nums">
                {item.progress}%
              </span>
            </div>
          </div>
        ))}

        {/* Monthly Goal Progress summary card */}
        <div className="flex items-center justify-between p-3.5 mt-1 rounded-lg border border-white/[0.07] bg-[#111114]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.07] text-[#d41514]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">Monthly Goal Progress</span>
              <span className="text-[11px] text-[#71717a] font-mono">$18.2k / $20k goal</span>
            </div>
          </div>
          <span className="font-mono font-bold text-sm text-[#d41514] tabular-nums">
            91%
          </span>
        </div>
      </div>
    </GlassCard>
  );
};
