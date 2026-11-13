"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import {
  DollarSign,
  Receipt,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  X,
} from "lucide-react";

interface SaleRecord {
  id: string;
  invoiceNumber: string;
  clientName: string;
  service: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
}

const INITIAL_SALES: SaleRecord[] = [
  {
    id: "sale-1",
    invoiceNumber: "INV-2024-8841",
    clientName: "Veloce Technologies Inc.",
    service: "Series A Tokens & Design Architecture",
    amount: 18500,
    date: "Nov 08, 2024",
    status: "Paid",
  },
  {
    id: "sale-2",
    invoiceNumber: "INV-2024-8842",
    clientName: "Nexus Protocol Foundation",
    service: "DEX Web3 Trading Engine UI Interface",
    amount: 14000,
    date: "Nov 03, 2024",
    status: "Pending",
  },
  {
    id: "sale-3",
    invoiceNumber: "INV-2024-8843",
    clientName: "Kroma Creative Studios",
    service: "SwiftUI Mobile Application Prototyping",
    amount: 6500,
    date: "Oct 24, 2024",
    status: "Paid",
  },
  {
    id: "sale-4",
    invoiceNumber: "INV-2024-8844",
    clientName: "Arcadia Health Systems",
    service: "Patient Telehealth Portal Design Audit",
    amount: 9800,
    date: "Oct 19, 2024",
    status: "Paid",
  },
  {
    id: "sale-5",
    invoiceNumber: "INV-2024-8845",
    clientName: "Synthetix Financial",
    service: "Design System Monthly Retainer (Month 2)",
    amount: 4000,
    date: "Oct 12, 2024",
    status: "Paid",
  },
  {
    id: "sale-6",
    invoiceNumber: "INV-2024-8846",
    clientName: "Orion Media Network",
    service: "Figma Variables Tokens Extraction Service",
    amount: 5200,
    date: "Sep 28, 2024",
    status: "Overdue",
  },
];

