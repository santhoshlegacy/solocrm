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
    client: "Kroma Studio",
    description: "SwiftUI Interactive Prototype & Design Direction",
    amount: "$6,500.00",
    dueDate: "Oct 18, 2024",
    status: "overdue",
  },
  {
    id: "tx-5",
    invoiceNumber: "INV-2024-005",
    client: "Pulse Commerce",
    description: "Shopify Store UI Architecture & Animation Toolkit",
    amount: "$8,500.00",
    dueDate: "Nov 22, 2024",
    status: "pending",
  },
  {
    id: "tx-6",
    invoiceNumber: "INV-2024-006",
    client: "Synthetix Data",
    description: "Q4 Design Retainer Retainer Commitment (Month 1)",
    amount: "$4,000.00",
    dueDate: "Nov 01, 2024",
    status: "paid",
  },
];

export default function PaymentsPage() {
  const [showCvv, setShowCvv] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");

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
            <h1 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight text-white/95">
              Cards &amp; Treasury
            </h1>
            <span className="rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#d41514] border border-[#d41514]/20">
              Live Vault
            </span>
          </div>
          <p className="text-xs text-[#cdcbca]/70 max-w-2xl font-normal">
            Manage encrypted virtual corporate cards, multi-currency client receivables, and autonomous liquidity pipelines.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#141414] hover:bg-[#1a1a1a] border border-[#222] hover:border-[#333] text-[#888] hover:text-white text-xs font-mono transition-colors">
            <CreditCard className="h-3.5 w-3.5 text-[#d41514]" />
            <span>+ Issue Virtual Card</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#d41514] hover:bg-[#b5100f] text-white text-xs font-medium active:scale-95 transition-colors">
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Top Bento Section: Virtual Card (7 cols) & Liquidity Vault (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Virtual Card Hub (7 cols) */}
        <GlassCard className="lg:col-span-7 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 text-[#d41514]">
                <Wifi className="h-4 w-4 rotate-90" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white/95">Solo Titanium Frosted Card</span>
                <span className="text-[10px] text-[#cdcbca]/50 uppercase tracking-wider font-normal">
                  Virtual Commercial • Multi-Currency
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-[#cdcbca]/10 text-[11px] text-[#cdcbca]/60 shadow-sm">
              <span className={`h-1.5 w-1.5 rounded-full ${isFrozen ? "bg-rose-400" : "bg-[#d41514] animate-pulse"}`} />
              <span className="font-normal">{isFrozen ? "Card Frozen" : "Apple Pay Active"}</span>
            </div>
          </div>

          {/* Highly Detailed 3D Obsidian Titanium Virtual Card */}
          <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(205,203,202,0.2)] bg-gradient-to-br from-[#181818] via-[#101010] to-[#080808] border border-[#cdcbca]/20 transition-transform hover:scale-[1.01] duration-300 my-2">
            {/* Specular Streaks */}
            <div className="pointer-events-none absolute -inset-full bg-[radial-gradient(circle_at_30%_20%,rgba(212,21,20,0.2)_0%,transparent_40%),radial-gradient(circle_at_80%_80%,rgba(205,203,202,0.08)_0%,transparent_45%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] opacity-70" />

            {/* Top Bar: Chip & Logo */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Realistic Gold EMV Microchip */}
                <div className="relative w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 shadow-md flex items-center justify-center overflow-hidden border border-amber-600/40">
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-50">
                    <span className="border-r border-b border-amber-900/60" />
                    <span className="border-b border-amber-900/60" />
                    <span className="border-r border-amber-900/60" />
                    <span />
                  </div>
                  <div className="w-5 h-4 rounded-sm border border-amber-900/40" />
                </div>
                <Wifi className="h-5 w-5 text-[#cdcbca]/50 rotate-90" />
              </div>

              <div className="flex items-center gap-1.5 text-right">
                <span className="font-display text-lg tracking-tighter text-white font-black italic">
                  SOLO
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#d41514] bg-[#d41514]/15 px-1.5 py-0.5 rounded font-mono font-medium border border-[#d41514]/30">
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
                <span className="text-[#d41514] font-semibold tracking-wider">8842</span>
              </div>
            </div>

            {/* Bottom Bar: Details & Visa Platinum */}
            <div className="relative z-10 flex items-end justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider text-[#cdcbca]/50 font-normal">Cardholder</span>
                <span className="font-medium text-white/95 uppercase tracking-wide">Santhosh Kumar</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-[#cdcbca]/50 font-normal">Expires</span>
                  <span className="font-medium text-white/95 font-mono">08/28</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-wider text-[#cdcbca]/50 font-normal">CVV</span>
                  <span className="font-mono font-medium text-[#d41514]">
                    {showCvv ? "492" : "•••"}
                  </span>
                </div>
                <div className="flex flex-col items-end pl-2">
                  <span className="font-display text-base font-black tracking-tighter text-white italic leading-none">
                    VISA
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-[#cdcbca]/50 font-normal">
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
              className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] transition-all text-xs shadow-sm"
            >
              <Lock className={`h-4 w-4 ${isFrozen ? "text-rose-400" : "text-[#d41514]"}`} />
              <span className="text-[#d4d4d8] font-medium">{isFrozen ? "Unfreeze" : "Freeze Card"}</span>
            </button>
            <button
              onClick={() => setShowCvv(!showCvv)}
              className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] transition-all text-xs shadow-sm"
            >
              {showCvv ? <EyeOff className="h-4 w-4 text-[#d41514]" /> : <Eye className="h-4 w-4 text-[#d41514]" />}
              <span className="text-[#d4d4d8] font-medium">{showCvv ? "Hide CVV" : "Show Details"}</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] transition-all text-xs shadow-sm">
              <Sliders className="h-4 w-4 text-[#71717a]" />
              <span className="text-[#d4d4d8] font-medium font-mono">Limit: $10k</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] transition-all text-xs shadow-sm">
              <Smartphone className="h-4 w-4 text-[#d41514]" />
              <span className="text-[#d4d4d8] font-medium">Apple Wallet</span>
            </button>
          </div>
        </GlassCard>

        {/* Multi-Rail Liquidity Vault (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] font-medium">
                  Consolidated Liquidity
                </span>
                <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
                  $48,270.00
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-[#e03837] bg-[#d41514]/10 border border-[#d41514]/25 px-2.5 py-1 rounded-md font-mono font-medium">
                <ArrowUpRight className="h-3 w-3" />
                +18.4% mo/mo
              </span>
            </div>

            {/* Account Balances Breakdown */}
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.03] text-[#d41514] flex items-center justify-center font-bold text-xs border border-white/[0.07]">
                    $
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Stripe Corporate (USD)</span>
                    <span className="text-[10px] font-mono text-[#71717a]">Auto-payouts scheduled daily</span>
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-white tabular-nums">$28,450.00</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.03] text-[#d41514] flex items-center justify-center font-bold text-xs border border-white/[0.07]">
                    M
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Mercury FDIC Checking</span>
                    <span className="text-[10px] font-mono text-[#71717a]">Primary operating reserve</span>
                  </div>
                </div>
                <span className="font-display text-sm font-bold text-white tabular-nums">$14,820.00</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.04] text-[#cdcbca] flex items-center justify-center font-medium text-xs border border-[#cdcbca]/10">
                    €
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white/95">Wise Multi-Currency EUR</span>
                    <span className="text-[10px] text-[#cdcbca]/50 font-normal">€4,600.00 @ 1.087 FX</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-medium text-white/95 tabular-nums">$5,000.00</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 text-[#d41514] flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-white/95">Instant Wire Routing</span>
                <span className="text-[11px] text-[#cdcbca]/50 font-normal">ACH &amp; SEPA Auto-Clear enabled</span>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-[#d41514] bg-[#d41514]/10 px-2 py-0.5 rounded-full border border-[#d41514]/20">
              ZERO FEE
            </span>
          </GlassCard>
        </div>
      </div>

      {/* Transactions & Invoices Table Section */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d41514]/10 border border-[#d41514]/20 text-[#d41514]">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white/95 tracking-tight">
                Receivables &amp; Transaction History
              </h3>
              <p className="text-xs text-[#cdcbca]/60 font-normal">
                Track client payments, outstanding milestones, and billing maturity
              </p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#cdcbca]/50 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-[#cdcbca]/10 bg-white/[0.02] text-xs text-white/95 placeholder:text-[#cdcbca]/40 focus:outline-none focus:ring-1 focus:ring-[#d41514]/50 shadow-sm"
              />
            </div>

            <div className="flex items-center bg-[#141414] border border-[#222] p-0.5 rounded-md">
              {(["all", "paid", "pending", "overdue"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors ${
                    statusFilter === st
                      ? "bg-[#d41514]/15 text-white border-l-2 border-l-[#d41514] border-t border-r border-b border-[#d41514]/30"
                      : "text-[#888] hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#cdcbca]/10 text-[#cdcbca]/50 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-normal">Invoice #</th>
                <th className="pb-3 font-normal">Client</th>
                <th className="pb-3 font-normal">Description</th>
                <th className="pb-3 font-normal">Due Date</th>
                <th className="pb-3 font-normal">Status</th>
                <th className="pb-3 font-normal text-right">Amount</th>
                <th className="pb-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cdcbca]/10">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-mono text-white/95 font-medium">
                    {tx.invoiceNumber}
                  </td>
                  <td className="py-3.5 font-medium text-white/95">{tx.client}</td>
                  <td className="py-3.5 text-[#cdcbca]/70 max-w-xs truncate font-normal">{tx.description}</td>
                  <td className="py-3.5 text-[#cdcbca]/50 font-normal">{tx.dueDate}</td>
                  <td className="py-3.5">
                    {tx.status === "paid" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#d41514] border border-[#d41514]/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#d41514]" />
                        Paid
                      </span>
                    )}
                    {tx.status === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/20">
                        <Clock className="h-2.5 w-2.5" />
                        Pending
                      </span>
                    )}
                    {tx.status === "overdue" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-medium text-rose-300 border border-rose-500/20">
                        <AlertCircle className="h-2.5 w-2.5" />
                        Overdue
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right font-mono font-medium text-white/95 tabular-nums">
                    {tx.amount}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      className="p-1.5 rounded-lg border border-[#cdcbca]/10 bg-white/[0.02] hover:bg-white/[0.04] text-[#cdcbca]/70 hover:text-white transition-all inline-flex items-center gap-1 text-[11px] font-normal shadow-sm"
                      title="Download PDF"
                    >
                      <Download className="h-3 w-3" />
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
