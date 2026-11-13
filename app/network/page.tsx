"use client";

import React, { useState } from "react";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import {
  Network,
  Users,
  MessageSquare,
  Sparkles,
  Search,
  Plus,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

interface NetworkContact {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  platform: "LinkedIn" | "Twitter / X" | "Referral";
  lastContacted: string;
  status: "Warm Lead" | "Partner" | "Active Client" | "Inactive";
  notes: string;
}

const NETWORK_DATA: NetworkContact[] = [
  {
    id: "net-1",
    name: "Elena Rostova",
    role: "Chief Marketing Officer",
    company: "Veloce AI",
    avatar: "ER",
    platform: "LinkedIn",
    lastContacted: "Yesterday",
    status: "Active Client",
    notes: "Discussed Series A pitch deck deliverables and extended token migration sprint.",
  },
  {
    id: "net-2",
    name: "Marcus Vance",
    role: "Founder & Creative Lead",
    company: "Kroma Studio",
    avatar: "MV",
    platform: "Twitter / X",
    lastContacted: "3 days ago",
    status: "Warm Lead",
    notes: "Reviewing proposal for interactive SwiftUI prototype; awaiting seed round closure.",
  },
  {
    id: "net-3",
    name: "Julian Thorne",
    role: "Lead Systems Architect",
    company: "Nexus Protocol",
    avatar: "JT",
    platform: "Referral",
    lastContacted: "1 week ago",
    status: "Warm Lead",
    notes: "Referred by Dr. Lin. Looking for Web3 tailwind specialist for Q1 DEX launch.",
  },
  {
    id: "net-4",
    name: "Dr. Sarah Lin",
    role: "VP Product Engineering",
    company: "Arcadia Health",
    avatar: "SL",
    platform: "LinkedIn",
    lastContacted: "2 weeks ago",
    status: "Active Client",
    notes: "Completed telehealth checkout audit; potential quarterly retainer commencing next month.",
  },
  {
    id: "net-5",
    name: "Gavin Ross",
    role: "CEO & Co-Founder",
    company: "Synthetix Financial",
    avatar: "GR",
    platform: "Referral",
    lastContacted: "3 weeks ago",
    status: "Partner",
    notes: "Subcontracted data visualization modules for tier 1 fintech dashboard.",
  },
  {
    id: "net-6",
    name: "Talia Reyes",
    role: "Product Design Lead",
    company: "Orion Media",
    avatar: "TR",
    platform: "Twitter / X",
    lastContacted: "1 month ago",
    status: "Inactive",
    notes: "Periodic catchup on Figma variables design token sync tools.",
  },
];

export default function NetworkPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = NETWORK_DATA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.role.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || item.platform === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-2"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#d41514] border border-[#d41514]/20 flex items-center gap-1.5">
              <Network className="h-3 w-3 text-[#d41514]" />
              FREELANCE NETWORK
            </span>
            <span className="text-[#71717a] text-xs font-mono">• Operator CRM</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white mt-0.5">
            Network &amp; Connections
          </h1>
          <p className="text-xs text-[#a1a1aa] max-w-2xl font-normal">
            Cultivate strategic client relationships, agency partners, and referral channels to sustain high-velocity inbound freelance deals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d41514] hover:bg-[#b5100f] text-white text-xs font-semibold shadow-luxury active:scale-[0.98] transition-all">
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Add Connection</span>
          </button>
        </div>
      </div>

      {/* KPI Bento Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Total Network Size
            </span>
            <Users className="h-3.5 w-3.5 text-[#d41514]" />
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
            142
          </span>
          <p className="text-[11px] text-[#71717a] mt-2 font-normal">+12 new this month</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Active Dialogues
            </span>
            <MessageSquare className="h-3.5 w-3.5 text-[#d41514]" />
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
            8
          </span>
          <p className="text-[11px] text-[#71717a] mt-2 font-normal">3 proposals pending</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Top Acquisition Rail
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#d41514]" />
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight">
            LinkedIn / Referrals
          </span>
          <p className="text-[11px] text-[#71717a] mt-2 font-normal">78% of contract volume</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
              Touchpoint Cadence
            </span>
            <Calendar className="h-3.5 w-3.5 text-[#71717a]" />
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-white tracking-tight tabular-nums">
            4.2 Days
          </span>
          <p className="text-[11px] text-[#71717a] mt-2 font-normal">Average response latency</p>
        </GlassCard>
      </div>

      {/* Main Connection Table / Cards */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 text-[#d41514]">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-white tracking-tight">
                Rolodex &amp; Contact Records
              </h3>
              <p className="text-xs text-[#a1a1aa] font-normal">
                Direct contacts with notes, platform origins, and interaction timestamps
              </p>
            </div>
          </div>

          {/* Search & Platform Filter */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#0a0a0d] text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
              />
            </div>

            <div className="flex items-center bg-[#0e0e11] border border-white/[0.08] p-0.5 rounded-lg shadow-luxury">
              {["all", "LinkedIn", "Twitter / X", "Referral"].map((pf) => (
                <button
                  key={pf}
                  onClick={() => setFilter(pf)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                    filter === pf
                      ? "bg-[#d41514]/15 text-[#d41514] border border-[#d41514]/30"
                      : "text-[#71717a] hover:text-white"
                  }`}
                >
                  {pf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List of Connections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border border-white/[0.07] bg-[#0e0e11] shadow-luxury flex flex-col justify-between gap-3 hover:border-white/[0.14] hover:shadow-luxury-elevated hover:-translate-y-[1px] transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 flex items-center justify-center font-mono font-medium text-xs text-[#d41514]">
                    {item.avatar}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-white truncate group-hover:text-[#d41514] transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-[#71717a] truncate font-normal">{item.role}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/[0.03] border border-white/[0.06] text-[#a1a1aa] flex-shrink-0">
                  {item.platform}
                </span>
              </div>

              <p className="text-xs text-[#a1a1aa] line-clamp-2 leading-relaxed bg-[#08080a] p-2.5 rounded-md border border-white/[0.05] font-normal">
                {item.notes}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px]">
                <span className="text-[#71717a] font-mono font-normal">Contacted {item.lastContacted}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#d41514]/10 text-[#d41514] border border-[#d41514]/20">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  );
}
