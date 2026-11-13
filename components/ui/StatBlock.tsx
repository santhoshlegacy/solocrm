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
        return <Wallet className="h-4 w-4 text-[#d41514]" />;
      case "RefreshCw":
        return <RefreshCw className="h-4 w-4 text-[#d41514]" />;
      case "Users":
        return <Users className="h-4 w-4 text-[#d41514]" />;
      case "Clock":
        return <Clock className="h-4 w-4 text-[#d41514]" />;
      default:
        return <Sparkles className="h-4 w-4 text-[#d41514]" />;
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
        <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
          {data.title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.07] text-[#d41514] shadow-sm">
          {renderIcon()}
        </div>
      </div>

      {/* Metric Value & Change Pill */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white tabular-nums">
          {data.value}
        </span>

        {data.change && (
          <div className="flex items-center gap-1 rounded-md bg-[#d41514]/10 px-2 py-0.5 text-[11px] font-mono font-medium text-[#e03837] border border-[#d41514]/25">
            <TrendingUp className="h-3 w-3" />
            <span>{data.change}</span>
          </div>
        )}

        {data.badge && (
          <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] font-mono text-[#a1a1aa] border border-white/[0.08]">
            {data.badge}
          </span>
        )}
      </div>

      {/* Bottom Sub-row with Sparkline or Avatars */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-xs text-[#71717a] font-normal">{data.subtitle}</span>

        {/* Precision Laser Crimson Sparkline with Terminal Beacon */}
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
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
              <path
                d="M0,22 C15,18 25,24 40,12 C55,2 70,16 85,6 C92,2 98,5 100,2"
                stroke="#d41514"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Endpoint beacon dot */}
              <circle cx="100" cy="2" r="2.5" fill="#d41514" />
            </svg>
          </div>
        )}

        {/* Avatars Stack for Retainers */}
        {data.avatars && (
          <div className="flex -space-x-1.5">
            {data.avatars.map((av, i) => (
              <div
                key={i}
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-mono font-medium ring-2 ring-[#0e0e11] bg-[#1a1a20] text-white border border-white/10"
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
