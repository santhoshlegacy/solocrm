import React from "react";

export default function LeadsLoading() {
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
          <div className="h-9 w-28 rounded-xl bg-[#d41514]/20 border border-[#d41514]/30 animate-pulse" />
        </div>
      </div>

      {/* 4 KPI Glass Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-md bg-[#111111] border border-[#222] p-5 flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-[#222] animate-pulse" />
              <div className="h-7 w-7 rounded-md bg-[#161616] border border-[#222] animate-pulse" />
            </div>
            <div className="h-7 w-32 rounded bg-[#1e1e1e] animate-pulse my-2" />
            <div className="h-2.5 w-20 rounded bg-[#d41514]/20 animate-pulse" />
          </div>
        ))}
      </div>

      {/* 4 Kanban Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {["Contacted", "Pitched", "Won", "Lost"].map((col) => (
          <div
            key={col}
            className="rounded-md border border-[#222] bg-[#111111] p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#222]">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#d41514] animate-pulse" />
                <div className="h-4 w-20 rounded bg-[#222] animate-pulse" />
              </div>
              <div className="h-4 w-8 rounded bg-[#1e1e1e] animate-pulse" />
            </div>

            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="rounded-md border border-[#222] bg-[#141414] p-4 flex flex-col gap-2.5 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-28 rounded bg-[#222]" />
                  <div className="h-3.5 w-14 rounded bg-[#d41514]/20" />
                </div>
                <div className="h-3 w-40 rounded bg-[#1a1a1a]" />
                <div className="flex items-center justify-between pt-2 border-t border-[#222]">
                  <div className="h-3 w-16 rounded bg-[#d41514]/20" />
                  <div className="h-3 w-12 rounded bg-[#222]" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
