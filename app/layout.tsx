import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoloCRM | Frosted Glass Executive OS",
  description: "Executive freelancer dashboard & financial telemetry crafted in premium frosted glass and violet ambient glow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gradient-to-br from-[#120B18] via-[#09050F] to-[#1C0D22] text-[#E2DCE7] min-h-screen relative overflow-x-hidden selection:bg-[#E8B4F8] selection:text-[#120B18]">
        {/* Global AppShell with Persistent Sidebar & Transitions */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
