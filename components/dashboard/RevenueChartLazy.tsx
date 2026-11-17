"use client";

import dynamic from "next/dynamic";
import React from "react";

const RevenueChart = dynamic<{
  sales?: any[];
  leads?: any[];
  mode?: "freelancer" | "business";
}>(
  () => import("./RevenueChart").then((mod) => ({ default: mod.RevenueChart })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg bg-[#0e0e11] border border-white/[0.07] shadow-luxury p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/[0.07]" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-40 bg-white/[0.06] rounded" />
              <div className="h-3 w-56 bg-white/[0.03] rounded" />
            </div>
          </div>
          <div className="h-7 w-44 bg-white/[0.03] rounded-lg border border-white/[0.06]" />
        </div>
        <div className="h-64 sm:h-72 w-full rounded-lg bg-white/[0.02] border border-white/[0.05]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-3 border-t border-white/[0.06]">
          <div className="h-14 rounded-lg bg-white/[0.02] border border-white/[0.05]" />
          <div className="h-14 rounded-lg bg-white/[0.02] border border-white/[0.05]" />
          <div className="h-14 rounded-lg bg-white/[0.02] border border-white/[0.05]" />
        </div>
      </div>
    ),
  }
);

export default RevenueChart;
