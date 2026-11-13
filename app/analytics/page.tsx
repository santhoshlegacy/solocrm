"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import InsightsBarChart from "@/components/dashboard/InsightsBarChartLazy";
import {
  BarChart3,
  TrendingUp,
  Download,
  ShieldCheck,
  Users,
  Target,
  PieChart,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

const COHORT_DATA = [
  { cohort: "Enterprise Tier ($50k+)", accounts: 2, share: 48, color: "bg-[#d41514]" },
  { cohort: "Growth Retainers ($25k-$50k)", accounts: 3, share: 32, color: "bg-[#d41514]/80" },
  { cohort: "Project Sprints ($10k-$25k)", accounts: 4, share: 14, color: "bg-[#d41514]/50" },
  { cohort: "Advisory Sessions (<$10k)", accounts: 5, share: 6, color: "bg-white/20" },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"Q4" | "YTD" | "All-Time">("YTD");

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
              Business Analytics
            </span>
            <span className="text-[#cdcbca]/50 text-xs">• Executive Dashboard</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-medium tracking-tight text-white/95 mt-0.5">
            Enterprise Growth &amp; Unit Economics
          </h1>
          <p className="text-xs text-[#cdcbca]/70 max-w-2xl font-normal">
            High-leverage business metrics, cohort customer lifetime value, cash velocity, and retention dynamics.
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-[#141414] border border-[#222] p-0.5 rounded-md">
            {(["Q4", "YTD", "All-Time"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  timeframe === tf
                    ? "bg-[#d41514]/15 text-white border-l-2 border-l-[#d41514] border-t border-r border-b border-[#d41514]/30"
                    : "text-[#888] hover:text-white"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#141414] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#333] text-[#888] hover:text-white text-xs font-mono transition-colors">
            <Download className="h-3.5 w-3.5 text-[#d41514]" />
            <span>Export Financial Audit</span>
          </button>
        </div>
      </div>

      {/* 4 High-Impact KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
              Annual Recurring Run-Rate
            </span>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#d41514]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums block">
            $192,400
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#e03837] font-mono font-medium">+34.2%</span>
            <span className="text-[#71717a] text-[11px]">vs prior cycle ($143.3k)</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[88%]" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
              LTV : CAC Efficiency Ratio
            </span>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#d41514]">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums block">
            8.4x
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#e03837] font-mono font-medium">Tier 1 Elite</span>
            <span className="text-[#71717a] text-[11px]">Benchmark: &gt; 3.0x</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[82%]" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
              Gross Revenue Retention
            </span>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#d41514]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums block">
            96.8%
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#e03837] font-mono font-medium">Zero Churn</span>
            <span className="text-[#71717a] text-[11px]">Last 6 months</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[96.8%]" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
              Average Account Value
            </span>
            <div className="h-8 w-8 rounded-lg bg-white/[0.03] border border-white/[0.07] flex items-center justify-center text-[#d41514]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums block">
            $29,680
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#e03837] font-mono font-medium">+$4,200</span>
            <span className="text-[#71717a] text-[11px]">Upward expansion</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[78%]" />
          </div>
        </GlassCard>
      </div>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lazy Loaded Monthly Trajectory Chart (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#161616] border border-[#222] text-[#d41514]">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-white tracking-tight">
                    Corporate Revenue Velocity &amp; Cash Expansion
                  </h2>
                  <p className="text-xs text-[#888] font-normal">
                    Gross monthly client billings versus capital expenditure
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-white font-medium font-mono">
                  <span className="h-2 w-2 rounded-full bg-[#d41514]" />
                  Revenue
                </span>
                <span className="flex items-center gap-1.5 text-[#888] font-medium font-mono">
                  <span className="h-2 w-2 rounded-full bg-[#333]" />
                  Expenses
                </span>
              </div>
            </div>

            {/* Lazy-loaded Bar Chart with zero SSR blocking */}
            <InsightsBarChart />
          </GlassCard>

          {/* Unit Economics Breakdown Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#d41514]" />
                <h3 className="text-base font-medium text-white/95 tracking-tight">
                  Unit Economics &amp; Margin Telemetry
                </h3>
              </div>
              <span className="rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-xs font-medium text-[#d41514] border border-[#d41514]/20">
                Audited Healthy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
                <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.12em] block">Gross Profit Margin</span>
                <span className="font-display text-lg font-bold text-white tabular-nums block mt-1">86.4%</span>
                <span className="text-[10px] font-mono text-[#d41514] font-medium mt-1 block">Software &amp; Design Stack</span>
              </div>
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
                <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.12em] block">Payback Period</span>
                <span className="font-display text-lg font-bold text-white tabular-nums block mt-1">1.2 Months</span>
                <span className="text-[10px] font-mono text-[#d41514] font-medium mt-1 block">Instant Client Profitability</span>
              </div>
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
                <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.12em] block">Net Rule of 40 Score</span>
                <span className="font-display text-lg font-bold text-[#d41514] tabular-nums block mt-1">118%</span>
                <span className="text-[10px] font-mono text-[#71717a] mt-1 block">Growth (34%) + Margin (84%)</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Client Cohort Concentration (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#d41514]" />
                <h3 className="text-base font-medium text-white/95 tracking-tight">
                  Revenue Cohort Mix
                </h3>
              </div>
              <span className="text-[11px] text-[#cdcbca]/50">14 Accounts</span>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              {COHORT_DATA.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#d4d4d8] font-medium truncate">{item.cohort}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#71717a] text-[11px]">{item.accounts} accts</span>
                      <span className="font-semibold text-white tabular-nums">{item.share}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#71717a] font-mono">
              <span>Expansion rate: +18%</span>
              <span className="text-[#d41514] font-medium">Net Positive</span>
            </div>
          </GlassCard>

          {/* Quick Reports Download Tiles */}
          <GlassCard className="p-5">
            <h4 className="text-xs uppercase tracking-wider text-[#cdcbca]/60 font-medium mb-3">
              Executive Board &amp; Investor Reports
            </h4>
            <div className="flex flex-col gap-2">
              <button className="flex items-center justify-between p-2.5 rounded-xl border border-[#cdcbca]/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-xs text-left group">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="h-4 w-4 text-[#d41514]" />
                  <span className="text-[#cdcbca] font-medium group-hover:text-white">Q4 Board Financial Deck</span>
                </div>
                <Download className="h-3.5 w-3.5 text-[#cdcbca]/50 group-hover:text-white" />
              </button>
              <button className="flex items-center justify-between p-2.5 rounded-xl border border-[#cdcbca]/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-xs text-left group">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[#d41514]" />
                  <span className="text-[#cdcbca] font-medium group-hover:text-white">Unit Economics Breakdown PDF</span>
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
