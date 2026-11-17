"use client";

import React, { useTransition, useState } from "react";
import { Briefcase, Building2, ArrowRight, ShieldCheck, Check, Sparkles, Loader2 } from "lucide-react";
import { setWorkspaceType, WorkspaceType } from "@/actions/onboarding";

export default function OnboardingPage() {
  const [isPending, startTransition] = useTransition();
  const [selectedMode, setSelectedMode] = useState<WorkspaceType | null>(null);

  const handleSelect = (mode: WorkspaceType) => {
    setSelectedMode(mode);
    try {
      localStorage.setItem("solocrm_workspace_mode", mode === "freelance" ? "freelancer" : "business");
    } catch {
      // Ignore localStorage errors
    }

    startTransition(async () => {
      await setWorkspaceType(mode);
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      {/* Frosted Fintech Terminal Kicker & Header */}
      <div className="flex flex-col items-center text-center max-w-2xl mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-[#E8B4F8] shadow-[0_0_10px_#E8B4F8]" />
          <span className="font-mono text-xs text-[#A098A8] tracking-[0.2em] uppercase">
            SYSTEM INITIALIZATION // ARCHITECTURE SETUP
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8B4F8]/15 text-[#E8B4F8] font-mono text-[10px] font-semibold border border-[#E8B4F8]/30">
            MANDATORY
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Select Your Operating Architecture
        </h1>

        <p className="text-xs sm:text-sm text-[#A098A8] leading-relaxed max-w-xl">
          Choose the environment engineered for your operational model. This permanently locks your workspace telemetry,
          Kanban pipeline matrices, and client portal provisioning rails.
        </p>
      </div>

      {/* Two Frosted Glass Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Option A: Freelance OS */}
        <div
          onClick={() => !isPending && handleSelect("freelance")}
          className={`relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] ${
            selectedMode === "freelance"
              ? "border-[#E8B4F8] bg-white/[0.08] shadow-[0_0_30px_rgba(232,180,248,0.25)]"
              : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-2xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8] group-hover:scale-105 transition-transform">
                <Briefcase className="h-6 w-6 stroke-[2]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8B4F8]/15 text-[#E8B4F8] font-mono text-[10px] font-bold border border-[#E8B4F8]/30 tracking-wider">
                OPTION A // SOLO
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Freelance OS
              </h2>
              <span className="text-xs font-mono text-[#A098A8]">v2.4</span>
            </div>

            <p className="text-xs text-[#A098A8] leading-relaxed mb-6 font-normal">
              Engineered for independent design engineers, technical consultants, and boutique studio operators running sprints and retainers.
            </p>

            {/* Spec Sheet / Feature List */}
            <div className="flex flex-col gap-3 py-4 border-t border-b border-white/10 mb-6">
              {[
                "Deal Pipeline Kanban with Lead Stages",
                "Client Magic Portal Link Generation",
                "Live Billable Stopwatch & Accrual Telemetry",
                "Direct Wire & Retainer Invoicing (₹ INR)",
                "Contact Rolodex & Acquisition Velocity",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-[#E2DCE7]">
                  <Check className="h-3.5 w-3.5 text-[#E8B4F8] shrink-0 stroke-[2.5]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 shadow-[0_0_20px_rgba(178,112,162,0.35)] cursor-pointer"
          >
            {isPending && selectedMode === "freelance" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Initializing Freelance OS...</span>
              </>
            ) : (
              <>
                <span>Initialize Freelance OS</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* Option B: Business OS */}
        <div
          onClick={() => !isPending && handleSelect("business")}
          className={`relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl backdrop-blur-2xl border transition-all duration-300 cursor-pointer group shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] ${
            selectedMode === "business"
              ? "border-[#E8B4F8] bg-white/[0.08] shadow-[0_0_30px_rgba(232,180,248,0.25)]"
              : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-2xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8] group-hover:scale-105 transition-transform">
                <Building2 className="h-6 w-6 stroke-[2]" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8B4F8]/15 text-[#E8B4F8] font-mono text-[10px] font-bold border border-[#E8B4F8]/30 tracking-wider">
                OPTION B // AGENCY
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Business OS
              </h2>
              <span className="text-xs font-mono text-[#A098A8]">v2.4</span>
            </div>

            <p className="text-xs text-[#A098A8] leading-relaxed mb-6 font-normal">
              Engineered for scaling digital agencies, full-service studios, and multi-seat firms tracking B2B client accounts and cash settlements.
            </p>

            {/* Spec Sheet / Feature List */}
            <div className="flex flex-col gap-3 py-4 border-t border-b border-white/10 mb-6">
              {[
                "B2B Client Directory & Retention Health",
                "Lifetime Value (LTV) & Churn Analysis",
                "Sales Ledger & Net 14/30 Invoice Processing",
                "Unit Economics & Margin Benchmark Charts",
                "Multi-rail Liquidity & Settlement Vaults",
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-[#E2DCE7]">
                  <Check className="h-3.5 w-3.5 text-[#E8B4F8] shrink-0 stroke-[2.5]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 shadow-[0_0_20px_rgba(178,112,162,0.35)] cursor-pointer"
          >
            {isPending && selectedMode === "business" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Initializing Business OS...</span>
              </>
            ) : (
              <>
                <span>Initialize Business OS</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Footer Guarantee */}
      <div className="flex items-center gap-2 mt-10 text-[11px] font-mono text-[#A098A8]">
        <ShieldCheck className="h-4 w-4 text-[#E8B4F8]" />
        <span>Cryptographically verified isolation • Single-tenant data boundaries</span>
      </div>
    </div>
  );
}
