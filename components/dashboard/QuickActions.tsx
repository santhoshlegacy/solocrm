"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatINR } from "@/lib/utils";
import {
  Zap,
  Receipt,
  UserPlus,
  DollarSign,
  FileText,
  Play,
  Pause,
  Square,
  Sparkles,
} from "lucide-react";

export const QuickActions: React.FC = () => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(15807); // ~04:23:27
  const [isRunning, setIsRunning] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSec % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const rawBillable = (seconds / 3600) * 14500;
  const billableAmount = Number.isFinite(rawBillable) ? Math.round(rawBillable) : 0;

  const showSpinningUpToast = () => {
    setToastMessage("Module spinning up...");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-[#E8B4F8]/30 bg-[#140D1B]/95 backdrop-blur-xl p-3 text-xs text-[#E8B4F8] flex items-center gap-2 shadow-2xl font-mono"
          >
            <Sparkles className="h-4 w-4 text-[#E8B4F8] shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions & Session Card */}
      <GlassCard className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#E8B4F8]" />
            <h3 className="font-display text-base font-bold text-[#E2DCE7] tracking-tight">
              Quick Actions
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
            Shortcuts
          </span>
        </div>

        {/* 4 Shortcut Action Tiles */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button
            onClick={() => router.push("/sales?new=true")}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-[1px] transition-all duration-150 group text-center shadow-sm cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] mb-2 group-hover:scale-105 transition-transform">
              <Receipt className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#E2DCE7] group-hover:text-white transition-colors">
              Send Invoice
            </span>
          </button>

          <button
            onClick={() => router.push("/leads?new=true")}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-[1px] transition-all duration-150 group text-center shadow-sm cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] mb-2 group-hover:scale-105 transition-transform">
              <UserPlus className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#E2DCE7] group-hover:text-white transition-colors">
              New Lead
            </span>
          </button>

          <button
            onClick={showSpinningUpToast}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-[1px] transition-all duration-150 group text-center shadow-sm cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#A098A8] mb-2 group-hover:scale-105 transition-transform">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#E2DCE7] group-hover:text-white transition-colors">
              Log Expense
            </span>
          </button>

          <button
            onClick={showSpinningUpToast}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-[1px] transition-all duration-150 group text-center shadow-sm cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] mb-2 group-hover:scale-105 transition-transform">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#E2DCE7] group-hover:text-white transition-colors">
              Draft Proposal
            </span>
          </button>
        </div>

        {/* Live Active Session Box */}
        <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#E8B4F8] animate-pulse shadow-[0_0_8px_#E8B4F8]" />
              <span className="text-xs font-semibold text-[#E2DCE7]">Active Sprint Tracker</span>
            </div>
            <span className="rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30">
              Veloce AI
            </span>
          </div>

          <p className="text-xs text-[#A098A8] font-normal mb-3">
            Design Tokens Extraction &amp; System Refactor
          </p>

          <div className="flex items-baseline justify-between mb-4">
            <span className="font-mono text-3xl font-bold tracking-tight text-[#E2DCE7] tabular-nums">
              {formatTime(seconds)}
            </span>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-[#A098A8] uppercase tracking-[0.12em]">
                Accrued Value
              </span>
              <span className="font-mono text-sm font-bold text-[#E8B4F8] tabular-nums">
                +{formatINR(billableAmount)}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35),inset_0_1px_0_0_rgba(255,255,255,0.25)] transition-all active:scale-95 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsRunning(false);
                setSeconds(0);
              }}
              className="p-2.5 rounded-full border border-white/10 bg-white/[0.04] text-[#A098A8] hover:text-white hover:border-white/20 transition-colors cursor-pointer"
              title="Stop & Log"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
