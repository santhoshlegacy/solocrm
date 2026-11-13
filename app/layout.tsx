import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoloCRM | Matte Obsidian Executive OS",
  description: "Executive freelancer dashboard & financial telemetry crafted in precision matte obsidian and laser crimson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#080808] text-[#cdcbca] min-h-screen relative overflow-x-hidden selection:bg-[#d41514] selection:text-white">
        {/* Global AppShell with Persistent Sidebar & Transitions */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
