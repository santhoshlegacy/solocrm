"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { REVENUE_DATA, USER_PROFILE } from "@/lib/mock-data";
import { TrendingUp, Clock, CheckCircle2, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

type PeriodType = "weekly" | "monthly" | "quarterly";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomGlassTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-white/[0.1] bg-[#121215] p-3 shadow-2xl">
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#a1a1aa] mb-1.5">
          {label} {data.isMilestone && "• Milestone"}
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#d41514]" />
          <span className="font-display text-sm font-bold text-white tabular-nums">
            ${payload[0].value.toLocaleString()}
          </span>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#71717a] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3f3f46]" />
            <span>Target: ${payload[1].value.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  const [period, setPeriod] = useState<PeriodType>("monthly");
  const data = REVENUE_DATA[period];

  return (
    <GlassCard className="p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.07] text-[#d41514] shadow-sm">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold tracking-tight text-white">
                Revenue Trajectory
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#d41514] border border-[#d41514]/25">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d41514] animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-[#71717a] font-normal">
              Gross billings &amp; retainer collections against quarterly goal
            </p>
          </div>
        </div>

        {/* Period Switcher Capsule */}
        <div className="flex items-center rounded-lg border border-white/[0.07] bg-[#111114] p-1 self-start sm:self-auto shadow-inner">
          {(["weekly", "monthly", "quarterly"] as PeriodType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-all duration-150",
                period === tab
                  ? "bg-[#1a1a20] text-white border border-white/[0.12] shadow-sm font-semibold"
                  : "text-[#71717a] hover:text-[#d4d4d8]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* High-Definition Recharts Area */}
      <div className="h-64 sm:h-72 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            {/* Subtle Gridlines */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="period"
              stroke="#52525b"
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#52525b"
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val / 1000}k`}
              dx={-5}
            />

            <Tooltip content={<CustomGlassTooltip />} />

            {/* Target Projection Line */}
            <Area
              type="monotone"
              dataKey="target"
              stroke="#3f3f46"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              fill="none"
              dot={false}
            />

            {/* Main Laser Crimson Line */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#d41514"
              strokeWidth={2.2}
              fill="none"
              dot={false}
              activeDot={{
                r: 4.5,
                fill: "#d41514",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Telemetry Sub-row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-3 border-t border-white/[0.06]">
        <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.14em]">Average Hourly Rate</span>
            <span className="font-display text-base font-bold text-white tracking-tight tabular-nums">
              {USER_PROFILE.hourlyRate}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.07] text-[#d41514]">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.14em]">Collection Rate</span>
            <span className="font-display text-base font-bold text-white tracking-tight tabular-nums">
              {USER_PROFILE.collectionRate}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.07] text-[#d41514]">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.14em]">Annual Forecast</span>
            <span className="font-display text-base font-bold text-white tracking-tight tabular-nums">
              {USER_PROFILE.annualForecast}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.07] text-[#d41514]">
            <Rocket className="h-4 w-4" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
