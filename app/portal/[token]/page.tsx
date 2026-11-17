import React from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { formatINR } from "@/lib/utils";
import {
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  Clock,
  Layers,
  Receipt,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface PortalPageProps {
  params: Promise<{ token: string }>;
}

// Curated active freelance engagements with deterministic tokens for instant verification
const FALLBACK_ENGAGEMENTS: Record<string, {
  projectName: string;
  clientName: string;
  scopeSummary: string;
  status: string;
  statusType: "active" | "review" | "delivered" | "pipeline";
  progress: number;
  progressLabel: string;
  budgetINR: number;
  lastUpdated: string;
  deliverables: string[];
}> = {
  "c0a80101-0001-4000-8000-000000000001": {
    projectName: "SaaS Dashboard Redesign & Design Tokens Architecture",
    clientName: "Veloce AI",
    scopeSummary: "Complete overhaul of the core AI analytics dashboard, component design token library for Series A investor deck, and high-density financial charting web app.",
    status: "In Progress",
    statusType: "active",
    progress: 65,
    progressLabel: "Phase 2 // High-Fidelity Interactive Prototypes",
    budgetINR: 788500, // ~$9,500 USD
    lastUpdated: "Today, 14:30 IST",
    deliverables: [
      "Figma Tokens Library with Dark Mode Obsidian Variables",
      "Next.js App Router Component Library with Tailwind CSS",
      "Recharts Data Visualization Modules with Frosted Pink Accents",
      "Series A Executive Click-Through Demo Deck",
    ],
  },
  "c0a80101-0002-4000-8000-000000000002": {
    projectName: "iOS SwiftUI Mobile Prototype & Pitch Design",
    clientName: "Kroma Studio",
    scopeSummary: "Mobile design architecture and iOS interactive SwiftUI click-through prototype for seed stage venture roadshow.",
    status: "Reviewing SOW",
    statusType: "review",
    progress: 40,
    progressLabel: "Phase 1 // Scoping & Technical Architecture",
    budgetINR: 539500, // ~$6,500 USD
    lastUpdated: "Yesterday",
    deliverables: [
      "SwiftUI Component Spec & Wireframes",
      "Interactive Touch Flow on TestFlight",
      "Investor Walkthrough Demo Recording",
    ],
  },
  "c0a80101-0003-4000-8000-000000000003": {
    projectName: "Telehealth Checkout & Patient Portal Design Audit",
    clientName: "Arcadia Health",
    scopeSummary: "Design Audit & Design System Sprint across patient checkout and telehealth scheduling views.",
    status: "Contacted",
    statusType: "pipeline",
    progress: 25,
    progressLabel: "Phase 1 // Initial Discovery & Telehealth Audit",
    budgetINR: 415000,
    lastUpdated: "3d ago",
    deliverables: [
      "Patient Intake UX Friction Teardown",
      "Telehealth Scheduling Wireframes",
      "HIPAA Compliant Design Patterns",
    ],
  },
  "c0a80101-0004-4000-8000-000000000004": {
    projectName: "Next.js Web3 Trading Engine UI Interface",
    clientName: "Nexus Protocol",
    scopeSummary: "Full Brand Identity + Next.js App, tailwind-optimized trading terminal, real-time WebSocket orderbook, and wallet connections.",
    status: "In Progress",
    statusType: "active",
    progress: 75,
    progressLabel: "Phase 3 // Proposal Sent - Awaiting Final Signature",
    budgetINR: 1162000, // ~$14,000 USD
    lastUpdated: "Nov 14, 2026",
    deliverables: [
      "DEX Trading Terminal with High-Frequency Orderbook",
      "Web3 Wallet Connector (Wagmi / Viem / Ethers)",
      "Dark Obsidian Milled Glassmorphic UI Suite",
    ],
  },
  "c0a80101-0005-4000-8000-000000000005": {
    projectName: "Headless Shopify Storefront & Sanity CMS UI",
    clientName: "Pulse Commerce",
    scopeSummary: "Headless Shopify Store UI Architecture, Sanity CMS integration, and micro-animations.",
    status: "In Progress",
    statusType: "review",
    progress: 90,
    progressLabel: "MSA & SOW in Final Review",
    budgetINR: 705500,
    lastUpdated: "2d ago",
    deliverables: [
      "Headless Storefront Theme Architecture",
      "Sanity Studio Content Schemas",
      "Micro-interaction Motion Library",
    ],
  },
  "c0a80101-0006-4000-8000-000000000006": {
    projectName: "Quantum Compute Simulation Visualizer",
    clientName: "Hyperion Labs",
    scopeSummary: "Interactive Quantum Compute visualization tool and high-density financial charting web app.",
    status: "In Progress",
    statusType: "review",
    progress: 40,
    progressLabel: "Vendor Security Questionnaire",
    budgetINR: 539500,
    lastUpdated: "4d ago",
    deliverables: [
      "Three.js Bloch Sphere Visualization",
      "Qubit State Telemetry Dashboard",
      "Hardware Benchmarking Suite",
    ],
  },
  "c0a80101-0007-4000-8000-000000000007": {
    projectName: "Design System Monthly Retainer (Quarterly)",
    clientName: "Synthetix Financial",
    scopeSummary: "Continuous UI/UX architecture, quarterly sprint deliverables, and design token synchronization across fintech modules.",
    status: "Active Retainer",
    statusType: "delivered",
    progress: 90,
    progressLabel: "Sprint 2 Delivered // Ongoing Retainer",
    budgetINR: 996000, // ~$12,000 USD
    lastUpdated: "Nov 12, 2026",
    deliverables: [
      "Monthly Component Additions & Audit Reports",
      "Weekly Design Office Hours & Advisory Sprints",
      "Live Production CSS Sync & NPM Package Releases",
    ],
  },
  "c0a80101-0008-4000-8000-000000000008": {
    projectName: "Cloud Telemetry Dashboard Real-time WebSockets",
    clientName: "Stratosphere",
    scopeSummary: "Cloud telemetry monitoring dashboard frontend migration with real-time WebSockets.",
    status: "Active Retainer",
    statusType: "delivered",
    progress: 95,
    progressLabel: "Signed Contract // Milestone 1 Live",
    budgetINR: 622500,
    lastUpdated: "Yesterday",
    deliverables: [
      "Turbopack Next.js App Migration",
      "Low-latency WebSocket Event Stream",
      "Cluster Health Status Gauges",
    ],
  },
  "c0a80101-0009-4000-8000-000000000009": {
    projectName: "Web Audio DSP Controller & Spectrum Analyzer",
    clientName: "Aetheria Audio",
    scopeSummary: "Web Audio DSP control interface with real-time FFT spectrum visualizer.",
    status: "Active Retainer",
    statusType: "delivered",
    progress: 100,
    progressLabel: "Completed & Signed Retainer",
    budgetINR: 415000,
    lastUpdated: "3d ago",
    deliverables: [
      "AudioWorklet Low-latency DSP Nodes",
      "FFT Canvas Real-time Visualizer",
      "Hardware MIDI Controller Bindings",
    ],
  },
};

export default async function ClientPortalPage({ params }: PortalPageProps) {
  const { token } = await params;

  if (!token || token.length < 10) {
    notFound();
  }

  // 1. Fetch from live Supabase leads table
  let project = FALLBACK_ENGAGEMENTS[token] || null;

  try {
    const supabase = await createClient();
    const { data: dbLead } = await supabase
      .from("leads")
      .select("name, project_details, status, value, progress, created_at, portal_token")
      .eq("portal_token", token)
      .maybeSingle();

    if (dbLead) {
      project = {
        projectName: dbLead.project_details || dbLead.name || "Freelance Sprint",
        clientName: dbLead.name || "Client Account",
        scopeSummary: dbLead.project_details || "Verified freelance sprint deliverables and design tokens architecture.",
        status: dbLead.status === "Won" ? "Active Retainer" : dbLead.status === "Pitched" ? "In Progress" : dbLead.status,
        statusType: dbLead.status === "Won" ? "delivered" : "active",
        progress: dbLead.progress || 50,
        progressLabel: `Current Stage // ${dbLead.status}`,
        budgetINR: Number(dbLead.value || 0),
        lastUpdated: "Live Verified",
        deliverables: [
          "Phase Deliverables & Scope Specification",
          "Production Code Repository / Design Assets",
          "Milestone Review & Sign-Off Documentation",
        ],
      };
    } else {
      // Check clients table
      const { data: dbClient } = await supabase
        .from("clients")
        .select("name, company_name, status, total_billed, created_at, portal_token")
        .eq("portal_token", token)
        .maybeSingle();

      if (dbClient) {
        project = {
          projectName: `${dbClient.name || dbClient.company_name} Retainer Engagement`,
          clientName: dbClient.name || dbClient.company_name || "Client Account",
          scopeSummary: "B2B client engagement, retention milestone deliverables, and settlement tracking.",
          status: dbClient.status === "Active" ? "Active Retainer" : dbClient.status,
          statusType: "delivered",
          progress: 100,
          progressLabel: "Active Retainer Engagement",
          budgetINR: Number(dbClient.total_billed || 0),
          lastUpdated: "Live Verified",
          deliverables: [
            "Continuous Engineering Sprints & Support",
            "Monthly Deliverable Milestone Verification",
            "Account Receivables Invoicing (₹ INR)",
          ],
        };
      }
    }
  } catch (err) {
    console.error("Supabase portal fetch error:", err);
  }

  // If token is completely unrecognised
  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#120B18] via-[#09050F] to-[#1C0D22] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8] mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h1 className="text-white font-mono text-base font-bold mb-2">
            Invalid or Expired Magic Link
          </h1>
          <p className="text-xs text-[#A098A8] leading-relaxed mb-6 font-mono">
            This token does not correspond to an active client engagement or has been revoked by the operator.
          </p>
          <div className="text-[10px] font-mono text-[#A098A8]/60 uppercase tracking-wider">
            TOKEN // {token.substring(0, 8)}...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#120B18] via-[#09050F] to-[#1C0D22] text-[#E2DCE7] selection:bg-[#E8B4F8] selection:text-[#120B18] pb-20">
      {/* Top Banner: Verified Operator Branding */}
      <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#B270A2] to-[#E8B4F8] text-[#120B18] flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(232,180,248,0.3)]">
              <Briefcase className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-white">
                Solo<span className="text-[#E8B4F8]">CRM</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A098A8]">
                Client Engagement Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-[#E8B4F8]" />
            <span className="text-white font-medium">VERIFIED TERMINAL</span>
            <span className="text-[#A098A8] hidden sm:inline">• READ-ONLY</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 pt-10 flex flex-col gap-8">
        {/* Project Header Card */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#A098A8]">
                  CLIENT // {project.clientName}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#A098A8]" />
                <span className="text-[10px] font-mono text-[#A098A8]">
                  UPDATED {project.lastUpdated}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {project.projectName}
              </h1>
            </div>

            {/* Stage Pill */}
            <div className="flex items-center gap-2 self-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#E8B4F8]/15 text-[#E8B4F8] border border-[#E8B4F8]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] animate-pulse" />
                {project.status}
              </span>
            </div>
          </div>

          {/* Scope & Description */}
          <div className="pt-6">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] mb-2">
              Scope of Work &amp; Engagement Summary
            </h3>
            <p className="text-xs sm:text-sm text-[#A098A8] leading-relaxed font-normal">
              {project.scopeSummary}
            </p>
          </div>
        </div>

        {/* 3 Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Budget / Value */}
          <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                  Contract Valuation
                </span>
                <Receipt className="h-4 w-4 text-[#E8B4F8]" />
              </div>
              <span className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight block">
                {formatINR(project.budgetINR)}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A098A8]">
              <span>Currency: INR (₹)</span>
              <span className="text-white font-medium">Standard Net 14</span>
            </div>
          </div>

          {/* Card 2: Current Kanban Stage */}
          <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                  Delivery Stage
                </span>
                <Clock className="h-4 w-4 text-[#E8B4F8]" />
              </div>
              <span className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight block truncate">
                {project.status}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#A098A8]">
              <span>Sprint Cadence</span>
              <span className="text-[#E8B4F8] font-medium">Active Phase</span>
            </div>
          </div>

          {/* Card 3: Milestone Completion */}
          <div className="p-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                  Phase Velocity
                </span>
                <CheckCircle2 className="h-4 w-4 text-[#E8B4F8]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
                  {project.progress}%
                </span>
                <span className="text-[11px] font-mono text-[#A098A8]">Completed</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(232,180,248,0.5)]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Deliverables Checklist Section */}
        <div className="p-7 sm:p-8 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="h-4 w-4 text-[#E8B4F8]" />
            <h2 className="font-display text-base font-bold text-white tracking-tight">
              Milestone Deliverables &amp; Artifacts
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {project.deliverables.map((item, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8] shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm text-white font-medium">
                    {item}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#A098A8] uppercase tracking-wider shrink-0">
                  VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Read-Only Guarantee Box */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#A098A8] font-mono text-[11px]">
            <ShieldCheck className="h-4 w-4 text-[#E8B4F8] shrink-0" />
            <span>Read-Only Client Portal • Direct operator modifications disabled for security</span>
          </div>
          <span className="text-[10px] font-mono text-[#A098A8]/60 uppercase tracking-wider">
            MAGIC TOKEN // {token.substring(0, 13)}...
          </span>
        </div>
      </main>
    </div>
  );
}
