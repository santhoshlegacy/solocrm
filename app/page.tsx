"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatBlock } from "@/components/ui/StatBlock";
import RevenueChart from "@/components/dashboard/RevenueChartLazy";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActiveDeadlines } from "@/components/dashboard/ActiveDeadlines";
import { STAT_CARDS, USER_PROFILE } from "@/lib/mock-data";
import { staggerContainerVariants } from "@/components/ui/GlassCard";
import { Sparkles, CheckCircle2, Filter } from "lucide-react";

export default function DashboardPage() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-4"
    >
      {/* "Good morning, Santhosh" Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white">
              {USER_PROFILE.greeting}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#e03837] border border-[#d41514]/25 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d41514] animate-pulse" />
              Active Orbit
            </span>
          </div>
          <p className="text-xs text-[#a1a1aa] max-w-2xl leading-relaxed font-normal">
            Here is what's happening across your freelance business today. You have{" "}
            <span className="text-white font-medium underline decoration-[#d41514]/60 underline-offset-4">
              3 key deliverables
            </span>{" "}
            due this week.
          </p>
        </div>

        {/* Velocity Badge & Filter CTA */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#111114] px-3.5 py-1.5 shadow-sm">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#d41514]" />
            <span className="text-xs text-[#71717a] font-mono">
              Target Velocity:{" "}
              <span className="font-semibold text-white tabular-nums">
                {USER_PROFILE.targetVelocity}
              </span>
            </span>
          </div>

          <button className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-[#111114] hover:bg-[#16161b] hover:border-white/[0.14] px-3.5 py-1.5 text-xs font-mono text-[#d4d4d8] hover:text-white transition-all shadow-sm">
            <Filter className="h-3.5 w-3.5 text-[#71717a]" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Top Row Stat Cards */}
      <section
        aria-label="Overview KPI Metrics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STAT_CARDS.map((stat, idx) => (
          <StatBlock key={stat.id} data={stat} index={idx} />
        ))}
      </section>

      {/* Main Dashboard Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Revenue Trajectory Chart & Recent Activity (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <RevenueChart />
          <RecentActivity />
        </div>

        {/* Side Column: Quick Actions, Active Session Timer & Deadlines (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <QuickActions />
          <ActiveDeadlines />
        </div>
      </section>
    </motion.div>
  );
}
