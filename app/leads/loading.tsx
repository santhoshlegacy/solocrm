import React from "react";

export default function LeadsLoading() {
  return (
    <div className="flex flex-col gap-6 pt-2 w-full animate-in fade-in duration-150">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <div className="h-5 w-28 rounded-full bg-[#E8B4F8]/15 border border-[#E8B4F8]/25 animate-pulse" />
            <div className="h-3 w-20 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="h-8 w-64 lg:w-80 rounded-xl bg-white/15 animate-pulse" />
          <div className="h-4 w-72 lg:w-96 rounded-lg bg-white/[0.02] border border-white/5 animate-pulse" />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-9 w-28 rounded-full bg-gradient-to-r from-[#B270A2]/30 to-[#7A5A97]/30 border border-white/10 animate-pulse" />
        </div>
      </div>

      {/* 4 KPI Glass Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)] p-5 flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-white/[0.06] animate-pulse" />
              <div className="h-8 w-8 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 animate-pulse" />
            </div>
            <div className="h-7 w-32 rounded bg-white/[0.08] animate-pulse my-2" />
            <div className="h-2.5 w-20 rounded bg-[#E8B4F8]/20 animate-pulse" />
          </div>
        ))}
      </div>

      {/* 4 Kanban Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {["Contacted", "Pitched", "Won", "Lost"].map((col) => (
          <div
            key={col}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#E8B4F8] animate-pulse" />
                <div className="h-4 w-20 rounded bg-white/[0.08] animate-pulse" />
              </div>
              <div className="h-4 w-8 rounded-full bg-white/[0.04] animate-pulse" />
            </div>

            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2.5 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-28 rounded bg-white/[0.08]" />
                  <div className="h-3.5 w-14 rounded-full bg-[#E8B4F8]/20" />
                </div>
                <div className="h-3 w-40 rounded bg-white/[0.04]" />
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="h-3 w-16 rounded bg-[#E8B4F8]/20" />
                  <div className="h-3 w-12 rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