export default function SalesPage() {
  const [sales, setSales] = useState<SaleRecord[]>(INITIAL_SALES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Pending" | "Overdue">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filteredSales = sales.filter((item) => {
    const matchesSearch =
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.amount, 0);
  const paidRevenue = sales
    .filter((s) => s.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingRevenue = sales
    .filter((s) => s.status === "Pending")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const overdueRevenue = sales
    .filter((s) => s.status === "Overdue")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreateSale = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const client = (fd.get("client_name") as string) || "New Client";
    const service = (fd.get("service") as string) || "Retainer Service";
    const amount = Number(fd.get("amount") || 5000);
    const status = (fd.get("status") as SaleRecord["status"]) || "Pending";

    const newSale: SaleRecord = {
      id: `sale-${Date.now()}`,
      invoiceNumber: `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: client,
      service,
      amount,
      date: "Today",
      status,
    };

    setSales([newSale, ...sales]);
    setIsModalOpen(false);
    setToastMessage(`Logged transaction ${newSale.invoiceNumber} for ${client}`);
    setTimeout(() => setToastMessage(null), 3500);

    startTransition(async () => {
      // background action
    });
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-2"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#d41514] border border-[#d41514]/20 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d41514] animate-pulse" />
              BUSINESS MODE
            </span>
            <span className="text-[#71717a] text-xs font-mono">• Revenue Engine</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white mt-0.5">
            Sales &amp; Receivables
          </h1>
          <p className="text-xs text-[#a1a1aa] max-w-2xl font-normal">
            Track business sales transactions, invoice maturity cycles, client billing history, and real-time cash collections.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e0e11] hover:bg-white/[0.04] border border-white/[0.08] text-[#cdcbca] text-xs font-medium transition-all shadow-luxury">
            <Download className="h-3.5 w-3.5 text-[#d41514]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d41514] hover:bg-[#b5100f] text-white text-xs font-semibold shadow-luxury active:scale-[0.98] transition-all"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Record Sale</span>
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
            className="rounded-lg border border-[#d41514]/30 bg-[#0e0e11] p-3 text-xs text-[#d41514] flex items-center gap-2 shadow-luxury-elevated"
          >
            <CheckCircle2 className="h-4 w-4 text-[#d41514] shrink-0" />
            <span className="font-medium font-mono">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Sales KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Gross Sales (All Time)
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 flex items-center justify-center text-[#d41514]">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums block">
            ${totalRevenue.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#d41514] font-mono font-medium">+22.8%</span>
            <span className="text-[#71717a] text-[11px]">{sales.length} verified deals</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[84%]" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Collected Cash (Paid)
            </span>
            <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 flex items-center justify-center text-[#d41514]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums block">
            ${paidRevenue.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#d41514] font-mono font-medium">
              {Math.round((paidRevenue / (totalRevenue || 1)) * 100)}% Rate
            </span>
            <span className="text-[#71717a] text-[11px]">in bank vault</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[76%]" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Pending Maturity
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums block">
            ${pendingRevenue.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-amber-400 font-mono font-medium">Due in 5 days</span>
            <span className="text-[#71717a] text-[11px]">Nexus Protocol</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full w-[45%]" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Overdue Receivables
            </span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums block">
            ${overdueRevenue.toLocaleString()}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-rose-400 font-mono font-medium">1 Invoice</span>
            <span className="text-[#71717a] text-[11px]">Auto-reminder sent</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500/80 h-full rounded-full w-[25%]" />
          </div>
        </GlassCard>
      </div>

      {/* Sales Table Section */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 text-[#d41514]">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white tracking-tight">
                Sales Ledger &amp; Invoices
              </h3>
              <p className="text-xs text-[#a1a1aa] font-normal">
                Detailed record of all billable events, clients, and settlement statuses
              </p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sales..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#0a0a0d] text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
              />
            </div>

            <div className="flex items-center bg-[#0e0e11] border border-white/[0.08] p-0.5 rounded-lg shadow-luxury">
              {(["All", "Paid", "Pending", "Overdue"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    statusFilter === filter
                      ? "bg-[#d41514]/15 text-[#d41514] border border-[#d41514]/30"
                      : "text-[#71717a] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-[#71717a] font-mono uppercase tracking-[0.14em] text-[10px]">
                <th className="pb-3 font-medium">Invoice #</th>
                <th className="pb-3 font-medium">Client Company</th>
                <th className="pb-3 font-medium">Scope of Work</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-mono font-medium text-white">
                    {sale.invoiceNumber}
                  </td>
                  <td className="py-3.5 font-medium text-white">
                    {sale.clientName}
                  </td>
                  <td className="py-3.5 text-[#a1a1aa] max-w-xs truncate">
                    {sale.service}
                  </td>
                  <td className="py-3.5 font-mono text-[#71717a]">{sale.date}</td>
                  <td className="py-3.5">
                    {sale.status === "Paid" && (
                      <span className="inline-flex items-center gap-1 rounded bg-[#d41514]/10 px-2 py-0.5 text-[10px] font-mono font-medium text-[#d41514] border border-[#d41514]/20">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Paid
                      </span>
                    )}
                    {sale.status === "Pending" && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-amber-400 border border-amber-500/20">
                        <Clock className="h-2.5 w-2.5" />
                        Pending
                      </span>
                    )}
                    {sale.status === "Overdue" && (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-rose-400 border border-rose-500/20">
                        <AlertCircle className="h-2.5 w-2.5" />
                        Overdue
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-white tabular-nums">
                    ${sale.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      className="p-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-[#a1a1aa] hover:text-white transition-all inline-flex items-center gap-1 text-[11px] font-medium"
                      title="Download Invoice PDF"
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

      {/* Record Sale Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-lg rounded-lg bg-[#0e0e11] border border-white/[0.08] p-6 shadow-luxury-elevated"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 text-[#d41514] flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                      Record Sale Transaction
                    </h3>
                    <p className="text-[11px] text-[#71717a]">Add verified billable event to ledger</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-md text-[#71717a] hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSale} className="flex flex-col gap-4 mt-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                    Client Company Name
                  </label>
                  <input
                    name="client_name"
                    required
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                    Service / Contract Description
                  </label>
                  <input
                    name="service"
                    required
                    placeholder="e.g. Design System Retainer Q4"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                      Sale Amount (USD)
                    </label>
                    <input
                      name="amount"
                      type="number"
                      required
                      placeholder="8500"
                      className="w-full px-3.5 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                      Invoice Status
                    </label>
                    <select
                      name="status"
                      defaultValue="Pending"
                      className="w-full px-3.5 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury cursor-pointer"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-[#71717a] hover:text-white hover:bg-white/[0.04] text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#d41514] hover:bg-[#b5100f] text-white text-xs font-semibold shadow-luxury active:scale-[0.98] transition-all"
                  >
                    Save Sale Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
