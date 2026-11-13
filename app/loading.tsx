import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 pt-2 w-full animate-in fade-in duration-150">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-28 rounded-full bg-[#d41514]/15 border border-[#d41514]/25 animate-pulse" />
            <div className="h-3 w-20 rounded bg-[#cdcbca]/10 animate-pulse" />
          </div>
          <div className="h-8 w-64 lg:w-80 rounded-xl bg-[#cdcbca]/15 animate-pulse" />
          <div className="h-4 w-72 lg:w-96 rounded-lg bg-white/[0.02] border border-[#cdcbca]/5 animate-pulse" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#d41514]/25 bg-[#d41514]/10 text-[11px] font-mono text-[#d41514]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d41514] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d41514]" />
            </span>
            <span>Syncing telemetry...</span>
          </div>
          <div className="h-9 w-28 rounded-xl bg-[#d41514]/20 border border-[#d41514]/30 animate-pulse" />
        </div>
      </div>

      {/* 4 KPI Glass Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg bg-[#0e0e11] border border-white/[0.07] shadow-luxury p-5 flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-white/[0.06] animate-pulse" />
              <div className="h-7 w-7 rounded-lg bg-white/[0.03] border border-white/[0.06] animate-pulse" />
            </div>
            <div className="h-7 w-32 rounded bg-white/[0.08] animate-pulse my-2" />
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-16 rounded bg-[#d41514]/20 animate-pulse" />
              <div className="h-2.5 w-24 rounded bg-white/[0.04] animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton (8 Cols / 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Large Chart/Table Skeleton */}
        <div className="lg:col-span-8 rounded-lg bg-[#0e0e11] border border-white/[0.07] shadow-luxury p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/[0.03] border border-white/[0.06] animate-pulse" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-44 rounded bg-white/[0.06] animate-pulse" />
                <div className="h-3 w-60 rounded bg-white/[0.03] animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 rounded bg-white/[0.04] animate-pulse" />
              <div className="h-6 w-16 rounded bg-[#d41514]/20 border border-[#d41514]/30 animate-pulse" />
            </div>
          </div>

          {/* Faux Chart Area */}
          <div className="h-64 w-full rounded-lg bg-white/[0.02] border border-white/[0.05] p-4 flex items-end justify-between gap-3">
            {[45, 65, 52, 80, 68, 92, 75, 88, 95, 78, 85, 90].map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full rounded-t-sm bg-[#d41514]/20 border-t border-[#d41514]/40 animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${idx * 60}ms` }}
                />
                <div className="h-2 w-6 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel Skeleton */}
        <div className="lg:col-span-4 rounded-lg bg-[#0e0e11] border border-white/[0.07] shadow-luxury p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="h-4 w-32 rounded bg-white/[0.06] animate-pulse" />
            <div className="h-3 w-12 rounded bg-[#d41514]/20 animate-pulse" />
          </div>

          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg border border-white/[0.06] bg-[#111114] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.03] animate-pulse" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-3 w-28 rounded bg-white/[0.06] animate-pulse" />
                    <div className="h-2.5 w-20 rounded bg-white/[0.03] animate-pulse" />
                  </div>
                </div>
                <div className="h-4 w-12 rounded bg-[#d41514]/20 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
