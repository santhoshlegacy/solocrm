"use client";

import React, { useState, useTransition } from "react";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import {
  Filter,
  Plus,
  CheckCircle2,
  Receipt,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateLeadStatus, createLead } from "@/actions/leads";

export interface LeadItem {
  id: string;
  client: string;
  contact: string;
  initials: string;
  tag: string;
  tagVariant?: "high" | "scoping" | "proposal" | "won" | "neutral";
  description: string;
  tags: string[];
  budget: string;
  timeAgo: string;
  progress?: number;
  progressLabel?: string;
  status: "Contacted" | "In Progress" | "Won";
}

const INITIAL_LEADS: LeadItem[] = [
  {
    id: "lead-1",
    client: "Veloce AI",
    contact: "Elena Rostova • CMO",
    initials: "VA",
    tag: "High Priority",
    tagVariant: "high",
    description: "Redesign SaaS Dashboard & complete design tokens component library for Series A deck.",
    tags: ["UI/UX Design", "Design Tokens"],
    budget: "$9,500",
    timeAgo: "2 hrs ago",
    status: "Contacted",
  },
  {
    id: "lead-2",
    client: "Kroma Studio",
    contact: "Marcus Vance • Founder",
    initials: "KS",
    tag: "Scoping",
    tagVariant: "scoping",
    description: "Mobile Design & iOS interactive SwiftUI click-through prototype for seed investor roadshow.",
    tags: ["Mobile App", "iOS Prototype"],
    budget: "$6,500",
    timeAgo: "Yesterday",
    status: "Contacted",
  },
  {
    id: "lead-3",
    client: "Arcadia Health",
    contact: "Dr. Sarah Lin • VP Product",
    initials: "AH",
    tag: "Sprint",
    tagVariant: "neutral",
    description: "Design Audit & Design System Sprint across patient checkout and telehealth scheduling views.",
    tags: ["Audit", "Telehealth"],
    budget: "$5,000",
    timeAgo: "3d ago",
    status: "Contacted",
  },
  {
    id: "lead-4",
    client: "Nexus Protocol",
    contact: "Julian Thorne • Lead Architect",
    initials: "NP",
    tag: "$14.0k Proposal",
    tagVariant: "proposal",
    description: "Full Brand Identity + Next.js App, tailwind-optimized trading terminal and wallet connections.",
    tags: ["Full-Stack", "Web3", "Next.js"],
    budget: "$14,000",
    timeAgo: "Sent 1d ago",
    progress: 75,
    progressLabel: "Proposal Sent - Awaiting Signature",
    status: "In Progress",
  },
  {
    id: "lead-5",
    client: "Pulse Commerce",
    contact: "Chloe Bennet • Head of Ops",
    initials: "PC",
    tag: "Reviewing Contract",
    tagVariant: "neutral",
    description: "Headless Shopify Store UI Architecture, Sanity CMS integration, and micro-animations.",
    tags: ["E-commerce", "Shopify"],
    budget: "$8,500",
    timeAgo: "Sent 2d ago",
    progress: 90,
    progressLabel: "MSA & SOW in Final Review",
    status: "In Progress",
  },
  {
    id: "lead-6",
    client: "Hyperion Labs",
    contact: "Dr. Liam Reyes • Research Lead",
    initials: "HL",
    tag: "Security Review",
    tagVariant: "scoping",
    description: "Interactive Quantum Compute visualization tool and high-density financial charting web app.",
    tags: ["Visualization", "Three.js", "CADD"],
    budget: "$6,500",
    timeAgo: "Sent 4d ago",
    progress: 40,
    progressLabel: "Vendor Security Questionnaire",
    status: "In Progress",
  },
  {
    id: "lead-7",
    client: "Synthetix Data",
    contact: "Gavin Ross • CEO",
    initials: "SD",
    tag: "Closed Won",
    tagVariant: "won",
    description: "$12k Design System Retainer - 3 month commitment at $4k/month starting Nov 1.",
    tags: ["Design System", "Quarterly Retainer"],
    budget: "$12,000",
    timeAgo: "Signed 2h ago",
    status: "Won",
  },
  {
    id: "lead-8",
    client: "Stratosphere",
    contact: "Nadia Belov • VP Engineering",
    initials: "SS",
    tag: "Closed Won",
    tagVariant: "won",
    description: "Cloud telemetry monitoring dashboard frontend migration with real-time WebSockets.",
    tags: ["Next.js", "Turbopack", "Telemetry"],
    budget: "$7,500",
    timeAgo: "Signed Yesterday",
    status: "Won",
  },
  {
    id: "lead-9",
    client: "Aetheria Audio",
    contact: "Felix Ward • Founder",
    initials: "AA",
    tag: "Closed Won",
    tagVariant: "won",
    description: "Web Audio DSP control interface with real-time FFT spectrum visualizer.",
    tags: ["DSP UI", "Audio", "WebAudio"],
    budget: "$5,000",
    timeAgo: "Signed 3d ago",
    status: "Won",
  },
];

