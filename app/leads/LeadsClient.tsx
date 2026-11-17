"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import {
  Filter,
  Plus,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Inbox,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateLeadStatus, createLead } from "@/actions/leads";
import { CopyPortalButton } from "@/components/portal/CopyPortalButton";
import { useWorkspaceMode } from "@/lib/workspace-context";
import { createClient } from "@/utils/supabase/client";
import { formatINR, parseCurrencyInput } from "@/lib/utils";

export interface LeadItem {
  id: string;
  portal_token: string;
  client: string;
  contact: string;
  initials: string;
  tag: string;
  tagVariant?: "high" | "scoping" | "proposal" | "won" | "neutral";
  description: string;
  tags: string[];
  rawValue: number;
  budget: string;
  timeAgo: string;
  progress?: number;
  progressLabel?: string;
  status: "Contacted" | "In Progress" | "Won";
}

function LeadsPipelineContent() {
  const searchParams = useSearchParams();
  const { searchQuery, newActionTrigger } = useWorkspaceMode();

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"values" | "stages">("values");
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  // Live Supabase Fetch
  useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: LeadItem[] = data.map((d: any) => {
            const rawVal = Number(d.budget ?? d.value ?? 0);
            const rawStatus = d.status || "Contacted";
            const status: LeadItem["status"] =
              rawStatus === "Pitched" || rawStatus === "In Progress"
                ? "In Progress"
                : rawStatus === "Won"
                ? "Won"
                : "Contacted";
            const leadName = d.client_name || d.name || "Enterprise Counterparty";

            return {
              id: d.id,
              portal_token: d.portal_token || d.id,
              client: leadName,
              contact: d.contact_name || "Lead Executive",
              initials: d.initials || leadName.substring(0, 2).toUpperCase(),
              tag:
                status === "Won"
                  ? "Closed Won"
                  : status === "In Progress"
                  ? "In Negotiation"
                  : "New Lead",
              tagVariant:
                status === "Won" ? "won" : status === "In Progress" ? "proposal" : "high",
              description:
                d.description ||
                d.project_details ||
                "Autonomous UI/UX design architecture & frontend engineering.",
              tags:
                Array.isArray(d.tags) && d.tags.length > 0
                  ? d.tags
                  : ["Full-Stack", "Architecture"],
              rawValue: rawVal,
              budget: formatINR(rawVal),
              timeAgo: d.created_at
                ? new Date(d.created_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })
                : "Recent",
              progress:
                d.progress ?? (status === "Won" ? 100 : status === "In Progress" ? 65 : 25),
              progressLabel:
                status === "Won"
                  ? "Contract Signed"
                  : status === "In Progress"
                  ? "Proposal In Review"
                  : "Scoping Matrix",
              status,
            };
          });
          setLeads(mapped);
        } else {
          setLeads([]);
        }
      } catch (err) {
        console.warn("Supabase leads fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeads();
  }, []);

  // Listen to ⌘K quick action or URL trigger
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

  // Real-time filtering by ⌘K search query & discipline dropdown
  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lead.client.toLowerCase().includes(q) ||
      lead.contact.toLowerCase().includes(q) ||
      lead.description.toLowerCase().includes(q) ||
      lead.tags.some((t) => t.toLowerCase().includes(q));

    const matchesDiscipline =
      disciplineFilter === "all" ||
      lead.tags.some((t) => t.toLowerCase().includes(disciplineFilter.toLowerCase())) ||
      lead.description.toLowerCase().includes(disciplineFilter.toLowerCase());

    return matchesSearch && matchesDiscipline;
  });

  const contactedLeads = filteredLeads.filter((l) => l.status === "Contacted");
  const inProgressLeads = filteredLeads.filter((l) => l.status === "In Progress");
  const wonLeads = filteredLeads.filter((l) => l.status === "Won");

  // Dynamic Metrics with safe checks against division by zero & NaN
  const totalPipeline = leads.reduce((acc, curr) => acc + (Number.isFinite(curr.rawValue) ? curr.rawValue : 0), 0);
  const contactedValue = contactedLeads.reduce((acc, curr) => acc + (Number.isFinite(curr.rawValue) ? curr.rawValue : 0), 0);
  const inProgressValue = inProgressLeads.reduce((acc, curr) => acc + (Number.isFinite(curr.rawValue) ? curr.rawValue : 0), 0);
  const wonValue = wonLeads.reduce((acc, curr) => acc + (Number.isFinite(curr.rawValue) ? curr.rawValue : 0), 0);

  const rawWinRate = leads.length > 0 ? (wonLeads.length / leads.length) * 100 : 0;
  const winRate = Number.isFinite(rawWinRate) ? Math.round(rawWinRate) : 0;

  const rawAvgDealSize = leads.length > 0 ? totalPipeline / leads.length : 0;
  const avgDealSize = Number.isFinite(rawAvgDealSize) ? Math.round(rawAvgDealSize) : 0;

  // Live Stage Transition Logic with Optimistic UI & Automatic Revert on Supabase Failure
  const handleMoveStatus = async (id: string, newStatus: LeadItem["status"]) => {
    const previousLeadsSnapshot = [...leads];
    const previousLead = leads.find((l) => l.id === id);
    if (!previousLead || previousLead.status === newStatus) return;

    // 1. Instant optimistic UI update so card physically moves columns immediately
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          return {
            ...lead,
            status: newStatus,
            tag:
              newStatus === "Won"
                ? "Closed Won"
                : newStatus === "In Progress"
                ? "In Negotiation"
                : "New Lead",
            tagVariant:
              newStatus === "Won" ? "won" : newStatus === "In Progress" ? "proposal" : "high",
            progress: newStatus === "Won" ? 100 : newStatus === "In Progress" ? 65 : 25,
            progressLabel:
              newStatus === "Won"
                ? "Contract Signed"
                : newStatus === "In Progress"
                ? "Proposal In Review"
                : "Scoping Matrix",
          };
        }
        return lead;
      })
    );

    // 2. Direct Supabase update with error handling & immediate rollback
    try {
      const supabase = createClient();
      const dbStatus = newStatus === "In Progress" ? "Pitched" : newStatus;
      const { error } = await supabase.from("leads").update({ status: dbStatus }).eq("id", id);
      if (error) {
        throw error;
      }
      await updateLeadStatus(id, newStatus);
      router.refresh();
      setNotification(`Moved "${previousLead.client}" to ${newStatus}`);
      setTimeout(() => setNotification(null), 3500);
    } catch (err: any) {
      console.error("Supabase lead update failed, reverting UI:", err);
      // REVERT local state back to previous column immediately
      setLeads(previousLeadsSnapshot);
      setNotification(`Failed to move "${previousLead.client}". Reverted to ${previousLead.status}.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleCreateLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const client = (formData.get("client_name") as string) || "New Client";
    const title = (formData.get("project_title") as string) || "UI/UX & Next.js Architecture";
    const rawVal = parseCurrencyInput(formData.get("value"), 450000);
    const status = (formData.get("status") as LeadItem["status"]) || "Contacted";

    const generatedToken =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `portal-${Date.now()}`;

    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      portal_token: generatedToken,
      client,
      contact: "Direct Inbound • Primary Stakeholder",
      initials: client.slice(0, 2).toUpperCase(),
      tag: status === "Won" ? "Closed Won" : status === "In Progress" ? "In Negotiation" : "New Lead",
      tagVariant: status === "Won" ? "won" : status === "In Progress" ? "proposal" : "high",
      description: title,
      tags: ["Full-Stack", "Architecture"],
      rawValue: rawVal,
      budget: formatINR(rawVal),
      timeAgo: "Today",
      progress: status === "Won" ? 100 : status === "In Progress" ? 65 : 25,
      progressLabel: status === "Won" ? "Contract Signed" : status === "In Progress" ? "Proposal In Review" : "Scoping Matrix",
      status,
    };

    setLeads([newLead, ...leads]);
    setIsModalOpen(false);
    setNotification(`Successfully registered "${client}" in pipeline.`);
    setTimeout(() => setNotification(null), 3500);

    formData.set("portal_token", generatedToken);
    startTransition(async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          // Explicit object construction - strictly strip 'initials' (UI-only field)
          const primaryPayload: any = {
            user_id: user.id,
            client_name: newLead.client,
            contact_name: newLead.contact,
            description: newLead.description,
            budget: Number(newLead.rawValue || 0),
            status: newLead.status,
            tags: newLead.tags,
            progress: newLead.progress ?? 25,
          };
          if (newLead.portal_token) {
            primaryPayload.portal_token = newLead.portal_token;
          }

          let { data, error } = await supabase
            .from("leads")
            .insert(primaryPayload)
            .select()
            .single();

          if (error) {
            // Fallback for schema variants with column 'name' instead of 'client_name'
            const fallbackPayload: any = {
              user_id: user.id,
              name: newLead.client,
              project_details: newLead.description,
              contact_name: newLead.contact,
              status: newLead.status === "In Progress" ? "Pitched" : newLead.status,
              value: Number(newLead.rawValue || 0),
              tags: newLead.tags,
              progress: newLead.progress ?? 25,
            };
            if (newLead.portal_token) {
              fallbackPayload.portal_token = newLead.portal_token;
            }

            const fallbackRes = await supabase
              .from("leads")
              .insert(fallbackPayload)
              .select()
              .single();

            if (!fallbackRes.error && fallbackRes.data) {
              data = fallbackRes.data;
              error = null;
            } else {
              console.error("Supabase lead insert error:", error, fallbackRes.error);
            }
          }

          if (data) {
            setLeads((prev) =>
              prev.map((l) =>
                l.id === newLead.id
                  ? {
                      ...l,
                      id: data.id,
                      client: data.client_name || data.name || l.client,
                      description: data.description || data.project_details || l.description,
                      rawValue: Number(data.budget ?? data.value ?? l.rawValue),
                      budget: formatINR(Number(data.budget ?? data.value ?? l.rawValue)),
                      portal_token: data.portal_token || l.portal_token,
                    }
                  : l
              )
            );
          }
        }
      } catch (err) {
        console.error("Supabase lead insert exception:", err);
      }
      router.refresh();
    });
  };

  const renderBadge = (tag: string, variant?: LeadItem["tagVariant"]) => {
    switch (variant) {
      case "high":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8B4F8]/15 text-[#E8B4F8] font-mono text-[10px] font-medium border border-[#E8B4F8]/30">
            {tag}
          </span>
        );
      case "won":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#B270A2]/25 text-[#E8B4F8] font-mono text-[10px] font-medium flex items-center gap-1 border border-[#B270A2]/40">
            <CheckCircle2 className="h-2.5 w-2.5" />
            {tag}
          </span>
        );
      case "proposal":
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8B4F8]/15 text-[#E8B4F8] font-mono text-[10px] font-medium border border-[#E8B4F8]/30">
            {tag}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#A098A8] font-mono text-[10px] border border-white/10">
            {tag}
          </span>
        );
    }
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-2"
    >
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-[#E2DCE7]">
              Leads &amp; Deal Pipeline
            </h1>
            <span className="rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 shadow-sm">
              {leads.length} DEALS ACTIVE
            </span>
          </div>
          <p className="text-xs text-[#A098A8] max-w-2xl font-normal">
            Track potential freelance clients, contracts, and pitch stages with real-time conversion telemetry.
          </p>
        </div>

        {/* Action Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex items-center">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A098A8] pointer-events-none" />
            <select
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-full bg-white/[0.04] border border-white/10 text-[#E2DCE7] text-xs focus:outline-none focus:border-[#E8B4F8] cursor-pointer appearance-none transition-colors shadow-sm"
            >
              <option value="all" className="bg-[#140D1B] text-[#E2DCE7]">
                All Disciplines (UI/UX, Code, Advisory)
              </option>
              <option value="ui/ux" className="bg-[#140D1B] text-[#E2DCE7]">
                UI/UX Design
              </option>
              <option value="next.js" className="bg-[#140D1B] text-[#E2DCE7]">
                Full-Stack / Next.js
              </option>
              <option value="advisory" className="bg-[#140D1B] text-[#E2DCE7]">
                Strategic Advisory
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A098A8] pointer-events-none" />
          </div>

          <div className="flex items-center bg-white/[0.04] border border-white/10 p-1 rounded-full shadow-inner">
            <button
              onClick={() => setFilterMode("values")}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterMode === "values"
                  ? "bg-white/10 text-white border border-white/10 shadow-sm font-semibold"
                  : "text-[#A098A8] hover:text-[#E2DCE7]"
              }`}
            >
              Values
            </button>
            <button
              onClick={() => setFilterMode("stages")}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterMode === "stages"
                  ? "bg-white/10 text-white border border-white/10 shadow-sm font-semibold"
                  : "text-[#A098A8] hover:text-[#E2DCE7]"
              }`}
            >
              Stages
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Floating Feedback Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-[#E8B4F8]/30 bg-[#140D1B]/95 backdrop-blur-xl p-3 text-xs text-[#E8B4F8] flex items-center gap-2 shadow-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-[#E8B4F8]" />
            <span className="font-medium font-mono">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Pipeline Ribbon Bento KPI Tiles (Calculated Dynamically) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Live Total Pipeline */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Total Pipeline Value
            </span>
            <span className="text-[10px] font-mono text-[#E8B4F8] bg-[#E8B4F8]/15 px-2.5 py-0.5 rounded-full border border-[#E8B4F8]/30 font-medium">
              {leads.length} DEALS
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums">
              {formatINR(totalPipeline)}
            </span>
            <span className="text-xs font-mono font-medium text-[#E8B4F8]">+18.4%</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full w-[72%]" />
          </div>
        </GlassCard>

        {/* KPI 2: Live Win Rate */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Conversion / Win Rate
            </span>
            <CheckCircle2 className="h-3.5 w-3.5 text-[#E8B4F8]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums">
              {winRate}%
            </span>
            <span className="text-[11px] font-mono text-[#A098A8]">{wonLeads.length} won of {leads.length}</span>
          </div>
          <div className="flex items-end gap-1.5 h-3 mt-3">
            <span className="flex-1 bg-white/[0.06] rounded-t h-[40%]" />
            <span className="flex-1 bg-white/[0.06] rounded-t h-[60%]" />
            <span className="flex-1 bg-white/[0.06] rounded-t h-[55%]" />
            <span className="flex-1 bg-[#E8B4F8] rounded-t h-[80%]" />
          </div>
        </GlassCard>

        {/* KPI 3: Live Average Deal Size */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Avg Contract Value
            </span>
            <span className="text-[10px] font-mono text-[#A098A8]">ACV</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums">
              {formatINR(avgDealSize)}
            </span>
            <span className="text-xs font-mono font-medium text-[#E8B4F8]">INR</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-[#A098A8]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] shadow-[0_0_8px_#E8B4F8]" />
            <span className="text-[11px] font-mono">Dynamic per-deal yield</span>
          </div>
        </GlassCard>

        {/* KPI 4: Active In-Flight Deals */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Active In-Flight Deals
            </span>
            <span className="text-[10px] font-mono text-[#A098A8]">Pipelined</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums">
              {inProgressLeads.length + contactedLeads.length}
            </span>
            <span className="text-xs font-mono text-[#A098A8]">Active</span>
          </div>
          <div className="w-full bg-white/[0.08] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full w-[60%]" />
          </div>
        </GlassCard>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Contacted */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white/[0.02] border border-white/10 p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between pb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E8B4F8] shadow-[0_0_8px_#E8B4F8]" />
              <h2 className="text-sm font-semibold text-white tracking-tight">Contacted</h2>
              <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-mono text-[#A098A8] border border-white/10">
                {contactedLeads.length}
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-[#E8B4F8] tabular-nums">
              {formatINR(contactedValue)}
            </span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const leadId = e.dataTransfer.getData("text/plain");
              if (leadId) handleMoveStatus(leadId, "Contacted");
            }}
            className="flex flex-col gap-3 min-h-[160px]"
          >
            {contactedLeads.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", lead.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <GlassCard interactive className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-mono font-medium text-xs text-[#E8B4F8]">
                      {lead.initials}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-[#E2DCE7] truncate">{lead.client}</span>
                      <span className="text-[11px] text-[#A098A8] truncate font-normal">
                        {lead.contact}
                      </span>
                    </div>
                  </div>
                  {renderBadge(lead.tag, lead.tagVariant)}
                </div>

                <p className="text-xs text-[#A098A8] mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {lead.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lead.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-[#A098A8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Est. Budget
                    </span>
                    <span className="font-display text-sm font-bold text-[#E8B4F8] tabular-nums">
                      {lead.budget}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CopyPortalButton token={lead.portal_token} clientName={lead.client} />
                    <button
                      onClick={() => handleMoveStatus(lead.id, "In Progress")}
                      className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[#E2DCE7] transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                      title="Move to In Progress"
                    >
                      <span>In Progress</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </GlassCard>
              </div>
            ))}

            {contactedLeads.length === 0 && !isLoading && (
              <div className="p-8 text-center text-xs font-mono text-[#A098A8] border border-dashed border-white/10 rounded-2xl">
                No contacted leads.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white/[0.02] border border-white/10 p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between pb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E8B4F8] shadow-[0_0_8px_#E8B4F8]" />
              <h2 className="text-sm font-semibold text-white tracking-tight">In Progress</h2>
              <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-mono text-[#A098A8] border border-white/10">
                {inProgressLeads.length}
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-[#E8B4F8] tabular-nums">
              {formatINR(inProgressValue)}
            </span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const leadId = e.dataTransfer.getData("text/plain");
              if (leadId) handleMoveStatus(leadId, "In Progress");
            }}
            className="flex flex-col gap-3 min-h-[160px]"
          >
            {inProgressLeads.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", lead.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <GlassCard interactive className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-mono font-medium text-xs text-[#E8B4F8]">
                      {lead.initials}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-[#E2DCE7] truncate">{lead.client}</span>
                      <span className="text-[11px] text-[#A098A8] truncate font-normal">
                        {lead.contact}
                      </span>
                    </div>
                  </div>
                  {renderBadge(lead.tag, lead.tagVariant)}
                </div>

                <p className="text-xs text-[#A098A8] mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {lead.description}
                </p>

                {lead.progress !== undefined && (
                  <div className="mt-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#A098A8] truncate font-normal">{lead.progressLabel}</span>
                      <span className="font-mono text-[#E8B4F8] font-medium">{lead.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] rounded-full"
                        style={{ width: `${lead.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lead.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-[#A098A8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Budget
                    </span>
                    <span className="font-display text-sm font-bold text-[#E8B4F8] tabular-nums">
                      {lead.budget}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CopyPortalButton token={lead.portal_token} clientName={lead.client} />
                    <button
                      onClick={() => handleMoveStatus(lead.id, "Contacted")}
                      className="p-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[#A098A8] transition-colors cursor-pointer"
                      title="Back to Contacted"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleMoveStatus(lead.id, "Won")}
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white transition-all flex items-center gap-1 text-[11px] font-semibold cursor-pointer shadow-sm"
                      title="Move to Won"
                    >
                      <span>Won</span>
                      <CheckCircle2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </GlassCard>
              </div>
            ))}

            {inProgressLeads.length === 0 && !isLoading && (
              <div className="p-8 text-center text-xs font-mono text-[#A098A8] border border-dashed border-white/10 rounded-2xl">
                No active in-progress deals.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Won */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white/[0.02] border border-white/10 p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between pb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E8B4F8] shadow-[0_0_8px_#E8B4F8]" />
              <h2 className="text-sm font-semibold text-white tracking-tight">Won</h2>
              <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-mono text-[#A098A8] border border-white/10">
                {wonLeads.length}
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-[#E8B4F8] tabular-nums">
              {formatINR(wonValue)}
            </span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const leadId = e.dataTransfer.getData("text/plain");
              if (leadId) handleMoveStatus(leadId, "Won");
            }}
            className="flex flex-col gap-3 min-h-[160px]"
          >
            {wonLeads.map((lead) => (
              <div
                key={lead.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", lead.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <GlassCard interactive className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-mono font-medium text-xs text-[#E8B4F8]">
                      {lead.initials}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-[#E2DCE7] truncate">{lead.client}</span>
                      <span className="text-[11px] text-[#A098A8] truncate font-normal">
                        {lead.contact}
                      </span>
                    </div>
                  </div>
                  {renderBadge(lead.tag, lead.tagVariant)}
                </div>

                <p className="text-xs text-[#A098A8] mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {lead.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lead.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-mono text-[#A098A8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Settled
                    </span>
                    <span className="font-display text-sm font-bold text-[#E8B4F8] tabular-nums">
                      {lead.budget}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CopyPortalButton token={lead.portal_token} clientName={lead.client} />
                    <button
                      onClick={() => handleMoveStatus(lead.id, "In Progress")}
                      className="p-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[#A098A8] transition-colors cursor-pointer"
                      title="Reopen to In Progress"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <span className="text-[11px] font-mono text-[#A098A8] bg-white/[0.03] px-2.5 py-0.5 rounded-full border border-white/10">
                      {lead.timeAgo}
                    </span>
                  </div>
                </div>
              </GlassCard>
              </div>
            ))}

            {wonLeads.length === 0 && !isLoading && (
              <div className="p-8 text-center text-xs font-mono text-[#A098A8] border border-dashed border-white/10 rounded-2xl">
                No closed won deals yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Lead Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="w-full max-w-lg rounded-3xl bg-[#140D1B]/95 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                      Add New Opportunity
                    </h3>
                    <p className="text-[11px] text-[#A098A8]">Register lead in pipeline matrix</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-[#A098A8] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                    Client / Company Name
                  </label>
                  <input
                    name="client_name"
                    required
                    placeholder="e.g. Acme Studio"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                    Project Scope &amp; Deliverables
                  </label>
                  <textarea
                    name="project_title"
                    required
                    rows={2}
                    placeholder="e.g. Complete Design System Migration & Token Architecture"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Budget (INR ₹)
                    </label>
                    <input
                      name="value"
                      type="number"
                      required
                      placeholder="450000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Initial Stage
                    </label>
                    <select
                      name="status"
                      defaultValue="Contacted"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#140D1B] text-xs text-white focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Won">Won</option>
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
                    Create Opportunity
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

export default function LeadsClient() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-[#666]">
          Loading deal pipeline telemetry...
        </div>
      }
    >
      <LeadsPipelineContent />
    </Suspense>
  );
}
