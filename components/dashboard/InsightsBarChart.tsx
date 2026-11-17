"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { BarChart3 } from "lucide-react";

export interface MonthlyInsight {
  month: string;
  revenue: number;
  billed?: number;
  expenses?: number;
}

export const InsightsBarChart: React.FC<{ data?: MonthlyInsight[] }> = ({ data = [] }) => {
  const hasData =
    data.length > 0 &&
    data.some(
      (d) =>
        (d.revenue && d.revenue > 0) ||
        (d.billed && d.billed > 0) ||
        (d.expenses && d.expenses > 0)
    );

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] mb-2">
          <BarChart3 className="h-5 w-5" />
        </div>
        <h4 className="font-display text-xs font-semibold text-white tracking-tight mb-0.5">
          Zero Capital Inflow Telemetry
        </h4>
        <p className="text-[11px] text-[#A098A8] font-normal">
          No billed or settled invoice capital recorded in the selected accounting cycle.
        </p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#888191"
            fontSize={11}
            fontFamily="'JetBrains Mono', monospace"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888191"
            fontSize={11}
            fontFamily="'JetBrains Mono', monospace"
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => {
              const n = Number(val);
              if (!Number.isFinite(n)) return "₹0";
              return `₹${n >= 1000 ? `${Math.round(n / 1000)}k` : n}`;
            }}
          />
          <Tooltip
            formatter={(value: any, name: any) => [
              `₹${Number(value).toLocaleString("en-IN")}`,
              name === "revenue" ? "Settled" : name === "billed" ? "Billed" : name,
            ]}
            contentStyle={{
              backgroundColor: "rgba(20, 13, 27, 0.95)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "16px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
              color: "#E2DCE7",
              fontSize: "12px",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          />
          <Bar
            dataKey="revenue"
            name="Settled"
            fill="#E8B4F8"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="billed"
            name="Billed"
            fill="rgba(255, 255, 255, 0.15)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InsightsBarChart;
