"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { StatBlock } from "@/components/ui/StatBlock";
import RevenueChart from "@/components/dashboard/RevenueChartLazy";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ActiveDeadlines } from "@/components/dashboard/ActiveDeadlines";
import { StatCardData } from "@/lib/mock-data";
import { staggerContainerVariants } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/client";
import { formatINR } from "@/lib/utils";
import { useWorkspaceMode } from "@/lib/workspace-context";

export default function DashboardClient() {
  const { currentMode } = useWorkspaceMode();
  const [userName, setUserName] = useState("Executive Operator");
  const [salesData, setSalesData] = useState<any[]>([]);
  const [leadsData, setLeadsData] = useState<any[]>([]);
  const [stats, setStats] = useState<{
    totalPipeline: number;
    avgDealSize: number;
    winRate: number;
    leadsCount: number;
    wonLeadsCount: number;
    activeClientsCount: number;
    totalClientsCount: number;
    clientsList: Array<{ name?: string; company_name?: string }>;
  }>({
    totalPipeline: 0,
    avgDealSize: 0,
    winRate: 0,
    leadsCount: 0,
    wonLeadsCount: 0,
    activeClientsCount: 0,
    totalClientsCount: 0,
    clientsList: [],
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();

        // 1. Fetch User Info
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0];
          if (name) setUserName(name);
        }

        // 2. Live Fetch Leads
        const { data: leads } = await supabase.from("leads").select("*");
        const leadList = leads || [];
        setLeadsData(leadList);
        const totalPipeline = leadList.reduce(
          (sum: number, l: any) => sum + (Number.isFinite(Number(l.budget ?? l.value)) ? Number(l.budget ?? l.value) : 0),
          0
        );
        const wonLeads = leadList.filter(
          (l: any) => l.status === "Won" || l.status === "won"
        );
        
        // Math safety: guard against division by zero and NaN
        const rawWinRate = leadList.length > 0 ? (wonLeads.length / leadList.length) * 100 : 0;
        const winRate = Number.isFinite(rawWinRate) ? Math.round(rawWinRate) : 0;

        const rawAvgDealSize = leadList.length > 0 ? totalPipeline / leadList.length : 0;
        const avgDealSize = Number.isFinite(rawAvgDealSize) ? Math.round(rawAvgDealSize) : 0;

        // 3. Live Fetch Clients
        const { data: clients } = await supabase.from("clients").select("*");
        const clientList = clients || [];
        const activeClients = clientList.filter(
          (c: any) => c.status === "Active" || !c.status
        );

        // 4. Live Fetch Sales for Revenue Trajectory
        const { data: sales } = await supabase
          .from("sales")
          .select("*")
          .order("created_at", { ascending: true });
        if (sales) setSalesData(sales);

        setStats({
          totalPipeline: Number.isFinite(totalPipeline) ? totalPipeline : 0,
          avgDealSize,
          winRate,
          leadsCount: leadList.length,
          wonLeadsCount: wonLeads.length,
          activeClientsCount: activeClients.length,
          totalClientsCount: clientList.length,
          clientsList: clientList,
        });
      } catch (err) {
        console.warn("Dashboard data live fetch warning:", err);
      }
    }
    loadDashboardData();
  }, []);

  const dynamicStatCards: StatCardData[] = [
    {
      id: "pipeline",
      title: "Total Pipeline",
      value: formatINR(stats.totalPipeline),
      change: `${stats.leadsCount} deals registered`,
      changeType: "positive",
      subtitle: "aggregate pipeline volume",
      iconName: "Wallet",
      sparkline: [25, 22, 26, 30, 35, 42, 50, 58],
    },
    {
      id: "avg_deal",
      title: "Average Deal Size",
      value: formatINR(stats.avgDealSize),
      change: "+12.4%",
      changeType: "positive",
      subtitle: "mean contract yield",
      iconName: "RefreshCw",
      sparkline: [20, 24, 22, 28, 32, 38, 45],
    },
    {
      id: "win_rate",
      title: "Conversion / Win Rate",
      value: `${stats.winRate}%`,
      subtitle: `${stats.wonLeadsCount} won of ${stats.leadsCount} deals`,
      badge: `${stats.leadsCount - stats.wonLeadsCount} in flight`,
      iconName: "Clock",
      sparkline: [40, 45, 52, 60, 68],
    },
    {
      id: "accounts",
      title: "Active Accounts",
      value: `${stats.activeClientsCount} Active`,
      badge: `${stats.totalClientsCount} Total`,
      subtitle: "verified enterprise accounts",
      iconName: "Users",
      avatars: stats.clientsList.slice(0, 4).map((c, idx) => ({
        initials: (c.name || c.company_name || "AC").substring(0, 2).toUpperCase(),
        bg: idx % 2 === 0 ? "bg-[#B270A2]/25" : "bg-white/10",
        text: idx % 2 === 0 ? "text-[#E8B4F8]" : "text-white",
      })),
    },
  ];

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-4"
    >
      {/* Dynamic Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-[#E2DCE7]">
              Good morning, {userName}
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] animate-pulse shadow-[0_0_8px_#E8B4F8]" />
              Active Orbit
            </span>
          </div>
          <p className="text-xs text-[#A098A8] max-w-2xl leading-relaxed font-normal">
            Here is what&apos;s happening across your business today. All deals, retainers, and client deliverables are synchronized dynamically with Supabase.
          </p>
        </div>
      </div>

      {/* Top Row Live Calculated Stat Cards */}
      <section
        aria-label="Overview KPI Metrics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {dynamicStatCards.map((stat, idx) => (
          <StatBlock key={stat.id} data={stat} index={idx} />
        ))}
      </section>

      {/* Main Dashboard Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column: Revenue Trajectory Chart & Recent Activity (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <RevenueChart sales={salesData} leads={leadsData} mode={currentMode} />
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
