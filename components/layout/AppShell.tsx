"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { WorkspaceModeProvider } from "@/lib/workspace-context";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup");
  const isOnboarding = pathname?.startsWith("/onboarding");
  const isPortal = pathname?.startsWith("/portal");

  if (isAuthPage) {
    return (
      <div className="min-h-screen text-[#E2DCE7] bg-transparent flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#B270A2]/15 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#7A5A97]/15 blur-[140px]" />
        </div>
        <main className="w-full max-w-md mx-auto relative z-10">{children}</main>
      </div>
    );
  }

  if (isOnboarding) {
    return (
      <div className="min-h-screen text-[#E2DCE7] bg-transparent flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#B270A2]/15 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#7A5A97]/15 blur-[140px]" />
        </div>
        <main className="w-full max-w-5xl mx-auto relative z-10">{children}</main>
      </div>
    );
  }

  if (isPortal) {
    return (
      <div className="min-h-screen text-[#E2DCE7] bg-transparent flex flex-col justify-start relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#B270A2]/15 blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] rounded-full bg-[#7A5A97]/15 blur-[140px]" />
        </div>
        <main className="w-full min-h-screen relative z-10">{children}</main>
      </div>
    );
  }

  return (
    <WorkspaceModeProvider>
      <div className="min-h-screen text-[#E2DCE7] bg-transparent relative z-10">
        {/* Ambient Dark Violet Glow Orbs for Soft Mesh Depth */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-[#B270A2]/10 blur-[140px]" />
          <div className="absolute top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-[#7A5A97]/15 blur-[160px]" />
          <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[#E8B4F8]/10 blur-[130px]" />
        </div>

        {/* 1. Persistent Animated Dynamic Sidebar */}
        <Sidebar />

        {/* Main Content Area (offset by sidebar width on desktop) */}
        <div className="pl-0 lg:pl-72 print:pl-0 transition-all duration-300">
          {/* Persistent Top Navigation Bar with Mode Switcher */}
          <Header />

          {/* 2. Page-Level Loading & Transitions: Keyed motion.div prevents Framer Motion App Router deadlock */}
          <main className="relative z-10 px-6 lg:px-8 pb-16 max-w-[1440px] mx-auto w-full print:p-0 print:m-0 print:max-w-none">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </WorkspaceModeProvider>
  );
};
