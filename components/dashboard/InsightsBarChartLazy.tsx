"use client";

import dynamic from "next/dynamic";
import React from "react";

const InsightsBarChart = dynamic(
  () => import("./InsightsBarChart").then((mod) => ({ default: mod.InsightsBarChart })),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 w-full rounded-lg bg-[#0e0e11] border border-white/[0.07] shadow-luxury animate-pulse flex items-end gap-3 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 flex gap-1 items-end h-full">
            <div
              className="flex-1 bg-[#d41514]/25 rounded-t-sm"
              style={{ height: `${30 + (i * 5) % 60}%` }}
            />
            <div
              className="flex-1 bg-white/[0.06] rounded-t-sm"
              style={{ height: `${15 + (i * 3) % 25}%` }}
            />
          </div>
        ))}
      </div>
    ),
  }
);

export default InsightsBarChart;
