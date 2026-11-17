"use client";

import React, { useState } from "react";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import InsightsBarChart from "@/components/dashboard/InsightsBarChartLazy";
import {
  TrendingUp,
  Bolt,
  PieChart,
  Download,
  Calendar,
  Receipt,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const CLIENT_DISTRIBUTION = [
  { client: "Apex Labs", share: 38, amount: "$56.4k", barColor: "bg-[#E8B4F8]" },
  { client: "Hyperion Cloud", share: 24, amount: "$35.6k", barColor: "bg-[#E8B4F8]/80" },
  { client: "Nexus Protocol", share: 18, amount: "$26.7k", barColor: "bg-[#E8B4F8]/60" },
  { client: "CyberDynamics", share: 12, amount: "$17.8k", barColor: "bg-white/40" },
  { client: "StudioMono & Others", share: 8, amount: "$12.1k", barColor: "bg-white/20" },
];

export default function InsightsPage() {
  const [range, setRange] = useState<"ytd" | "12m" | "custom">("12m");

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-2"
    >
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E8B4F8]/15 px-3 py-1 text-[11px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] animate-pulse" />
              Financial Telemetry
            </span>
            <span className="text-[#A098A8] text-xs font-normal">• Q4 Audit Cycle Active</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white mt-0.5">
            Financial Insights &amp; Analytics
          </h1>
          <p className="text-xs text-[#A098A8] max-w-2xl font-normal">
            Detailed breakdown of freelance revenue, project margins, and business expenses. Calibrated for maximum solo operator runway.
          </p>
        </div>

        {/* Range Selector & Report Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/10 p-1 rounded-full">
            <button
              onClick={() => setRange("ytd")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                range === "ytd"
                  ? "bg-white/10 text-[#E8B4F8] border border-white/15 font-semibold"
                  : "text-[#A098A8] hover:text-white"
              }`}
            >
              YTD
            </button>
            <button
              onClick={() => setRange("12m")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                range === "12m"
                  ? "bg-white/10 text-[#E8B4F8] border border-white/15 font-semibold"
                  : "text-[#A098A8] hover:text-white"
              }`}
            >
              Last 12 Months
            </button>
            <button
              onClick={() => setRange("custom")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                range === "custom"
                  ? "bg-white/10 text-[#E8B4F8] border border-white/15 font-semibold"
                  : "text-[#A098A8] hover:text-white"
              }`}
            >
              Custom
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-[#E2DCE7] hover:text-white text-xs font-mono transition-all cursor-pointer">
            <Download className="h-3.5 w-3.5 text-[#E8B4F8]" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 High-Impact KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <GlassCard className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
              Annual Gross Revenue
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8]">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              $148,600
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono">
            <span className="text-[#E8B4F8] font-medium flex items-center">
              +28.4%
            </span>
            <span className="text-[#A098A8] text-[11px] font-normal">vs previous 12 mo ($115.7k)</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full w-[82%]" />
          </div>
        </GlassCard>

        {/* KPI 2 */}
        <GlassCard className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
              Effective Hourly Rate
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8]">
              <Bolt className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              $165
            </span>
            <span className="text-xs text-[#A098A8] font-mono">/hr</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono">
            <span className="text-[#E8B4F8] font-medium">+$25/hr</span>
            <span className="text-[#A098A8] text-[11px] font-normal">calibrated to 900 billable hrs</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full w-[74%]" />
          </div>
        </GlassCard>

        {/* KPI 3 */}
        <GlassCard className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
              Total Profit Margin
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8]">
              <PieChart className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              84.2%
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono">
            <span className="text-[#E8B4F8] font-medium">Lean Stack</span>
            <span className="text-[#A098A8] text-[11px] font-normal">$23.5k OPEX overhead</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full w-[84.2%]" />
          </div>
        </GlassCard>

        {/* KPI 4 */}
        <GlassCard className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
              Avg Time to Payment
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8]">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              4.8
            </span>
            <span className="text-xs text-[#A098A8] font-mono">Days</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono">
            <span className="text-[#E8B4F8] font-medium">-2.1 Days</span>
            <span className="text-[#A098A8] text-[11px] font-normal">Stripe Auto-debit</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full w-[92%]" />
          </div>
        </GlassCard>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 12-Month Revenue & Cash Flow Trend (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GlassCard className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 text-[#E8B4F8]">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight">
                    12-Month Revenue &amp; Cash Flow Trend
                  </h2>
                  <p className="text-xs text-[#A098A8] font-normal">
                    Gross monthly revenue compared against operational expenses
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-white font-mono font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#E8B4F8]" />
                  Revenue
                </span>
                <span className="flex items-center gap-1.5 text-[#A098A8] font-mono font-normal">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  Expenses
                </span>
              </div>
            </div>

            {/* Glowing Recharts Bar Chart (Lazy Loaded) */}
            <InsightsBarChart />
          </GlassCard>

          {/* Tax Reserve & OPEX Breakdown Summary */}
          <GlassCard className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#E8B4F8]" />
                <h3 className="font-display text-base font-semibold text-white tracking-tight">
                  Tax Reserves &amp; Runway Protection
                </h3>
              </div>
              <span className="rounded-full bg-[#E8B4F8]/15 px-3 py-1 text-xs font-medium text-[#E8B4F8] border border-[#E8B4F8]/30">
                Quarterly FDIC Protected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-[11px] text-[#A098A8] block font-normal">Tax Reserve (30%)</span>
                <span className="font-display text-lg font-medium text-white tabular-nums">$44,580</span>
                <span className="text-[10px] text-[#E8B4F8] font-medium mt-1 block">Held in High-Yield Treasury</span>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-[11px] text-[#A098A8] block font-normal">Monthly Software &amp; AI</span>
                <span className="font-display text-lg font-medium text-white tabular-nums">$450/mo</span>
                <span className="text-[10px] text-[#A098A8]/60 mt-1 block font-normal">Figma, GitHub, Anthropic</span>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className="text-[11px] text-[#A098A8] block font-normal">Estimated Net Take-Home</span>
                <span className="font-display text-lg font-medium text-[#E8B4F8] tabular-nums">$80,520</span>
                <span className="text-[10px] text-[#A098A8]/60 mt-1 block font-normal">After Taxes &amp; OPEX</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Client Revenue Distribution (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#E8B4F8]" />
                <h3 className="font-display text-base font-semibold text-white tracking-tight">
                  Client Concentration
                </h3>
              </div>
              <span className="text-[11px] text-[#A098A8] font-normal">5 Key Accounts</span>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              {CLIENT_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#E2DCE7] font-normal truncate">{item.client}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#A098A8] text-[11px]">{item.amount}</span>
                      <span className="font-medium text-white">{item.share}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.barColor} shadow-sm`}
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A098A8] font-normal">
              <span>Target: &lt; 40% single client</span>
              <span className="text-[#E8B4F8] font-medium">Healthy (38% max)</span>
            </div>
          </GlassCard>

          {/* Quick Reports Download Tiles */}
          <GlassCard className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <h4 className="font-display text-xs uppercase tracking-wider text-[#A098A8] font-normal mb-3">
              Standard Compliance Reports
            </h4>
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-xs text-left group shadow-sm cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="h-4 w-4 text-[#E8B4F8]" />
                  <span className="text-[#E2DCE7] font-normal group-hover:text-white">Schedule C Tax Worksheet</span>
                </div>
                <Download className="h-3.5 w-3.5 text-[#A098A8] group-hover:text-white" />
              </button>
              <button className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all text-xs text-left group shadow-sm cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#E8B4F8]" />
                  <span className="text-[#E2DCE7] font-normal group-hover:text-white">Q3 P&amp;L Summary Statement</span>
                </div>
                <Download className="h-3.5 w-3.5 text-[#A098A8] group-hover:text-white" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
