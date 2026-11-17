"use client";

import React from "react";
import { GlassCard, cardEntranceVariants } from "./GlassCard";
import { StatCardData } from "@/lib/mock-data";
import {
  Wallet,
  RefreshCw,
  Users,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";

interface StatBlockProps {
  data: StatCardData;
  index?: number;
}

export const StatBlock: React.FC<StatBlockProps> = ({ data, index = 0 }) => {
  const renderIcon = () => {
    switch (data.iconName) {
      case "Wallet":
        return <Wallet className="h-4 w-4 text-[#E8B4F8]" />;
      case "RefreshCw":
        return <RefreshCw className="h-4 w-4 text-[#E8B4F8]" />;
      case "Users":
        return <Users className="h-4 w-4 text-[#E8B4F8]" />;
      case "Clock":
        return <Clock className="h-4 w-4 text-[#E8B4F8]" />;
      default:
        return <Sparkles className="h-4 w-4 text-[#E8B4F8]" />;
    }
  };

  return (
    <GlassCard
      interactive
      className="p-5"
      variants={cardEntranceVariants}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
          {data.title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] shadow-sm">
          {renderIcon()}
        </div>
      </div>

      {/* Metric Value & Change Pill */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-[#E2DCE7] tabular-nums">
          {data.value}
        </span>

        {data.change && (
          <div className="flex items-center gap-1 rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30">
            <TrendingUp className="h-3 w-3" />
            <span>{data.change}</span>
          </div>
        )}

        {data.badge && (
          <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-mono text-[#A098A8] border border-white/10">
            {data.badge}
          </span>
        )}
      </div>

      {/* Bottom Sub-row with Sparkline or Avatars */}
      <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-[#A098A8] font-normal">{data.subtitle}</span>

        {/* Precision Frosted Pink Sparkline with Terminal Beacon */}
        {data.sparkline && (
          <div className="h-6 w-24">
            <svg
              className="h-full w-full overflow-visible"
              fill="none"
              viewBox="0 0 100 28"
              preserveAspectRatio="none"
            >
              {/* Subtle baseline track */}
              <line
                x1="0"
                y1="25"
                x2="100"
                y2="25"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <path
                d="M0,22 C15,18 25,24 40,12 C55,2 70,16 85,6 C92,2 98,5 100,2"
                stroke="#E8B4F8"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Endpoint beacon dot */}
              <circle cx="100" cy="2" r="3" fill="#E8B4F8" />
            </svg>
          </div>
        )}

        {/* Avatars Stack for Retainers */}
        {data.avatars && (
          <div className="flex -space-x-1.5">
            {data.avatars.map((av, i) => (
              <div
                key={i}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-mono font-medium ring-2 ring-[#120B18] bg-white/[0.06] text-[#E8B4F8] border border-white/10"
              >
                {av.initials}
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
