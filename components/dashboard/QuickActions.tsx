"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Zap,
  Receipt,
  UserPlus,
  DollarSign,
  FileText,
  Play,
  Pause,
  Square,
} from "lucide-react";

export const QuickActions: React.FC = () => {
  const [seconds, setSeconds] = useState(15807); // ~04:23:27
  const [isRunning, setIsRunning] = useState(true);

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

  const billableAmount = ((seconds / 3600) * 175).toFixed(2);

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Actions & Session Card */}
      <GlassCard className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#d41514]" />
            <h3 className="font-display text-base font-bold text-white tracking-tight">
              Quick Actions
            </h3>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">Shortcuts</span>
        </div>

        {/* 4 Shortcut Action Tiles */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] hover:-translate-y-[1px] transition-all duration-150 group text-center shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.03] border border-white/[0.07] text-[#d41514] mb-2 group-hover:scale-105 transition-transform">
              <Receipt className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#d4d4d8] group-hover:text-white transition-colors">
              Send Invoice
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] hover:-translate-y-[1px] transition-all duration-150 group text-center shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.03] border border-white/[0.07] text-[#d41514] mb-2 group-hover:scale-105 transition-transform">
              <UserPlus className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#d4d4d8] group-hover:text-white transition-colors">
              New Lead
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] hover:-translate-y-[1px] transition-all duration-150 group text-center shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.03] border border-white/[0.07] text-[#a1a1aa] mb-2 group-hover:scale-105 transition-transform">
              <DollarSign className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#d4d4d8] group-hover:text-white transition-colors">
              Log Expense
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/[0.06] bg-[#111114] hover:bg-[#15151a] hover:border-white/[0.12] hover:-translate-y-[1px] transition-all duration-150 group text-center shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.03] border border-white/[0.07] text-[#d41514] mb-2 group-hover:scale-105 transition-transform">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-[#d4d4d8] group-hover:text-white transition-colors">
              Draft Proposal
            </span>
          </button>
        </div>

        {/* Live Active Session Box */}
        <div className="p-4 rounded-lg border border-white/[0.07] bg-[#111114] relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#d41514] animate-pulse" />
              <span className="text-xs font-semibold text-white">Active Sprint Tracker</span>
            </div>
            <span className="rounded-md bg-[#d41514]/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#e03837] border border-[#d41514]/25">
              Veloce AI
            </span>
          </div>

          <p className="text-xs text-[#a1a1aa] font-normal mb-3">
            Design Tokens Extraction &amp; System Refactor
          </p>

          <div className="flex items-baseline justify-between mb-4">
            <span className="font-mono text-3xl font-bold tracking-tight text-white tabular-nums">
              {formatTime(seconds)}
            </span>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.12em]">Accrued Value</span>
              <span className="font-mono text-sm font-bold text-[#d41514] tabular-nums">
                +${billableAmount}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#d41514] hover:bg-[#bd1211] text-white text-xs font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_8px_-1px_rgba(212,21,20,0.4)] transition-all active:scale-95"
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
              className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.04] text-[#a1a1aa] hover:text-white hover:border-white/[0.14] transition-colors"
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
