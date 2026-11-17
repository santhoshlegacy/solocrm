"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  History,
  Receipt,
  FileCheck,
  CloudUpload,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface ActivityRecord {
  id: string;
  title: string;
  client: string;
  description: string;
  amount?: string;
  time: string;
  type: "payment" | "contract" | "upload" | "pending";
  statusVariant: "paid" | "contract" | "delivered" | "warning";
  statusLabel: string;
}

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLiveActivity() {
      try {
        const supabase = createClient();
        const formatINR = (num: number) => {
          return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(num);
        };

        const [salesRes, leadsRes] = await Promise.all([
          supabase.from("sales").select("*").order("created_at", { ascending: false }).limit(4),
          supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(4),
        ]);

        const items: ActivityRecord[] = [];

        if (salesRes.data) {
          for (const s of salesRes.data) {
            const isPaid = (s.status || "").toLowerCase() === "paid";
            items.push({
              id: `sale-${s.id}`,
              title: s.invoice_number ? `Invoice #${s.invoice_number}` : `Ledger Invoice`,
              client: s.client_name || s.client || "Client Entity",
              description: s.service || s.description || "Consulting & Deliverables",
              amount: s.amount ? formatINR(Number(s.amount)) : undefined,
              time: s.created_at
                ? new Date(s.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                : "Recent",
              type: isPaid ? "payment" : "pending",
              statusVariant: isPaid ? "paid" : "warning",
              statusLabel: s.status || "Draft",
            });
          }
        }

        if (leadsRes.data) {
          for (const l of leadsRes.data) {
            const isWon = (l.status || "").toLowerCase() === "won";
            items.push({
              id: `lead-${l.id}`,
              title: isWon ? `Deal Closed • ${l.company || l.name}` : `Lead Added • ${l.company || l.name}`,
              client: l.name || l.company || "Enterprise Lead",
              description: `${l.status || "Pitched"} stage`,
              amount: l.value ? formatINR(Number(l.value)) : undefined,
              time: l.created_at
                ? new Date(l.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
                : "Recent",
              type: isWon ? "contract" : "upload",
              statusVariant: isWon ? "delivered" : "contract",
              statusLabel: l.status || "In Flight",
            });
          }
        }

        setActivities(items.slice(0, 5));
      } catch (err) {
        console.warn("Live activity fetch warning:", err);
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveActivity();
  }, []);

  const getIcon = (type: ActivityRecord["type"]) => {
    switch (type) {
      case "payment":
        return <Receipt className="h-4 w-4 text-[#E8B4F8]" />;
      case "contract":
        return <FileCheck className="h-4 w-4 text-[#E8B4F8]" />;
      case "upload":
        return <CloudUpload className="h-4 w-4 text-[#A098A8]" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-300" />;
      default:
        return <Receipt className="h-4 w-4 text-[#A098A8]" />;
    }
  };

  const getBadgeStyle = (variant: ActivityRecord["statusVariant"]) => {
    switch (variant) {
      case "paid":
        return "bg-[#E8B4F8]/15 text-[#E8B4F8] border border-[#E8B4F8]/30 rounded-full";
      case "contract":
        return "bg-white/[0.05] text-[#A098A8] border border-white/10 rounded-full";
      case "delivered":
        return "bg-[#B270A2]/20 text-[#E8B4F8] border border-[#B270A2]/40 rounded-full";
      case "warning":
        return "bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full";
      default:
        return "bg-white/[0.05] text-[#A098A8] border border-white/10 rounded-full";
    }
  };

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] shadow-sm">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight text-[#E2DCE7]">
              Recent Activity &amp; Milestones
            </h3>
            <p className="text-xs text-[#A098A8] font-normal">
              Latest invoices, deliverables, and verified signatures
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-widest text-[#A098A8]">
          {isLoading ? "Syncing..." : `${activities.length} Recorded`}
        </span>
      </div>

      {/* Activity List or Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 text-center text-[#A098A8] font-mono text-xs">
          <div className="h-5 w-5 border-2 border-[#E8B4F8] border-t-transparent rounded-full animate-spin mb-2" />
          Fetching live activity...
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] mb-3">
            <History className="h-4 w-4" />
          </div>
          <h4 className="font-display text-sm font-semibold text-white tracking-tight mb-1">
            Zero Recorded Milestones
          </h4>
          <p className="text-xs text-[#A098A8] max-w-sm font-normal">
            Issued invoices, deal transitions, and signed proposals will synchronize here automatically.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 transition-all gap-3 shadow-sm"
            >
              {/* Left section: icon + title + description */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 flex-shrink-0">
                  {getIcon(act.type)}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#E2DCE7] truncate">
                      {act.title}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono font-medium tracking-wide",
                        getBadgeStyle(act.statusVariant)
                      )}
                    >
                      {act.statusVariant === "paid" && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] shadow-[0_0_6px_#E8B4F8]" />
                      )}
                      {act.statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#A098A8] font-normal mt-0.5">
                    <span className="truncate">{act.client}</span>
                    <span>•</span>
                    <span className="truncate">{act.description}</span>
                  </div>
                </div>
              </div>

              {/* Right section: amount + time */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                {act.amount && (
                  <span className="font-display text-sm font-bold text-[#E2DCE7] tabular-nums">
                    {act.amount}
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#A098A8]">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};
