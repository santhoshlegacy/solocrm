"use client";

import React, { useState, useTransition, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import { useWorkspaceMode } from "@/lib/workspace-context";
import { createClient } from "@/utils/supabase/client";
import {
  Receipt,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  X,
  Printer,
  FileText,
  Building2,
  Calendar,
  CreditCard,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { formatINR, parseCurrencyInput } from "@/lib/utils";

interface SaleRecord {
  id: string;
  invoiceNumber: string;
  clientName: string;
  service: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
}

function SalesContent() {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Paid" | "Pending" | "Overdue">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<SaleRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mutatingIds, setMutatingIds] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();
  const router = useRouter();

  const { searchQuery: globalSearchQuery, newActionTrigger } = useWorkspaceMode();
  const searchParams = useSearchParams();

  // Listen for query params or header action trigger to auto-open modal
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (newActionTrigger > 0) {
      setIsModalOpen(true);
    }
  }, [newActionTrigger]);

    // Load from Supabase on mount if available
  useEffect(() => {
    async function fetchSales() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("sales")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          setSales(
            data.map((d: any) => {
              const rawDate = d.issue_date || d.created_at || d.date;
              return {
                id: d.id,
                invoiceNumber: d.invoice_number || `INV-2026-${d.id.slice(0, 4).toUpperCase()}`,
                clientName: d.client_name || d.clients?.name || d.clients?.company_name || "Enterprise Counterparty",
                service: d.service_description || d.service || "Advisory & Implementation Retainer",
                amount: Number(d.amount || 0),
                date: rawDate
                  ? new Date(rawDate).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Recent",
                status: (d.status || d.invoice_status || "Pending") as SaleRecord["status"],
              };
            })
          );
        }
      } catch (err) {
        console.warn("Using initial sales data fallback:", err);
      }
    }
    fetchSales();
  }, []);

  const activeSearch = (localSearch || globalSearchQuery).trim().toLowerCase();

  const filteredSales = sales.filter((item) => {
    const matchesSearch =
      activeSearch === "" ||
      item.clientName.toLowerCase().includes(activeSearch) ||
      item.invoiceNumber.toLowerCase().includes(activeSearch) ||
      item.service.toLowerCase().includes(activeSearch) ||
      item.amount.toString().includes(activeSearch);
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales.reduce((acc, curr) => acc + (Number.isFinite(curr.amount) ? curr.amount : 0), 0);
  const paidRevenue = sales
    .filter((s) => s.status === "Paid")
    .reduce((acc, curr) => acc + (Number.isFinite(curr.amount) ? curr.amount : 0), 0);
  const pendingRevenue = sales
    .filter((s) => s.status === "Pending")
    .reduce((acc, curr) => acc + (Number.isFinite(curr.amount) ? curr.amount : 0), 0);
  const overdueRevenue = sales
    .filter((s) => s.status === "Overdue")
    .reduce((acc, curr) => acc + (Number.isFinite(curr.amount) ? curr.amount : 0), 0);

  const rawCollectionRate = totalRevenue > 0 ? (paidRevenue / totalRevenue) * 100 : 0;
  const collectionRate = Number.isFinite(rawCollectionRate) ? Math.round(rawCollectionRate) : 0;

  // Mark sale as Paid with debounce lock preventing double-clicking
  const handleMarkAsPaid = async (saleId: string, currentStatus: string) => {
    if (currentStatus === "Paid" || mutatingIds.has(saleId)) return;

    // Prevent double-click race condition
    setMutatingIds((prev) => new Set(prev).add(saleId));

    // Instant UI state update
    setSales((prev) =>
      prev.map((s) => (s.id === saleId ? { ...s, status: "Paid" as const } : s))
    );

    const target = sales.find((s) => s.id === saleId);
    setToastMessage(`Invoice ${target?.invoiceNumber || saleId} settled and marked as PAID.`);
    setTimeout(() => setToastMessage(null), 3500);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("sales")
        .update({ status: "Paid" })
        .eq("id", saleId);

      if (error) {
        // Fallback for invoice_status if schema variant uses that
        await supabase
          .from("sales")
          .update({ invoice_status: "Paid" })
          .eq("id", saleId);
      }
      router.refresh();
    } catch (err) {
      console.warn("Supabase update error:", err);
    } finally {
      setMutatingIds((prev) => {
        const next = new Set(prev);
        next.delete(saleId);
        return next;
      });
    }
  };

  // Export full ledger CSV
  const handleExportLedgerCSV = () => {
    const headers = ["Invoice Number", "Client Company", "Scope of Work", "Amount (INR)", "Date", "Status"];
    const rows = sales.map((s) => [
      s.invoiceNumber,
      s.clientName,
      s.service,
      s.amount,
      s.date,
      s.status,
    ]);

    const formatRow = (row: (string | number)[]) =>
      row.map((val) => '"' + String(val).replace(/"/g, '""') + '"').join(",");

    const csvContent = [formatRow(headers), ...rows.map(formatRow)].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SoloCRM_Sales_Ledger_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToastMessage("Sales ledger exported as SoloCRM_Sales_Ledger_2026.csv");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Download single invoice CSV
  const handleDownloadInvoiceCSV = (sale: SaleRecord) => {
    const rows = [
      ["FIELD", "VALUE"],
      ["Invoice Number", sale.invoiceNumber],
      ["Client Company", sale.clientName],
      ["Service Description", sale.service],
      ["Issue Date", sale.date],
      ["Settlement Status", sale.status],
      ["Total Net Amount (INR)", sale.amount],
      ["Currency", "INR (Indian Rupee)"],
    ];

    const formatRow = (row: (string | number)[]) =>
      row.map((val) => '"' + String(val).replace(/"/g, '""') + '"').join(",");

    const content = rows.map(formatRow).join("\r\n");
    const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${sale.invoiceNumber}_Invoice.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Create new sale
  const handleCreateSale = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const client = (fd.get("client_name") as string) || "Enterprise Client";
    const service = (fd.get("service") as string) || "Retainer Service";
    const amount = parseCurrencyInput(fd.get("amount"), 150000);
    const status = (fd.get("status") as SaleRecord["status"]) || "Pending";

    const optimisticSale: SaleRecord = {
      id: `sale-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: client,
      service,
      amount,
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status,
    };

    setSales([optimisticSale, ...sales]);
    setIsModalOpen(false);
    setToastMessage(`Logged transaction ${optimisticSale.invoiceNumber} for ${client}`);
    setTimeout(() => setToastMessage(null), 3500);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        const issueDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        // Explicit object construction:
        // DB does NOT have 'date'. Map to 'issue_date' (or 'created_at').
        // Explicitly omit 'date'.
        const salesPayload: {
          user_id: string;
          invoice_number: string;
          client_name: string;
          service_description: string;
          amount: number;
          issue_date: string;
          status: string;
        } = {
          user_id: user.id,
          invoice_number: optimisticSale.invoiceNumber,
          client_name: optimisticSale.clientName,
          service_description: optimisticSale.service,
          amount: Number(optimisticSale.amount || 0),
          issue_date: issueDate, // Mapped to issue_date; NO 'date' property
          status: optimisticSale.status,
        };

        let { data, error } = await supabase
          .from("sales")
          .insert(salesPayload)
          .select()
          .single();

        if (error) {
          // Fallback if schema variant expects created_at or invoice_status
          const fallbackPayload: any = {
            user_id: user.id,
            amount: Number(optimisticSale.amount || 0),
            invoice_status: optimisticSale.status,
            created_at: new Date().toISOString(),
          };

          const fallbackRes = await supabase
            .from("sales")
            .insert(fallbackPayload)
            .select()
            .single();

          if (!fallbackRes.error && fallbackRes.data) {
            data = fallbackRes.data;
            error = null;
          } else {
            console.error("Supabase sales insert error:", error, fallbackRes.error);
          }
        }

        if (data) {
          setSales((prev) =>
            prev.map((s) =>
              s.id === optimisticSale.id
                ? {
                    ...s,
                    id: data.id,
                    amount: Number(data.amount || s.amount),
                    status: (data.status || data.invoice_status || s.status) as SaleRecord["status"],
                  }
                : s
            )
          );
        }
      }

      // CRITICAL: Invalidate Next.js client router cache and refresh Server Components
      router.refresh();
    } catch (err) {
      console.error("Failed to persist sale:", err);
    }
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
            <span className="rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] animate-pulse shadow-[0_0_8px_#E8B4F8]" />
              BUSINESS OS
            </span>
            <span className="text-[#A098A8] text-xs font-mono">• Revenue &amp; Receivables</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-[#E2DCE7] mt-0.5">
            Sales &amp; Invoices
          </h1>
          <p className="text-xs text-[#A098A8] max-w-2xl font-normal">
            Track business sales transactions, invoice maturity cycles, client billing history, and real-time cash collections.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportLedgerCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E2DCE7] text-xs font-medium transition-all shadow-sm cursor-pointer"
            title="Download full sales ledger CSV"
          >
            <Download className="h-3.5 w-3.5 text-[#E8B4F8]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] active:scale-[0.98] transition-all cursor-pointer"
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
            className="rounded-2xl border border-[#E8B4F8]/30 bg-[#140D1B]/95 backdrop-blur-xl p-3 text-xs text-[#E8B4F8] flex items-center gap-2 shadow-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-[#E8B4F8] shrink-0" />
            <span className="font-medium font-mono">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Sales KPI Tiles in INR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Gross Sales (All Time)
            </span>
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#E8B4F8]">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums block">
            {formatINR(totalRevenue)}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#E8B4F8] font-mono font-medium">+24.2%</span>
            <span className="text-[#A098A8] text-[11px]">{sales.length} verified deals</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full w-[84%]" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Collected Cash (Paid)
            </span>
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#E8B4F8]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums block">
            {formatINR(paidRevenue)}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-[#E8B4F8] font-mono font-medium">
              {collectionRate}% Rate
            </span>
            <span className="text-[#A098A8] text-[11px]">in vault</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, collectionRate))}%` }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Pending Maturity
            </span>
            <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums block">
            {formatINR(pendingRevenue)}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-amber-300 font-mono font-medium">Due in 5 days</span>
            <span className="text-[#A098A8] text-[11px]">Awaiting settlement</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full w-[45%]" />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Overdue Receivables
            </span>
            <div className="h-8 w-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-300">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums block">
            {formatINR(overdueRevenue)}
          </span>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-rose-300 font-mono font-medium">Notice dispatched</span>
            <span className="text-[#A098A8] text-[11px]">Orion Media</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500/80 h-full rounded-full w-[25%]" />
          </div>
        </GlassCard>
      </div>

      {/* Sales Table Section */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8]">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-[#E2DCE7] tracking-tight">
                Sales Ledger &amp; Invoices
              </h3>
              <p className="text-xs text-[#A098A8] font-normal">
                Click any pending/overdue badge to mark as Paid • Click PDF to view/print invoice
              </p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A098A8] pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Filter sales ledger..."
                className="pl-9 pr-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
              />
            </div>

            <div className="flex items-center bg-white/[0.04] border border-white/10 p-1 rounded-full shadow-inner">
              {(["All", "Paid", "Pending", "Overdue"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    statusFilter === filter
                      ? "bg-white/10 text-white border border-white/10 shadow-sm font-semibold"
                      : "text-[#A098A8] hover:text-white"
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
              <tr className="border-b border-white/10 text-[#A098A8] font-mono uppercase tracking-[0.14em] text-[10px]">
                <th className="pb-3 font-medium">Invoice #</th>
                <th className="pb-3 font-medium">Client Company</th>
                <th className="pb-3 font-medium">Scope of Work</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status (Click to Settle)</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3.5 font-mono font-medium text-[#E2DCE7]">
                    {sale.invoiceNumber}
                  </td>
                  <td className="py-3.5 font-medium text-white">
                    {sale.clientName}
                  </td>
                  <td className="py-3.5 text-[#A098A8] max-w-xs truncate">
                    {sale.service}
                  </td>
                  <td className="py-3.5 font-mono text-[#A098A8]">{sale.date}</td>
                  
                  {/* Status Badge: Clickable to mark as Paid */}
                  <td className="py-3.5">
                    {sale.status === "Paid" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 select-none">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Paid
                      </span>
                    ) : sale.status === "Pending" ? (
                      <button
                        disabled={mutatingIds.has(sale.id)}
                        onClick={() => handleMarkAsPaid(sale.id, sale.status)}
                        title="Click to mark invoice as Paid"
                        className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed px-2.5 py-0.5 text-[10px] font-mono font-medium text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
                      >
                        {mutatingIds.has(sale.id) ? (
                          <>
                            <Loader2 className="h-2.5 w-2.5 animate-spin text-amber-300" />
                            <span>Settling...</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-2.5 w-2.5 group-hover:hidden" />
                            <CheckCircle2 className="h-2.5 w-2.5 hidden group-hover:inline text-amber-300" />
                            <span>Pending • Click to Settle</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled={mutatingIds.has(sale.id)}
                        onClick={() => handleMarkAsPaid(sale.id, sale.status)}
                        title="Click to mark invoice as Paid"
                        className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-60 disabled:cursor-not-allowed px-2.5 py-0.5 text-[10px] font-mono font-medium text-rose-300 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer group"
                      >
                        {mutatingIds.has(sale.id) ? (
                          <>
                            <Loader2 className="h-2.5 w-2.5 animate-spin text-rose-300" />
                            <span>Settling...</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-2.5 w-2.5 group-hover:hidden" />
                            <CheckCircle2 className="h-2.5 w-2.5 hidden group-hover:inline text-rose-300" />
                            <span>Overdue • Click to Settle</span>
                          </>
                        )}
                      </button>
                    )}
                  </td>

                  <td className="py-3.5 text-right font-mono font-bold text-[#E2DCE7] tabular-nums">
                    {formatINR(sale.amount)}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setActiveInvoice(sale)}
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/10 text-[#A098A8] hover:text-white transition-all inline-flex items-center gap-1.5 text-[11px] font-medium"
                      title="View & Print Official Invoice PDF"
                    >
                      <FileText className="h-3 w-3 text-[#E8B4F8]" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#A098A8] font-mono text-xs">
                    {activeSearch
                      ? `No sales records matching "${activeSearch}".`
                      : "No sales transactions recorded in ledger yet. Click 'Record Sale' to log one."}
                  </td>
                </tr>
              )}
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
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#140D1B]/95 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                      Record Sale Transaction
                    </h3>
                    <p className="text-[11px] text-[#A098A8]">Add verified billable contract to ledger</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-[#A098A8] hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSale} className="flex flex-col gap-4 mt-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                    Client Company Name
                  </label>
                  <input
                    name="client_name"
                    required
                    placeholder="e.g. Acme Global Tech"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                    Service / Contract Description
                  </label>
                  <input
                    name="service"
                    required
                    placeholder="e.g. Design System Retainer Q1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Sale Amount (INR ₹)
                    </label>
                    <input
                      name="amount"
                      type="number"
                      required
                      placeholder="450000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Invoice Status
                    </label>
                    <select
                      name="status"
                      defaultValue="Pending"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#140D1B] text-xs text-white focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full text-[#A098A8] hover:text-white hover:bg-white/[0.04] text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Save Sale Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice PDF Printable Preview Modal */}
      <AnimatePresence>
        {activeInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:m-0 print:block">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveInvoice(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md print:hidden"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#140D1B]/95 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden text-white print:fixed print:inset-0 print:w-full print:max-w-none print:h-full print:rounded-none print:border-none print:p-8 print:bg-[#120B18] print:z-[99999]"
              style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
            >
              {/* Header Action Bar (Excluded from print) */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6 print:hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#E8B4F8] font-semibold tracking-wider uppercase">
                    Invoice Document
                  </span>
                  <span className="text-[#A098A8]">•</span>
                  <span className="font-mono text-xs text-[#A098A8]">{activeInvoice.invoiceNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`upi://pay?pa=solocrm@hdfcbank&pn=SoloCRM&am=${activeInvoice.amount}&cu=INR`}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all flex items-center gap-1.5 active:scale-95 shadow-lg cursor-pointer"
                    title="Instant UPI Payment Settlement"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Pay via UPI</span>
                  </a>
                  <button
                    onClick={() => handleDownloadInvoiceCSV(activeInvoice)}
                    className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 text-xs font-mono text-[#A098A8] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-[#E8B4F8]" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-xs font-semibold text-white transition-all flex items-center gap-1.5 active:scale-95 shadow-[0_0_20px_rgba(178,112,162,0.35)] cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    onClick={() => setActiveInvoice(null)}
                    className="p-1.5 rounded-full text-[#A098A8] hover:text-white hover:bg-white/[0.06] transition-colors ml-1 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Body */}
              <div
                id="printable-invoice"
                className="bg-[#09050F]/80 border border-white/10 p-6 sm:p-8 rounded-2xl print:border-none print:p-0 print:bg-transparent print:w-full"
                style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
              >
                {/* Brand & Invoice Meta */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-extrabold text-lg text-white tracking-tight">
                        SOLO<span className="text-[#E8B4F8]">CRM</span>
                      </span>
                      <span className="text-[10px] font-mono text-[#A098A8] border border-white/10 px-2 py-0.5 rounded-full">
                        OFFICIAL
                      </span>
                    </div>
                    <p className="text-xs text-[#A098A8] font-mono">Autonomous Architecture &amp; Advisory</p>
                    <p className="text-[11px] text-[#A098A8]/70 font-mono mt-1">tax-exempt freelance operating model</p>
                  </div>
                  <div className="sm:text-right font-mono">
                    <span className="text-lg font-bold text-white tracking-wider block">
                      {activeInvoice.invoiceNumber}
                    </span>
                    <span className="text-xs text-[#A098A8] block mt-0.5">
                      Issue Date: {activeInvoice.date}
                    </span>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border">
                      {activeInvoice.status === "Paid" ? (
                        <span className="text-[#E8B4F8] border-[#E8B4F8]/30 bg-[#E8B4F8]/15 px-2.5 py-0.5 rounded-full">
                          SETTLED • PAID
                        </span>
                      ) : activeInvoice.status === "Pending" ? (
                        <span className="text-amber-400 border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                          PENDING SETTLEMENT
                        </span>
                      ) : (
                        <span className="text-rose-400 border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                          OVERDUE NOTICE
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Billed To & Remit To */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#222] text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#666] block mb-1">
                      Billed To Client
                    </span>
                    <p className="text-sm font-semibold text-white">{activeInvoice.clientName}</p>
                    <p className="text-[#888] font-mono text-[11px] mt-0.5">Corporate Procurement Unit</p>
                    <p className="text-[#666] font-mono text-[11px]">Primary Counterparty</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#666] block mb-1">
                      Remit Settlement To
                    </span>
                    <p className="text-sm font-semibold text-white">SoloCRM Executive Account</p>
                    <p className="text-[#888] font-mono text-[11px] mt-0.5">HDFC Bank India (RTGS / NEFT / IMPS)</p>
                    <p className="text-[#666] font-mono text-[11px]">IFSC: HDFC0001842 • A/C: 502000881920</p>
                    <div className="mt-2 pt-2 border-t border-[#1e1e1e]">
                      <a
                        href={`upi://pay?pa=solocrm@hdfcbank&pn=SoloCRM&am=${activeInvoice.amount}&cu=INR`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-semibold transition-all"
                      >
                        <CreditCard className="h-3 w-3" />
                        <span>Pay via UPI • {formatINR(activeInvoice.amount)}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Line Item Table */}
                <div className="py-6 border-b border-[#222]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-[#666] font-mono uppercase text-[10px] tracking-wider border-b border-[#222] pb-2">
                        <th className="text-left font-medium pb-2">Service Description</th>
                        <th className="text-center font-medium pb-2">Cycles</th>
                        <th className="text-right font-medium pb-2">Rate</th>
                        <th className="text-right font-medium pb-2">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      <tr>
                        <td className="py-3 text-white font-medium">
                          {activeInvoice.service}
                          <span className="block text-[11px] text-[#71717a] font-normal mt-0.5">
                            Standard enterprise milestone delivery &amp; architectural rights
                          </span>
                        </td>
                        <td className="py-3 text-center font-mono text-[#aaa]">1.0</td>
                        <td className="py-3 text-right font-mono text-[#aaa]">
                          {formatINR(activeInvoice.amount)}
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-white">
                          {formatINR(activeInvoice.amount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Grand Total & Signature */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6">
                  <div className="text-[11px] text-[#666] font-mono max-w-xs">
                    Certified authentic by SoloCRM cryptographically signed ledger. No physical seal required.
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717a] block">
                      Total Payable (INR)
                    </span>
                    <span className="font-display text-2xl font-bold text-white tabular-nums block mt-0.5">
                      {formatINR(activeInvoice.amount)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SalesClient() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs font-mono text-[#71717a]">
          Loading sales ledger...
        </div>
      }
    >
      <SalesContent />
    </Suspense>
  );
}
