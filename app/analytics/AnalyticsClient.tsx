"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import InsightsBarChart from "@/components/dashboard/InsightsBarChartLazy";
import {
  BarChart3,
  TrendingUp,
  Download,
  ShieldCheck,
  Target,
  PieChart,
  FileSpreadsheet,
  CheckCircle2,
  Printer,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { formatINR } from "@/lib/utils";

interface CohortTier {
  cohort: string;
  min: number;
  max: number;
  color: string;
}

const COHORT_TIERS: CohortTier[] = [
  { cohort: "Enterprise Retainers (₹10L+)", min: 1000000, max: Infinity, color: "bg-gradient-to-r from-[#B270A2] to-[#E8B4F8]" },
  { cohort: "Growth Modules (₹5L-₹10L)", min: 500000, max: 1000000, color: "bg-[#E8B4F8]" },
  { cohort: "Project Sprints (₹1L-₹5L)", min: 100000, max: 500000, color: "bg-[#7A5A97]" },
  { cohort: "Advisory Sessions (<₹1L)", min: 0, max: 100000, color: "bg-white/20" },
];

export default function AnalyticsClient() {
  const [timeframe, setTimeframe] = useState<"Q4" | "YTD" | "All-Time">("YTD");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const supabase = createClient();
        const [salesRes, clientsRes] = await Promise.all([
          supabase.from("sales").select("*").order("created_at", { ascending: false }),
          supabase.from("clients").select("*").order("created_at", { ascending: false }),
        ]);

        setSales(salesRes.data || []);
        setClients(clientsRes.data || []);
      } catch (err) {
        console.warn("Analytics data fetch warning:", err);
        setSales([]);
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  // Dynamic Financial Calculations with Math safety & zero-division protection
  const totalBilled = sales.reduce((sum, s) => {
    const val = Number(s.amount);
    return sum + (Number.isFinite(val) ? val : 0);
  }, 0);
  const paidSales = sales.filter((s) => (s.invoice_status || s.status || "").toLowerCase() === "paid");
  const totalPaid = paidSales.reduce((sum, s) => {
    const val = Number(s.amount);
    return sum + (Number.isFinite(val) ? val : 0);
  }, 0);

  const rawCollectionRate = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;
  const collectionRate = Number.isFinite(rawCollectionRate) ? Math.round(rawCollectionRate) : 0;

  const rawAcv = sales.length > 0 ? totalBilled / sales.length : 0;
  const acv = Number.isFinite(rawAcv) ? Math.round(rawAcv) : 0;

  const activeClients = clients.filter(
    (c) => (c.status || "").toLowerCase() === "active" || !c.status
  );
  const activeAccountsCount = activeClients.length;
  const totalAccountsCount = clients.length;

  // Monthly Insights Data computation
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyInsights = months.map((m) => ({
    month: m,
    revenue: 0,
    billed: 0,
  }));

  sales.forEach((s) => {
    const rawDate = s.date || s.created_at;
    if (rawDate) {
      const date = new Date(rawDate);
      const mIdx = date.getMonth();
      const amt = Number(s.amount) || 0;
      if (mIdx >= 0 && mIdx < 12) {
        monthlyInsights[mIdx].billed += amt;
        if ((s.invoice_status || s.status || "").toLowerCase() === "paid") {
          monthlyInsights[mIdx].revenue += amt;
        }
      }
    }
  });

  // Dynamic Cohort Mix with NaN protection
  const cohortData = COHORT_TIERS.map((tier) => {
    const matching = sales.filter((s) => {
      const amt = Number(s.amount) || 0;
      return amt >= tier.min && amt < tier.max;
    });
    const subtotal = matching.reduce((sum, s) => {
      const amt = Number(s.amount);
      return sum + (Number.isFinite(amt) ? amt : 0);
    }, 0);
    const rawShare = totalBilled > 0 ? (subtotal / totalBilled) * 100 : 0;
    const share = Number.isFinite(rawShare) ? Math.round(rawShare) : 0;
    return {
      cohort: tier.cohort,
      accounts: matching.length,
      share,
      color: tier.color,
    };
  }).filter((c) => c.accounts > 0);

  const exportFinancialAuditCSV = () => {
    const headers = ["Metric Item", "Accounting Timeframe", "Valuation (INR)", "Status / Details"];
    const rows = [
      ["Annual Recurring Run-Rate (ARR)", timeframe, formatINR(totalBilled), `${sales.length} Deals Registered`],
      ["Net Cash Collected", timeframe, formatINR(totalPaid), `${collectionRate}% Settlement Rate`],
      ["Average Contract Value (ACV)", timeframe, formatINR(acv), "Mean Yield"],
      ["Active Enterprise Accounts", timeframe, String(activeAccountsCount), `${totalAccountsCount} Total Accounts`],
      ...sales.map((s, idx) => [
        `Invoice #${s.invoice_number || idx + 1} (${s.client_name || s.client || "Client"})`,
        s.created_at ? new Date(s.created_at).toISOString().split("T")[0] : timeframe,
        formatINR(Number(s.amount) || 0),
        s.status || "Draft",
      ]),
    ];

    const formatRow = (row: (string | number)[]) =>
      row.map((val) => '"' + String(val).replace(/"/g, '""') + '"').join(",");

    const csvContent = [formatRow(headers), ...rows.map(formatRow)].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SoloCRM_Financial_Audit_${timeframe}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Exported Financial Audit CSV for ${timeframe}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePrintReport = () => {
    window.print();
  };

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
            <span className="rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[11px] font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 flex items-center gap-1.5 font-mono shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] animate-pulse shadow-[0_0_8px_#E8B4F8]" />
              Business Analytics
            </span>
            <span className="text-[#A098A8] text-xs font-mono">• Executive Dashboard</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#E2DCE7] mt-0.5 font-display">
            Enterprise Growth &amp; Unit Economics
          </h1>
          <p className="text-xs text-[#A098A8] max-w-2xl font-normal">
            High-leverage business metrics, cohort customer lifetime value, cash velocity, and retention dynamics in INR (₹).
          </p>
        </div>

        {/* Timeframe Controls & Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-white/[0.04] border border-white/10 p-1 rounded-full shadow-inner">
            {(["Q4", "YTD", "All-Time"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  timeframe === tf
                    ? "bg-white/10 text-white border border-white/10 shadow-sm font-semibold"
                    : "text-[#A098A8] hover:text-[#E2DCE7]"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={exportFinancialAuditCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-[#A098A8] hover:text-white text-xs font-mono transition-colors active:scale-95 shadow-sm cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#E8B4F8]" />
            <span>Export Financial Audit</span>
          </button>
        </div>
      </div>

      {/* Floating Feedback Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-[#E8B4F8]/30 bg-[#140D1B]/95 backdrop-blur-xl p-3 text-xs text-[#E8B4F8] flex items-center gap-2 shadow-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-[#E8B4F8] shrink-0" />
            <span className="font-medium font-mono">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 High-Impact KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
              Annual Recurring Run-Rate
            </span>
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#E8B4F8]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums block">
            {isLoading ? "₹..." : formatINR(totalBilled)}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#E8B4F8] font-mono font-medium">
              {totalBilled > 0 ? "+100%" : "₹0"}
            </span>
            <span className="text-[#A098A8] text-[11px]">
              {sales.length > 0 ? `${sales.length} active ledger contracts` : "0 ledger contracts registered"}
            </span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full transition-all duration-500"
              style={{ width: `${totalBilled > 0 ? Math.min(100, collectionRate || 100) : 0}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
              Net Capital Velocity
            </span>
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#E8B4F8]">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums block">
            {isLoading ? "₹..." : formatINR(totalPaid)}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#E8B4F8] font-mono font-medium">{collectionRate}%</span>
            <span className="text-[#A098A8] text-[11px]">collections in bank</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full transition-all duration-500"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
              Avg Contract Value (ACV)
            </span>
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#E8B4F8]">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums block">
            {isLoading ? "₹..." : formatINR(acv)}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#E8B4F8] font-mono font-medium">
              {sales.length > 0 ? `${sales.length} Deals` : "0 Deals"}
            </span>
            <span className="text-[#A098A8] text-[11px]">mean contract yield</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full transition-all duration-500"
              style={{ width: `${sales.length > 0 ? 100 : 0}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
              Active Enterprise Accounts
            </span>
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#E8B4F8]">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums block">
            {isLoading ? "..." : activeAccountsCount}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#E8B4F8] font-mono font-medium">
              {totalAccountsCount} Total
            </span>
            <span className="text-[#A098A8] text-[11px]">registered client entities</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalAccountsCount > 0 ? Math.min(100, Math.round((activeAccountsCount / totalAccountsCount) * 100)) : 0}%`,
              }}
            />
          </div>
        </GlassCard>
      </div>

      {/* Analytics Mid Grid: Chart & Cohort Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Recharts Bar Visualization */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-[#E2DCE7] tracking-tight">
                  Monthly Capital Inflow &amp; Invoiced Sprints
                </h3>
                <p className="text-xs text-[#A098A8] font-normal">
                  Gross billed vs settled payments across active quarters (₹ INR)
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8B4F8] bg-[#E8B4F8]/15 px-2.5 py-0.5 rounded-full border border-[#E8B4F8]/30">
                VERIFIED CASH FLOW
              </span>
            </div>

            <div className="h-72 w-full">
              <InsightsBarChart data={monthlyInsights} />
            </div>
          </GlassCard>
        </div>

        {/* Right: Cohort Mix & Executive Reports */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#E8B4F8]" />
                <h3 className="text-base font-medium text-white tracking-tight font-display">
                  Revenue Cohort Mix
                </h3>
              </div>
              <span className="text-[11px] text-[#A098A8] font-mono">
                {sales.length} Deals
              </span>
            </div>

            {cohortData.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center my-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] mb-2">
                  <PieChart className="h-5 w-5" />
                </div>
                <h4 className="font-display text-xs font-semibold text-white tracking-tight mb-0.5">
                  Zero Cohort Data
                </h4>
                <p className="text-[11px] text-[#A098A8] font-normal">
                  Issued client invoices will automatically populate revenue cohort tiers.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 mt-2">
                {cohortData.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#E2DCE7] font-medium truncate">{item.cohort}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[#A098A8] text-[11px]">{item.accounts} invoices</span>
                        <span className="font-semibold text-white tabular-nums">{item.share}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A098A8] font-mono">
              <span>Settlement Ratio: {collectionRate}%</span>
              <span className="text-[#E8B4F8] font-medium">
                {totalPaid > 0 ? "Cash Positive" : "Awaiting Inflow"}
              </span>
            </div>
          </GlassCard>

          {/* Quick Reports Download Tiles */}
          <GlassCard className="p-5">
            <h4 className="text-xs uppercase tracking-wider text-[#A098A8] font-mono font-medium mb-3">
              Executive Board &amp; Investor Reports
            </h4>
            <div className="flex flex-col gap-2">
              <button
                onClick={exportFinancialAuditCSV}
                className="flex items-center justify-between p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] hover:border-[#E8B4F8]/40 transition-all text-xs text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="h-4 w-4 text-[#E8B4F8]" />
                  <span className="text-[#E2DCE7] font-medium group-hover:text-white">
                    Q4 Board Financial Deck (CSV)
                  </span>
                </div>
                <Download className="h-3.5 w-3.5 text-[#A098A8] group-hover:text-white" />
              </button>

              <button
                onClick={handlePrintReport}
                className="flex items-center justify-between p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] hover:border-[#E8B4F8]/40 transition-all text-xs text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Printer className="h-4 w-4 text-[#E8B4F8]" />
                  <span className="text-[#E2DCE7] font-medium group-hover:text-white">
                    Unit Economics Printable Audit View
                  </span>
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
