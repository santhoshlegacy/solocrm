"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckSquare, CheckCircle2 } from "lucide-react";
import { cn, formatINR } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  progress: number;
  colorVariant: "primary" | "secondary" | "dim";
}

export const ActiveDeadlines: React.FC = () => {
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [goalStats, setGoalStats] = useState<{
    current: number;
    target: number;
    percentage: number;
  }>({
    current: 0,
    target: 500000,
    percentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDeadlines() {
      try {
        const supabase = createClient();

        // 1. Fetch sales
        const { data: sales } = await supabase
          .from("sales")
          .select("*")
          .order("created_at", { ascending: false });

        const salesList = sales || [];
        const pendingSales = salesList.filter(
          (s: any) => (s.status || "").toLowerCase() !== "paid"
        );

        // Calculate goal: sum of paid sales against INR target with zero-division safety
        const paidRevenue = salesList
          .filter((s: any) => (s.status || "").toLowerCase() === "paid")
          .reduce((sum: number, s: any) => {
            const val = Number(s.amount);
            return sum + (Number.isFinite(val) ? val : 0);
          }, 0);

        const target = 500000;
        const rawPercentage = target > 0 ? (paidRevenue / target) * 100 : 0;
        const percentage = Number.isFinite(rawPercentage) ? Math.min(100, Math.max(0, Math.round(rawPercentage))) : 0;

        setGoalStats({
          current: Number.isFinite(paidRevenue) ? paidRevenue : 0,
          target,
          percentage,
        });

        // Map pending sales or leads to deadlines
        if (pendingSales.length > 0) {
          const items: DeadlineItem[] = pendingSales.slice(0, 3).map((s: any, idx: number) => {
            const progress = s.status === "Sent" ? 75 : 40;
            return {
              id: s.id,
              title: s.client_name || s.client || `Invoice #${s.invoice_number || idx + 1}`,
              dueDate: s.due_date || "Maturity Net 14",
              description: s.service || "Pending invoice settlement & remittance",
              progress,
              colorVariant: idx === 0 ? "primary" : "secondary",
            };
          });
          setDeadlines(items);
        } else {
          // If no pending sales, check for in-flight leads
          const { data: leads } = await supabase
            .from("leads")
            .select("*")
            .neq("status", "Won")
            .order("created_at", { ascending: false })
            .limit(3);

          if (leads && leads.length > 0) {
            const items: DeadlineItem[] = leads.map((l: any, idx: number) => {
              const progress = l.status === "Pitched" ? 60 : 30;
              return {
                id: l.id,
                title: l.company || l.name || "Enterprise Lead",
                dueDate: "In Flight",
                description: `${l.status || "Lead"} • ${formatINR(Number(l.value) || 0)} valuation`,
                progress,
                colorVariant: idx === 0 ? "primary" : "secondary",
              };
            });
            setDeadlines(items);
          } else {
            setDeadlines([]);
          }
        }
      } catch (err) {
        console.warn("Active deadlines fetch warning:", err);
        setDeadlines([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeadlines();
  }, []);

  const getProgressColor = (variant: "primary" | "secondary" | "dim") => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-[#B270A2] to-[#E8B4F8]";
      case "secondary":
        return "bg-[#E8B4F8]/70";
      case "dim":
        return "bg-white/20";
      default:
        return "bg-gradient-to-r from-[#B270A2] to-[#E8B4F8]";
    }
  };

  return (
    <GlassCard className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-[#E8B4F8]" />
          <h3 className="font-display text-base font-bold text-[#E2DCE7] tracking-tight">
            Active Deadlines
          </h3>
        </div>
        <span className="rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30">
          {isLoading ? "Checking..." : `${deadlines.length} Active`}
        </span>
      </div>

      {/* Deadline Items */}
      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <div className="p-6 text-center text-[#A098A8] font-mono text-xs">
            Scanning schedule...
          </div>
        ) : deadlines.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] mb-2">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h4 className="font-display text-xs font-semibold text-white tracking-tight mb-0.5">
              Zero Pending Deadlines
            </h4>
            <p className="text-[11px] text-[#A098A8] font-normal">
              All deliverables, milestones, and invoice maturities are settled.
            </p>
          </div>
        ) : (
          deadlines.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#E2DCE7] truncate">
                  {item.title}
                </span>
                <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-mono text-[#A098A8] border border-white/10">
                  {item.dueDate}
                </span>
              </div>

              <p className="text-[11px] text-[#A098A8] font-normal truncate">
                {item.description}
              </p>

              {/* Progress Bar & Percentage */}
              <div className="mt-1 flex items-center gap-2.5">
                <div className="h-1.5 flex-1 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      getProgressColor(item.colorVariant)
                    )}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] font-semibold text-[#A098A8] tabular-nums">
                  {item.progress}%
                </span>
              </div>
            </div>
          ))
        )}

        {/* Monthly Goal Progress summary card */}
        <div className="flex items-center justify-between p-3.5 mt-1 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#E2DCE7]">Monthly Target Cadence</span>
              <span className="text-[11px] text-[#A098A8] font-mono">
                {formatINR(goalStats.current)} / {formatINR(goalStats.target)}
              </span>
            </div>
          </div>
          <span className="font-mono font-bold text-sm text-[#E8B4F8] tabular-nums">
            {goalStats.percentage}%
          </span>
        </div>
      </div>
    </GlassCard>
  );
};