export default function LeadsPipelinePage() {
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_LEADS);
  const [filterMode, setFilterMode] = useState<"values" | "stages">("values");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const contactedLeads = leads.filter((l) => l.status === "Contacted");
  const inProgressLeads = leads.filter((l) => l.status === "In Progress");
  const wonLeads = leads.filter((l) => l.status === "Won");

  const handleMoveStatus = (id: string, newStatus: LeadItem["status"]) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          return {
            ...lead,
            status: newStatus,
            tag: newStatus === "Won" ? "Closed Won" : newStatus === "In Progress" ? "In Negotiation" : "New Lead",
            tagVariant: newStatus === "Won" ? "won" : "high",
          };
        }
        return lead;
      })
    );

    const targetLead = leads.find((l) => l.id === id);
    setNotification(`Moved "${targetLead?.client || "Lead"}" to ${newStatus}`);
    setTimeout(() => setNotification(null), 3500);

    startTransition(async () => {
      await updateLeadStatus(id, newStatus);
    });
  };

  const handleCreateLead = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const client = (formData.get("client_name") as string) || "New Client";
    const title = (formData.get("project_title") as string) || "General Retainer";
    const value = (formData.get("value") as string) || "5000";
    const status = (formData.get("status") as LeadItem["status"]) || "Contacted";

    const newLead: LeadItem = {
      id: `lead-${Date.now()}`,
      client,
      contact: "Direct Inbound • Primary Contact",
      initials: client.slice(0, 2).toUpperCase(),
      tag: "High Priority",
      tagVariant: "high",
      description: title,
      tags: ["Inbound", "Active"],
      budget: `$${Number(value).toLocaleString()}`,
      timeAgo: "Just now",
      status,
    };

    setLeads([newLead, ...leads]);
    setIsModalOpen(false);
    setNotification(`Successfully registered "${client}" in pipeline.`);
    setTimeout(() => setNotification(null), 3500);

    startTransition(async () => {
      await createLead(formData);
    });
  };

  const renderBadge = (tag: string, variant?: LeadItem["tagVariant"]) => {
    switch (variant) {
      case "high":
        return (
          <span className="px-2 py-0.5 rounded bg-[#d41514]/10 text-[#d41514] font-mono text-[10px] font-medium border border-[#d41514]/20">
            {tag}
          </span>
        );
      case "won":
        return (
          <span className="px-2 py-0.5 rounded bg-[#d41514]/15 text-[#d41514] font-mono text-[10px] font-medium flex items-center gap-1 border border-[#d41514]/25">
            <CheckCircle2 className="h-2.5 w-2.5" />
            {tag}
          </span>
        );
      case "proposal":
        return (
          <span className="px-2 py-0.5 rounded bg-[#d41514]/10 text-[#d41514] font-mono text-[10px] font-medium border border-[#d41514]/20">
            {tag}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-white/[0.03] text-[#71717a] font-mono text-[10px] border border-white/[0.06]">
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
            <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Leads &amp; Deal Pipeline
            </h1>
            <span className="rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#d41514] border border-[#d41514]/20">
              {leads.length} DEALS ACTIVE
            </span>
          </div>
          <p className="text-xs text-[#a1a1aa] max-w-2xl font-normal">
            Track potential freelance clients, contracts, and pitch stages with real-time conversion telemetry.
          </p>
        </div>

        {/* Action Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex items-center">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a] pointer-events-none" />
            <select className="pl-8 pr-8 py-1.5 rounded-lg bg-[#0e0e11] border border-white/[0.08] text-[#e4e4e7] text-xs focus:outline-none focus:border-[#d41514] cursor-pointer appearance-none transition-colors shadow-luxury">
              <option className="bg-[#0e0e11] text-[#e4e4e7]">All Disciplines (UI/UX, Code, Advisory)</option>
              <option className="bg-[#0e0e11] text-[#e4e4e7]">UI/UX Design</option>
              <option className="bg-[#0e0e11] text-[#e4e4e7]">Full-Stack / Next.js</option>
              <option className="bg-[#0e0e11] text-[#e4e4e7]">Strategic Advisory</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a] pointer-events-none" />
          </div>

          <div className="flex items-center bg-[#0e0e11] border border-white/[0.08] p-0.5 rounded-lg shadow-luxury">
            <button
              onClick={() => setFilterMode("values")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                filterMode === "values"
                  ? "bg-[#d41514]/15 text-[#d41514] border border-[#d41514]/30"
                  : "text-[#71717a] hover:text-white"
              }`}
            >
              Values
            </button>
            <button
              onClick={() => setFilterMode("stages")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                filterMode === "stages"
                  ? "bg-[#d41514]/15 text-[#d41514] border border-[#d41514]/30"
                  : "text-[#71717a] hover:text-white"
              }`}
            >
              Stages
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d41514] text-white text-xs font-semibold hover:bg-[#b5100f] active:scale-[0.98] transition-all shadow-luxury"
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
            className="rounded-lg border border-[#d41514]/30 bg-[#0e0e11] p-3 text-xs text-[#d41514] flex items-center gap-2 shadow-luxury-elevated"
          >
            <CheckCircle2 className="h-4 w-4 text-[#d41514]" />
            <span className="font-medium font-mono">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Pipeline Ribbon Bento KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Total Pipeline Value
            </span>
            <span className="text-[10px] font-mono text-[#d41514] bg-[#d41514]/10 px-2 py-0.5 rounded border border-[#d41514]/20 font-medium">
              {leads.length} DEALS
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              $74,500
            </span>
            <span className="text-xs font-mono font-medium text-[#d41514]">+18.4%</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#d41514] h-full rounded-full w-[72%]" />
          </div>
        </GlassCard>

        {/* KPI 2 */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Conversion / Win Rate
            </span>
            <CheckCircle2 className="h-3.5 w-3.5 text-[#d41514]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              68%
            </span>
            <span className="text-[11px] font-mono text-[#71717a]">L90D Avg</span>
          </div>
          <div className="flex items-end gap-1.5 h-3 mt-3">
            <span className="flex-1 bg-white/[0.06] rounded-t h-[40%]" />
            <span className="flex-1 bg-white/[0.06] rounded-t h-[60%]" />
            <span className="flex-1 bg-white/[0.06] rounded-t h-[55%]" />
            <span className="flex-1 bg-white/[0.06] rounded-t h-[80%]" />
            <span className="flex-1 bg-[#d41514] rounded-t h-full" />
          </div>
        </GlassCard>

        {/* KPI 3 */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Average Deal Size
            </span>
            <Receipt className="h-3.5 w-3.5 text-[#d41514]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              $8,275
            </span>
            <span className="text-xs font-mono font-medium text-[#d41514]">↑ 12%</span>
          </div>
          <p className="text-[11px] text-[#71717a] mt-3 truncate font-normal">
            <span className="text-white font-medium">$14.0k</span> peak • 3 retainers
          </p>
        </GlassCard>

        {/* KPI 4 */}
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Active Cycle Time
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d41514] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d41514]" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
              6.4
            </span>
            <span className="text-xs text-[#71717a] font-normal">days to sign</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#d41514]/10 text-[#d41514] font-medium border border-[#d41514]/20">
              FAST VELOCITY
            </span>
            <span className="text-[11px] text-[#71717a] font-normal">Top 5% Tier</span>
          </div>
        </GlassCard>
      </div>

      {/* 3 Kanban Matrix Columns: Contacted, In Progress, Won */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Contacted */}
        <div className="flex flex-col gap-4 rounded-lg bg-[#0a0a0d] border border-white/[0.06] p-4 shadow-luxury">
          <div className="flex items-center justify-between pb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#71717a]" />
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Contacted
              </h2>
              <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-[#a1a1aa] border border-white/[0.06]">
                {contactedLeads.length}
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-white/95 tabular-nums">$21,000</span>
          </div>

          <div className="flex flex-col gap-3">
            {contactedLeads.map((lead) => (
              <GlassCard key={lead.id} interactive className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono font-medium text-xs text-white">
                      {lead.initials}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-white truncate">
                        {lead.client}
                      </span>
                      <span className="text-[11px] text-[#71717a] truncate font-normal">
                        {lead.contact}
                      </span>
                    </div>
                  </div>
                  {renderBadge(lead.tag, lead.tagVariant)}
                </div>

                <p className="text-xs text-[#a1a1aa] mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {lead.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lead.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-[#71717a]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">Est. Budget</span>
                    <span className="font-display text-sm font-bold text-white tabular-nums">
                      {lead.budget}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#71717a] bg-white/[0.02] px-2 py-0.5 rounded border border-white/[0.06]">
                      {lead.timeAgo}
                    </span>
                    <button
                      onClick={() => handleMoveStatus(lead.id, "In Progress")}
                      className="p-1.5 rounded-md bg-white/[0.02] hover:bg-[#d41514] hover:text-white border border-white/[0.08] text-[#a1a1aa] transition-colors flex items-center gap-1 text-[11px] font-medium"
                      title="Move to In Progress"
                    >
                      <span>In Progress</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="flex flex-col gap-4 rounded-lg bg-[#0a0a0d] border border-white/[0.06] p-4 shadow-luxury">
          <div className="flex items-center justify-between pb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d41514]" />
              <h2 className="text-sm font-semibold text-white tracking-tight">
                In Progress
              </h2>
              <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-[#a1a1aa] border border-white/[0.06]">
                {inProgressLeads.length}
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-[#d41514] tabular-nums">$29,000</span>
          </div>

          <div className="flex flex-col gap-3">
            {inProgressLeads.map((lead) => (
              <GlassCard key={lead.id} interactive className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 flex items-center justify-center font-mono font-medium text-xs text-[#d41514]">
                      {lead.initials}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-white truncate">
                        {lead.client}
                      </span>
                      <span className="text-[11px] text-[#71717a] truncate font-normal">
                        {lead.contact}
                      </span>
                    </div>
                  </div>
                  {renderBadge(lead.tag, lead.tagVariant)}
                </div>

                <p className="text-xs text-[#a1a1aa] mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {lead.description}
                </p>

                {lead.progress && (
                  <div className="mt-2.5 p-2 rounded-lg bg-[#08080a] border border-white/[0.06]">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#a1a1aa] truncate font-normal">{lead.progressLabel}</span>
                      <span className="font-mono text-[#d41514] font-medium">{lead.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#d41514] rounded-full"
                        style={{ width: `${lead.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lead.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-[#71717a]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">Budget</span>
                    <span className="font-display text-sm font-bold text-[#d41514] tabular-nums">
                      {lead.budget}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveStatus(lead.id, "Contacted")}
                      className="p-1 rounded-md bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-[#a1a1aa] transition-colors"
                      title="Back to Contacted"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleMoveStatus(lead.id, "Won")}
                      className="px-2.5 py-1 rounded-md bg-[#d41514] hover:bg-[#b5100f] text-white transition-colors flex items-center gap-1 text-[11px] font-semibold"
                      title="Move to Won"
                    >
                      <span>Mark Won</span>
                      <CheckCircle2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Column 3: Won */}
        <div className="flex flex-col gap-4 rounded-lg bg-[#0a0a0d] border border-white/[0.06] p-4 shadow-luxury">
          <div className="flex items-center justify-between pb-1 px-1">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d41514]" />
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Won
              </h2>
              <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-[#a1a1aa] border border-white/[0.06]">
                {wonLeads.length}
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-[#d41514] tabular-nums">$24,500</span>
          </div>

          <div className="flex flex-col gap-3">
            {wonLeads.map((lead) => (
              <GlassCard key={lead.id} interactive className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 flex items-center justify-center font-mono font-medium text-xs text-[#d41514]">
                      {lead.initials}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-white truncate">
                        {lead.client}
                      </span>
                      <span className="text-[11px] text-[#71717a] truncate font-normal">
                        {lead.contact}
                      </span>
                    </div>
                  </div>
                  {renderBadge(lead.tag, lead.tagVariant)}
                </div>

                <p className="text-xs text-[#a1a1aa] mt-2.5 line-clamp-2 leading-relaxed font-normal">
                  {lead.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lead.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-[#71717a]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06]">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">Rate</span>
                    <span className="font-display text-sm font-bold text-[#d41514] tabular-nums">
                      {lead.budget}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveStatus(lead.id, "In Progress")}
                      className="p-1 rounded-md bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] text-[#a1a1aa] transition-colors"
                      title="Reopen to In Progress"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <span className="text-[11px] font-mono text-[#71717a] bg-white/[0.02] px-2 py-0.5 rounded border border-white/[0.06]">
                      {lead.timeAgo}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* New Lead Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="w-full max-w-lg rounded-lg bg-[#0e0e11] border border-white/[0.08] p-6 shadow-luxury-elevated"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 text-[#d41514] flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                      Add New Freelance Opportunity
                    </h3>
                    <p className="text-[11px] text-[#71717a]">Register lead in pipeline matrix</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-md text-[#71717a] hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                    Client Name
                  </label>
                  <input
                    name="client_name"
                    required
                    placeholder="e.g. Acme Studio"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                    Project Title &amp; Scope
                  </label>
                  <textarea
                    name="project_title"
                    required
                    rows={2}
                    placeholder="e.g. Complete Design System Migration & Token Architecture"
                    className="w-full px-3.5 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                      Budget (USD)
                    </label>
                    <input
                      name="value"
                      type="number"
                      required
                      placeholder="8500"
                      className="w-full px-3.5 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                      Initial Stage
                    </label>
                    <select
                      name="status"
                      defaultValue="Contacted"
                      className="w-full px-3.5 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury cursor-pointer"
                    >
                      <option value="Contacted">Contacted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Won">Won</option>
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
