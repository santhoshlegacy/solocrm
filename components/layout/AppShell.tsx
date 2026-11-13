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

  if (isAuthPage) {
    return (
      <div className="min-h-screen text-[#cdcbca] bg-[#080808] flex items-center justify-center p-4">
        <main className="w-full max-w-md mx-auto">{children}</main>
      </div>
    );
  }

  return (
    <WorkspaceModeProvider>
      <div className="min-h-screen text-[#cdcbca] bg-[#080808] relative z-10">
        {/* 1. Persistent Animated Dynamic Sidebar */}
        <Sidebar />

        {/* Main Content Area (offset by sidebar width on desktop) */}
        <div className="pl-0 lg:pl-72 transition-all duration-300">
          {/* Persistent Top Navigation Bar with Mode Switcher */}
          <Header />

          {/* 2. Page-Level Loading & Transitions: Keyed motion.div prevents Framer Motion App Router deadlock */}
          <main className="relative z-10 px-6 lg:px-8 pb-16 max-w-[1440px] mx-auto w-full">
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
