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
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const CLIENT_DISTRIBUTION = [
  { client: "Apex Labs", share: 38, amount: "$56.4k", barColor: "bg-[#d41514]" },
  { client: "Hyperion Cloud", share: 24, amount: "$35.6k", barColor: "bg-[#d41514]/80" },
  { client: "Nexus Protocol", share: 18, amount: "$26.7k", barColor: "bg-[#d41514]/60" },
  { client: "CyberDynamics", share: 12, amount: "$17.8k", barColor: "bg-[#cdcbca]/40" },
  { client: "StudioMono & Others", share: 8, amount: "$12.1k", barColor: "bg-[#cdcbca]/20" },
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
            <span className="rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#d41514] border border-[#d41514]/20 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d41514] animate-pulse" />
              Financial Telemetry
            </span>
            <span className="text-[#cdcbca]/50 text-xs font-normal">• Q4 Audit Cycle Active</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-white/95 mt-0.5">
            Financial Insights &amp; Analytics
          </h1>
          <p className="text-xs text-[#cdcbca]/70 max-w-2xl font-normal">
            Detailed breakdown of freelance revenue, project margins, and business expenses. Calibrated for maximum solo operator runway.
          </p>
        </div>

        {/* Range Selector & Report Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-[#141414] border border-[#222] p-0.5 rounded-md">
            <button
              onClick={() => setRange("ytd")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                range === "ytd"
                  ? "bg-[#d41514]/15 text-white border-l-2 border-l-[#d41514] border-t border-r border-b border-[#d41514]/30"
                  : "text-[#888] hover:text-white"
              }`}
            >
              YTD
            </button>
            <button
              onClick={() => setRange("12m")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                range === "12m"
                  ? "bg-[#d41514]/15 text-white border-l-2 border-l-[#d41514] border-t border-r border-b border-[#d41514]/30"
                  : "text-[#888] hover:text-white"
              }`}
            >
              Last 12 Months
            </button>
            <button
              onClick={() => setRange("custom")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                range === "custom"
                  ? "bg-[#d41514]/15 text-white border-l-2 border-l-[#d41514] border-t border-r border-b border-[#d41514]/30"
                  : "text-[#888] hover:text-white"
              }`}
            >
              Custom
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#141414] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#333] text-[#888] hover:text-white text-xs font-mono transition-colors">
            <Download className="h-3.5 w-3.5 text-[#d41514]" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 High-Impact KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
              Annual Gross Revenue
            </span>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#d41514]">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              $148,600
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono">
            <span className="text-[#e03837] font-medium flex items-center">
              +28.4%
            </span>
            <span className="text-[#71717a] text-[11px] font-normal">vs previous 12 mo ($115.7k)</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[82%]" />
          </div>
        </GlassCard>

        {/* KPI 2 */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
              Effective Hourly Rate
            </span>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#d41514]">
              <Bolt className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              $165
            </span>
            <span className="text-xs text-[#71717a] font-mono">/hr</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono">
            <span className="text-[#e03837] font-medium">+$25/hr</span>
            <span className="text-[#71717a] text-[11px] font-normal">calibrated to 900 billable hrs</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[74%]" />
          </div>
        </GlassCard>

        {/* KPI 3 */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
              Total Profit Margin
            </span>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#d41514]">
              <PieChart className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              84.2%
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono">
            <span className="text-[#e03837] font-medium">Lean Stack</span>
            <span className="text-[#71717a] text-[11px] font-normal">$23.5k OPEX overhead</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[84.2%]" />
          </div>
        </GlassCard>

        {/* KPI 4 */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
              Avg Time to Payment
            </span>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#d41514]">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              4.8
            </span>
            <span className="text-xs text-[#71717a] font-mono">Days</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono">
            <span className="text-[#e03837] font-medium">-2.1 Days</span>
            <span className="text-[#71717a] text-[11px] font-normal">Stripe Auto-debit</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[92%]" />
          </div>
        </GlassCard>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 12-Month Revenue & Cash Flow Trend (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#161616] border border-[#222] text-[#d41514]">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-white tracking-tight">
                    12-Month Revenue &amp; Cash Flow Trend
                  </h2>
                  <p className="text-xs text-[#888] font-normal">
                    Gross monthly revenue compared against operational expenses
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-white font-mono font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#d41514]" />
                  Revenue
                </span>
                <span className="flex items-center gap-1.5 text-[#888] font-mono font-normal">
                  <span className="h-2 w-2 rounded-full bg-[#333]" />
                  Expenses
                </span>
              </div>
            </div>

            {/* Glowing Recharts Bar Chart (Lazy Loaded) */}
            <InsightsBarChart />
          </GlassCard>

          {/* Tax Reserve & OPEX Breakdown Summary */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#d41514]" />
                <h3 className="font-display text-base font-semibold text-white/95 tracking-tight">
                  Tax Reserves &amp; Runway Protection
                </h3>
              </div>
              <span className="rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-xs font-medium text-[#d41514] border border-[#d41514]/20">
                Quarterly FDIC Protected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl border border-[#cdcbca]/10 bg-white/[0.02]">
                <span className="text-[11px] text-[#cdcbca]/60 block font-normal">Tax Reserve (30%)</span>
                <span className="font-display text-lg font-medium text-white/95 tabular-nums">$44,580</span>
                <span className="text-[10px] text-[#d41514] font-medium mt-1 block">Held in High-Yield Treasury</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#cdcbca]/10 bg-white/[0.02]">
                <span className="text-[11px] text-[#cdcbca]/60 block font-normal">Monthly Software &amp; AI</span>
                <span className="font-display text-lg font-medium text-white/95 tabular-nums">$450/mo</span>
                <span className="text-[10px] text-[#cdcbca]/50 mt-1 block font-normal">Figma, GitHub, Anthropic</span>
              </div>
              <div className="p-3.5 rounded-xl border border-[#cdcbca]/10 bg-white/[0.02]">
                <span className="text-[11px] text-[#cdcbca]/60 block font-normal">Estimated Net Take-Home</span>
                <span className="font-display text-lg font-medium text-[#d41514] tabular-nums">$80,520</span>
                <span className="text-[10px] text-[#cdcbca]/50 mt-1 block font-normal">After Taxes &amp; OPEX</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Client Revenue Distribution (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#d41514]" />
                <h3 className="font-display text-base font-semibold text-white/95 tracking-tight">
                  Client Concentration
                </h3>
              </div>
              <span className="text-[11px] text-[#cdcbca]/50 font-normal">5 Key Accounts</span>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              {CLIENT_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#cdcbca] font-normal truncate">{item.client}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#cdcbca]/50 text-[11px]">{item.amount}</span>
                      <span className="font-medium text-white/95">{item.share}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.barColor} shadow-sm`}
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#cdcbca]/10 flex items-center justify-between text-xs text-[#cdcbca]/60 font-normal">
              <span>Target: &lt; 40% single client</span>
              <span className="text-[#d41514] font-medium">Healthy (38% max)</span>
            </div>
          </GlassCard>

          {/* Quick Reports Download Tiles */}
          <GlassCard className="p-5">
            <h4 className="font-display text-xs uppercase tracking-wider text-[#cdcbca]/60 font-normal mb-3">
              Standard Compliance Reports
            </h4>
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-between p-2.5 rounded-xl border border-[#cdcbca]/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-xs text-left group shadow-sm">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="h-4 w-4 text-[#d41514]" />
                  <span className="text-[#cdcbca] font-normal group-hover:text-white">Schedule C Tax Worksheet</span>
                </div>
                <Download className="h-3.5 w-3.5 text-[#cdcbca]/50 group-hover:text-white" />
              </button>
              <button className="flex items-center justify-between p-2.5 rounded-xl border border-[#cdcbca]/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-xs text-left group shadow-sm">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#d41514]" />
                  <span className="text-[#cdcbca] font-normal group-hover:text-white">Q3 P&amp;L Summary Statement</span>
                </div>
                <Download className="h-3.5 w-3.5 text-[#cdcbca]/50 group-hover:text-white" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
