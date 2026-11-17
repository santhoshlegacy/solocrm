"use client";

import React, { useState } from "react";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  Receipt,
  Download,
  Search,
  Wifi,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Sliders,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

interface Transaction {
  id: string;
  invoiceNumber: string;
  client: string;
  description: string;
  amount: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    invoiceNumber: "INV-2024-001",
    client: "Veloce AI",
    description: "Series A Deck Redesign & Tokens Extraction (Sprint 1)",
    amount: "$9,500.00",
    dueDate: "Nov 02, 2024",
    status: "paid",
  },
  {
    id: "tx-2",
    invoiceNumber: "INV-2024-002",
    client: "Nexus Protocol",
    description: "Brand Identity, DEX Terminal & Smart Contract Integration",
    amount: "$14,000.00",
    dueDate: "Nov 15, 2024",
    status: "pending",
  },
  {
    id: "tx-3",
    invoiceNumber: "INV-2024-003",
    client: "Arcadia Health",
    description: "Patient Checkout UX Audit & Design System Sprint",
    amount: "$5,000.00",
    dueDate: "Oct 28, 2024",
    status: "paid",
  },
  {
    id: "tx-4",
    invoiceNumber: "INV-2024-004",
    client: "Hyperion Cloud",
    description: "Cloud Cost Infrastructure Monitoring Architecture",
    amount: "$12,400.00",
    dueDate: "Nov 20, 2024",
    status: "pending",
  },
  {
    id: "tx-5",
    invoiceNumber: "INV-2024-005",
    client: "Kroma Studio",
    description: "Generative Canvas Engine & WebGL Shader Pipeline",
    amount: "$7,370.00",
    dueDate: "Oct 14, 2024",
    status: "overdue",
  },
];

