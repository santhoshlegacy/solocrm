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
import { TrendingUp, Clock, CheckCircle2, Rocket } from "lucide-react";
import { cn, formatINR } from "@/lib/utils";

type PeriodType = "weekly" | "monthly" | "quarterly";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomGlassTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revVal = Number(payload[0]?.value || 0);
    const targetVal = Number(payload[1]?.value || 0);
    return (
      <div className="rounded-2xl border border-white/15 bg-[#140D1B]/95 backdrop-blur-2xl p-3.5 shadow-2xl">
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] mb-1.5">
          {label}
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#E8B4F8] shadow-[0_0_8px_#E8B4F8]" />
          <span className="font-display text-sm font-bold text-[#E2DCE7] tabular-nums">
            {formatINR(revVal)}
          </span>
        </div>
        {targetVal > 0 && (
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#A098A8] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span>Target: {formatINR(targetVal)}</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface RevenueChartProps {
  sales?: any[];
  leads?: any[];
  mode?: "freelancer" | "business";
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  sales = [],
  leads = [],
  mode = "freelancer",
}) => {
  const [period, setPeriod] = useState<PeriodType>("monthly");

  const getItemAmount = (item: any): number => {
    const raw =
      item.amount ??
      item.budget ??
      item.value ??
      item.rawValue ??
      item.total_billed ??
      0;
    const n =
      typeof raw === "string"
        ? parseFloat(raw.replace(/[^0-9.]/g, ""))
        : Number(raw);
    return Number.isFinite(n) ? n : 0;
  };

  const isWonOrPaid = (item: any): boolean => {
    const st = (item.status || item.invoice_status || "").toLowerCase().trim();
    return st === "paid" || st === "won" || st === "closed won";
  };

  const getItemDate = (item: any): Date => {
    const dStr = item.created_at || item.issue_date || item.date || item.updated_at;
    if (!dStr) return new Date();
    const d = new Date(dStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  // In Freelancer mode, leads are primary; in Business mode, sales are primary.
  const combinedItems: any[] =
    mode === "freelancer"
      ? (leads.length > 0 ? (sales.length > 0 ? [...leads, ...sales] : leads) : sales)
      : (sales.length > 0 ? (leads.length > 0 ? [...sales, ...leads] : sales) : leads);

  const paidOrWonItems = combinedItems.filter(isWonOrPaid);
  const totalBilled = combinedItems.reduce((acc: number, s: any) => acc + getItemAmount(s), 0);
  const totalPaid = paidOrWonItems.reduce((acc: number, s: any) => acc + getItemAmount(s), 0);

  // Dynamic Chart Data mapping
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  const weeklyData = ["W1", "W2", "W3", "W4", "W5", "W6"].map((label, idx) => {
    const start = now - (6 - idx) * weekMs;
    const end = idx === 5 ? now + 24 * 60 * 60 * 1000 : now - (5 - idx) * weekMs;

    const bucketItems = combinedItems.filter((s: any) => {
      const t = getItemDate(s).getTime();
      return t >= start && t < end;
    });

    const bucketWon = bucketItems.filter(isWonOrPaid);
    const wonRev = bucketWon.reduce((sum: number, s: any) => sum + getItemAmount(s), 0);
    const allVolume = bucketItems.reduce((sum: number, s: any) => sum + getItemAmount(s), 0);

    const rev = wonRev > 0 ? wonRev : (mode === "freelancer" && allVolume > 0 ? allVolume : 0);
    const target = allVolume > 0 ? Math.max(Math.round(rev * 1.15), allVolume) : (rev > 0 ? Math.round(rev * 1.1) : 0);

    return {
      period: label,
      revenue: rev,
      target,
    };
  });

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyData = months.map((m, idx) => {
    const bucketItems = combinedItems.filter((s: any) => {
      return getItemDate(s).getMonth() === idx;
    });

    const bucketWon = bucketItems.filter(isWonOrPaid);
    const wonRev = bucketWon.reduce((sum: number, s: any) => sum + getItemAmount(s), 0);
    const allVolume = bucketItems.reduce((sum: number, s: any) => sum + getItemAmount(s), 0);

    const rev = wonRev > 0 ? wonRev : (mode === "freelancer" && allVolume > 0 ? allVolume : 0);
    const target = allVolume > 0 ? Math.max(Math.round(rev * 1.15), allVolume) : (rev > 0 ? Math.round(rev * 1.15) : 0);

    return {
      period: m,
      revenue: rev,
      target,
    };
  });

  const quarterlyData = ["Q1", "Q2", "Q3", "Q4"].map((q, idx) => {
    const qMonths = [idx * 3, idx * 3 + 1, idx * 3 + 2];
    const bucketItems = combinedItems.filter((s: any) => {
      return qMonths.includes(getItemDate(s).getMonth());
    });

    const bucketWon = bucketItems.filter(isWonOrPaid);
    const wonRev = bucketWon.reduce((sum: number, s: any) => sum + getItemAmount(s), 0);
    const allVolume = bucketItems.reduce((sum: number, s: any) => sum + getItemAmount(s), 0);

    const rev = wonRev > 0 ? wonRev : (mode === "freelancer" && allVolume > 0 ? allVolume : 0);
    const target = allVolume > 0 ? Math.max(Math.round(rev * 1.2), allVolume) : (rev > 0 ? Math.round(rev * 1.2) : 0);

    return {
      period: q,
      revenue: rev,
      target,
    };
  });

  const chartData =
    period === "weekly" ? weeklyData : period === "quarterly" ? quarterlyData : monthlyData;

  const maxVal = Math.max(0, ...chartData.map((d) => Math.max(d.revenue || 0, d.target || 0)));
  const yDomain: [number, number | string] = !Number.isFinite(maxVal) || maxVal <= 0 ? [0, 50000] : [0, "auto"];

  // Beneath-Chart Live Metric Calculations with Math safety & NaN protection
  const effectiveBase = totalPaid > 0 ? totalPaid : (mode === "freelancer" ? totalBilled : 0);
  const activeCount = Math.max(1, combinedItems.length);

  const rawHourlyRate =
    effectiveBase > 0 ? effectiveBase / Math.max(160, activeCount * 40) : 0;
  const hourlyRate = Number.isFinite(rawHourlyRate) ? Math.round(rawHourlyRate) : 0;

  const rawCollectionRate =
    totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;
  const collectionRate = Number.isFinite(rawCollectionRate) ? Math.round(rawCollectionRate) : 0;

  const currentMonthIdx = Math.max(1, new Date().getMonth() + 1);
  const rawAnnualForecast =
    effectiveBase > 0 ? (effectiveBase / currentMonthIdx) * 12 : 0;
  const annualForecast = Number.isFinite(rawAnnualForecast) ? Math.round(rawAnnualForecast) : 0;

  return (
    <GlassCard className="p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] shadow-sm">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base font-bold tracking-tight text-[#E2DCE7]">
                Revenue Trajectory
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-[#E8B4F8] border border-[#E8B4F8]/30 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-[#A098A8] font-normal">
              {mode === "freelancer"
                ? "Freelance contract pipeline, deal yields & verified cash inflows"
                : "Gross billings & retainer collections against quarterly goal"}
            </p>
          </div>
        </div>

        {/* Period Switcher Pill Capsule */}
        <div className="flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1 self-start sm:self-auto shadow-inner">
          {(["weekly", "monthly", "quarterly"] as PeriodType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              className={cn(
                "rounded-full px-3.5 py-1 text-xs font-medium capitalize transition-all duration-150 cursor-pointer",
                period === tab
                  ? "bg-white/10 text-white border border-white/10 shadow-sm font-semibold"
                  : "text-[#A098A8] hover:text-[#E2DCE7]"
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
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueTrajectoryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8B4F8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#E8B4F8" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Subtle Gridlines */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="period"
              stroke="#888191"
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#888191"
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
              axisLine={false}
              domain={yDomain}
              tickFormatter={(val) => {
                const n = Number(val);
                if (!Number.isFinite(n)) return "₹0";
                return `₹${n >= 1000 ? `${Math.round(n / 1000)}k` : n}`;
              }}
              dx={-5}
            />

            <Tooltip content={<CustomGlassTooltip />} />

            {/* Target Projection Line */}
            <Area
              type="monotone"
              dataKey="target"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              fill="none"
              dot={false}
            />

            {/* Main Frosted Pink Fintech Line with Vertical Gradient Glow */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#E8B4F8"
              strokeWidth={2.5}
              fill="url(#revenueTrajectoryGrad)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#E8B4F8",
                stroke: "#120B18",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Telemetry Sub-row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-3 border-t border-white/10">
        <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-white/20 transition-all">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#A098A8] uppercase tracking-[0.14em]">
              {mode === "freelancer" ? "Hourly Contract Yield" : "Average Hourly Rate"}
            </span>
            <span className="font-display text-base font-bold text-[#E2DCE7] tracking-tight tabular-nums">
              {hourlyRate > 0 ? `${formatINR(hourlyRate)}/hr` : "₹0/hr"}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8]">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-white/20 transition-all">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#A098A8] uppercase tracking-[0.14em]">
              {mode === "freelancer" ? "Deal Conversion Ratio" : "Collection Rate"}
            </span>
            <span className="font-display text-base font-bold text-[#E2DCE7] tracking-tight tabular-nums">
              {collectionRate}%
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8]">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-white/20 transition-all">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[#A098A8] uppercase tracking-[0.14em]">
              Annual Forecast
            </span>
            <span className="font-display text-base font-bold text-[#E2DCE7] tracking-tight tabular-nums">
              {annualForecast > 0 ? formatINR(annualForecast) : "₹0"}
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8]">
            <Rocket className="h-4 w-4" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default RevenueChart;
