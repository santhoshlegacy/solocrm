"use client";

import dynamic from "next/dynamic";
import React from "react";

const InsightsBarChart = dynamic(
  () => import("./InsightsBarChart").then((mod) => ({ default: mod.InsightsBarChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] animate-pulse flex items-end gap-3 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 flex gap-1 items-end h-full">
            <div
              className="flex-1 bg-gradient-to-t from-[#B270A2]/20 to-[#E8B4F8]/40 rounded-t-lg"
              style={{ height: `${30 + (i * 5) % 60}%` }}
            />
            <div
              className="flex-1 bg-white/[0.06] rounded-t-lg"
              style={{ height: `${15 + (i * 3) % 25}%` }}
            />
          </div>
        ))}
      </div>
    ),
  }
);

export default InsightsBarChart;