export default function PaymentsPage() {
  const [showCvv, setShowCvv] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = TRANSACTIONS.filter((tx) => {
    const matchesSearch =
      tx.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-2"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Cards &amp; Treasury
            </h1>
            <span className="rounded-full bg-[#E8B4F8]/15 px-3 py-1 text-[11px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30">
              Live Vault
            </span>
          </div>
          <p className="text-xs text-[#A098A8] max-w-2xl font-normal">
            Manage encrypted virtual corporate cards, multi-currency client receivables, and autonomous liquidity pipelines.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E2DCE7] hover:text-white text-xs font-mono transition-all cursor-pointer">
            <CreditCard className="h-3.5 w-3.5 text-[#E8B4F8]" />
            <span>+ Issue Virtual Card</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] transition-all cursor-pointer">
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Top Bento Section: Virtual Card (7 cols) & Liquidity Vault (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Virtual Card Hub (7 cols) */}
        <GlassCard className="lg:col-span-7 p-6 flex flex-col justify-between rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 text-[#E8B4F8]">
                <Wifi className="h-4 w-4 rotate-90" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Solo Titanium Frosted Card</span>
                <span className="text-[10px] text-[#A098A8] uppercase tracking-wider font-normal">
                  Virtual Commercial • Multi-Currency
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-[#A098A8] shadow-sm">
              <span className={`h-1.5 w-1.5 rounded-full ${isFrozen ? "bg-rose-400" : "bg-[#E8B4F8] animate-pulse"}`} />
              <span className="font-normal">{isFrozen ? "Card Frozen" : "Apple Pay Active"}</span>
            </div>
          </div>

          {/* Highly Detailed Frosted Glass Virtual Card */}
          <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.2)] bg-gradient-to-br from-[#1C0D22] via-[#120B18] to-[#09050F] border border-white/20 transition-transform hover:scale-[1.01] duration-300 my-2">
            {/* Specular Streaks */}
            <div className="pointer-events-none absolute -inset-full bg-[radial-gradient(circle_at_30%_20%,rgba(232,180,248,0.25)_0%,transparent_40%),radial-gradient(circle_at_80%_80%,rgba(178,112,162,0.15)_0%,transparent_45%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] opacity-70" />

            {/* Top Bar: Chip & Logo */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Gold EMV Microchip */}
                <div className="relative w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 shadow-md flex items-center justify-center overflow-hidden border border-amber-600/40">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-50">
                    <span className="border-r border-b border-amber-900/60" />
                    <span className="border-b border-amber-900/60" />
                    <span className="border-r border-amber-900/60" />
                    <span />
                  </div>
                  <div className="w-5 h-4 rounded-sm border border-amber-900/40" />
                </div>
                <Wifi className="h-5 w-5 text-[#A098A8] rotate-90" />
              </div>

              <div className="flex items-center gap-1.5 text-right">
                <span className="font-display text-lg tracking-tighter text-white font-black italic">
                  SOLO
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#E8B4F8] bg-[#E8B4F8]/15 px-2 py-0.5 rounded-full font-mono font-medium border border-[#E8B4F8]/30">
                  Titanium
                </span>
              </div>
            </div>

            {/* Middle: Encrypted PAN Number */}
            <div className="relative z-10 my-auto">
              <div className="flex items-center justify-between font-mono text-lg sm:text-xl tracking-widest text-white font-medium">
                <span>••••</span>
                <span>••••</span>
                <span>••••</span>
                <span className="text-[#E8B4F8] font-semibold tracking-wider">8842</span>
              </div>
            </div>

            {/* Bottom Bar: Details & Visa Platinum */}
            <div className="relative z-10 flex items-end justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-[#A098A8] font-normal">Cardholder</span>
                <span className="font-medium text-white uppercase tracking-wide">Operator</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-[#A098A8] font-normal">Expires</span>
                  <span className="font-medium text-white font-mono">08/28</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-wider text-[#A098A8] font-normal">CVV</span>
                  <span className="font-mono font-medium text-[#E8B4F8]">
                    {showCvv ? "492" : "•••"}
                  </span>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-display text-base font-black tracking-tighter text-white italic leading-none">
                    VISA
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-[#A098A8] font-normal">
                    Platinum
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Action Controls */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setIsFrozen(!isFrozen)}
              className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-xs shadow-sm cursor-pointer"
            >
              <Lock className={`h-4 w-4 ${isFrozen ? "text-rose-400" : "text-[#E8B4F8]"}`} />
              <span className="text-[#E2DCE7] font-medium">{isFrozen ? "Unfreeze" : "Freeze Card"}</span>
            </button>
            <button
              onClick={() => setShowCvv(!showCvv)}
              className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-xs shadow-sm cursor-pointer"
            >
              {showCvv ? <EyeOff className="h-4 w-4 text-[#E8B4F8]" /> : <Eye className="h-4 w-4 text-[#E8B4F8]" />}
              <span className="text-[#E2DCE7] font-medium">{showCvv ? "Hide CVV" : "Show Details"}</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-xs shadow-sm cursor-pointer">
              <Sliders className="h-4 w-4 text-[#A098A8]" />
              <span className="text-[#E2DCE7] font-medium font-mono">Limit: $10k</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all text-xs shadow-sm cursor-pointer">
              <Smartphone className="h-4 w-4 text-[#E8B4F8]" />
              <span className="text-[#E2DCE7] font-medium">Apple Wallet</span>
            </button>
          </div>
        </GlassCard>

        {/* Multi-Rail Liquidity Vault (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <GlassCard className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] font-medium">
                  Consolidated Liquidity
                </span>
                <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
                  $48,270.00
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-[#E8B4F8] bg-[#E8B4F8]/15 border border-[#E8B4F8]/30 px-3 py-1 rounded-full font-mono font-medium">
                <ArrowUpRight className="h-3 w-3" />
                +18.4% mo/mo
              </span>
            </div>

            {/* Account Balances Breakdown */}
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.03] text-[#E8B4F8] flex items-center justify-center font-bold text-xs border border-white/10">
                    $
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Stripe Corporate (USD)</span>
                    <span className="text-[10px] font-mono text-[#A098A8]">Auto-payouts scheduled daily</span>
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-white tabular-nums">$28,450.00</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.03] text-[#E8B4F8] flex items-center justify-center font-bold text-xs border border-white/10">
                    M
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Mercury FDIC Checking</span>
                    <span className="text-[10px] font-mono text-[#A098A8]">Primary operating reserve</span>
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-white tabular-nums">$14,820.00</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.04] text-[#E2DCE7] flex items-center justify-center font-medium text-xs border border-white/10">
                    €
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">Wise Multi-Currency EUR</span>
                    <span className="text-[10px] text-[#A098A8] font-normal">€4,600.00 @ 1.087 FX</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-medium text-white tabular-nums">$5,000.00</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center justify-between rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-[#E8B4F8]/10 text-[#E8B4F8] flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white">Instant Wire Routing</span>
                <span className="text-[11px] text-[#A098A8] font-normal">ACH &amp; SEPA Auto-Clear enabled</span>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-[#E8B4F8] bg-[#E8B4F8]/15 px-3 py-1 rounded-full border border-[#E8B4F8]/30">
              ZERO FEE
            </span>
          </GlassCard>
        </div>
      </div>

      {/* Transactions & Invoices Table Section */}
      <GlassCard className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 text-[#E8B4F8]">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white tracking-tight">
                Receivables &amp; Transaction History
              </h3>
              <p className="text-xs text-[#A098A8] font-normal">
                Track client payments, outstanding milestones, and billing maturity
              </p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A098A8] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices..."
                className="pl-9 pr-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-[#A098A8]/60 focus:outline-none focus:border-[#E8B4F8] focus:bg-white/[0.06] transition-all shadow-inner"
              />
            </div>

            <div className="flex items-center bg-white/[0.03] backdrop-blur-xl border border-white/10 p-1 rounded-full">
              {(["all", "paid", "pending", "overdue"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-white/10 text-[#E8B4F8] border border-white/15 font-semibold"
                      : "text-[#A098A8] hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-[#A098A8]">
                <th className="pb-3 font-normal">Invoice #</th>
                <th className="pb-3 font-normal">Client</th>
                <th className="pb-3 font-normal">Description</th>
                <th className="pb-3 font-normal">Due Date</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal text-right">Amount</th>
                <th className="pb-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-mono text-white font-medium">
                    {tx.invoiceNumber}
                  </td>
                  <td className="py-3.5 font-medium text-white">{tx.client}</td>
                  <td className="py-3.5 text-[#A098A8] max-w-xs truncate font-normal">{tx.description}</td>
                  <td className="py-3.5 text-[#A098A8]/80 font-normal">{tx.dueDate}</td>
                  <td className="py-3.5">
                    {tx.status === "paid" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B4F8]/15 px-3 py-0.5 text-[10px] font-medium text-[#E8B4F8] border border-[#E8B4F8]/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8]" />
                        Paid
                      </span>
                    )}
                    {tx.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30">
                        <Clock className="h-2.5 w-2.5" />
                        Pending
                      </span>
                    )}
                    {tx.status === "overdue" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-3 py-0.5 text-[10px] font-medium text-rose-300 border border-rose-500/30">
                        <AlertCircle className="h-2.5 w-2.5" />
                        Overdue
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right font-mono font-medium text-white tabular-nums">
                    {tx.amount}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      className="p-1.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-[#A098A8] hover:text-white transition-all inline-flex items-center gap-1 text-[11px] font-normal shadow-sm cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="h-3 w-3 text-[#E8B4F8]" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
