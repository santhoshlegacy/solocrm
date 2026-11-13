"use client";

import React, { useState, useTransition } from "react";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import {
  User,
  Building,
  Mail,
  Clock,
  DollarSign,
  Terminal,
  CheckCircle2,
  Lock,
  Upload,
  Bot,
  Zap,
  Globe,
  Landmark,
  Send,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { USER_PROFILE } from "@/lib/mock-data";
import { updateProfile } from "@/actions/profile";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [webhooksEnabled, setWebhooksEnabled] = useState(true);
  const [autoReconcile, setAutoReconcile] = useState(true);
  const [publicReviews, setPublicReviews] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await updateProfile(formData);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 4000);
    });
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-2"
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#d41514]/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#d41514] border border-[#d41514]/20 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d41514] animate-pulse" />
              OPERATOR CONFIG
            </span>
            <span className="text-[#71717a] text-xs font-mono">• System v2.4</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white mt-0.5">
            Account &amp; Business Settings
          </h1>
          <p className="text-xs text-[#a1a1aa] max-w-2xl font-normal">
            Configure your freelancer identity, multi-currency invoicing parameters, background automation engines, and cryptographically verified keys.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-2.5">
          <button className="px-3.5 py-1.5 rounded-lg bg-[#0e0e11] hover:bg-white/[0.04] border border-white/[0.08] text-[#a1a1aa] hover:text-white text-xs font-mono transition-colors shadow-luxury">
            Audit Log
          </button>
          <button
            type="submit"
            form="settings-profile-form"
            disabled={isPending}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#d41514] hover:bg-[#b5100f] text-white text-xs font-semibold active:scale-[0.98] transition-all shadow-luxury disabled:opacity-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isPending ? "Syncing..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg border border-[#d41514]/30 bg-[#0e0e11] p-3 text-xs text-[#d41514] flex items-center gap-2.5 shadow-luxury-elevated"
          >
            <CheckCircle2 className="h-4 w-4 text-[#d41514]" />
            <span className="font-medium font-mono">
              All freelance business settings and billing schemas synced successfully via Server Action.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0e0e11] border border-white/[0.08] shadow-luxury overflow-x-auto">
        {[
          { id: "general", label: "General & Profile" },
          { id: "invoicing", label: "Invoicing & Tax" },
          { id: "notifications", label: "Notifications (3)" },
          { id: "integrations", label: "Connected Integrations" },
          { id: "security", label: "Security & Keys" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-[#d41514]/15 text-[#d41514] border border-[#d41514]/30"
                : "text-[#71717a] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Settings Grid: Left Column (7 cols) & Right Column (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile & Invoicing Engine */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Section 1: Profile & Freelance Identity Form */}
          <GlassCard className="p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 flex items-center justify-center text-[#d41514]">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-semibold text-white tracking-tight">
                    Profile &amp; Freelance Identity
                  </h2>
                  <p className="text-[11px] text-[#71717a] font-normal">
                    Public identity stamped on client proposals, agreements, and invoices
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#d41514]/10 text-[#d41514] font-mono text-[10px] font-medium border border-[#d41514]/20">
                VERIFIED OPERATOR
              </span>
            </div>

            {/* Avatar Bio Hub */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg border border-white/[0.06] bg-[#08080a] shadow-luxury">
              <div className="relative h-20 w-20 flex-shrink-0">
                <img
                  src={USER_PROFILE.avatar}
                  alt={USER_PROFILE.name}
                  className="h-full w-full rounded-lg object-cover ring-1 ring-white/[0.1] shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#d41514] ring-2 ring-[#080808] flex items-center justify-center shadow-md">
                  <Sparkles className="h-3 w-3 text-white" />
                </span>
              </div>
              <div className="flex flex-col flex-1 text-center sm:text-left gap-1">
                <span className="text-sm font-medium text-white">Avatar &amp; Brand Hologram</span>
                <p className="text-xs text-[#a1a1aa] max-w-sm font-normal">
                  Rendered on signature blocks and instant client payment links.
                </p>
                <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.03] hover:bg-white/[0.06] text-[#cdcbca] text-xs font-medium border border-white/[0.08] transition-all shadow-sm"
                  >
                    <Upload className="h-3 w-3 text-[#d41514]" />
                    <span>Change Photo</span>
                  </button>
                  <button
                    type="button"
                    className="px-2.5 py-1 rounded-md text-[#71717a] hover:text-rose-400 text-xs font-normal transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Form Inputs Matrix */}
            <form id="settings-profile-form" onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                  Full Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a]" />
                  <input
                    name="fullName"
                    type="text"
                    defaultValue="Santhosh Kumar"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                  Professional Title
                </label>
                <div className="relative">
                  <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a]" />
                  <input
                    name="professionalTitle"
                    type="text"
                    defaultValue="Senior UI/UX Designer & Full-Stack Engineer"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] truncate transition-colors shadow-luxury"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                  Business Entity
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a]" />
                  <input
                    name="businessEntity"
                    type="text"
                    defaultValue="SoloStudio Creative LLC"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a] flex items-center justify-between">
                  <span>Operating Email</span>
                  <Lock className="h-3 w-3 text-[#d41514]" />
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a]" />
                  <input
                    name="email"
                    type="email"
                    defaultValue="santhosh@solocrm.design"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] transition-colors shadow-luxury"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                  Primary Working Timezone
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717a]" />
                  <select
                    name="timezone"
                    defaultValue="pst"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] appearance-none cursor-pointer shadow-luxury"
                  >
                    <option value="pst">(GMT-08:00) Pacific Time (US &amp; Canada) - Active</option>
                    <option value="est">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                    <option value="utc">(GMT+00:00) UTC / London Greenwich</option>
                    <option value="ist">(GMT+05:30) India Standard Time</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                  Bio &amp; Global Invoice Note
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue="SoloStudio delivers precision UI/UX architecture and zero-overhead full-stack systems. Direct wire payments via Wise or Stripe. Inquiries: santhosh@solocrm.design."
                  className="w-full p-3 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] resize-none leading-relaxed shadow-luxury font-normal"
                />
              </div>
            </form>
          </GlassCard>

          {/* Section 2: Invoicing & Currency Engine */}
          <GlassCard className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 flex items-center justify-center text-[#d41514]">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                    Invoicing &amp; Currency Engine
                  </h3>
                  <p className="text-[11px] text-[#71717a] font-normal">
                    Default billing schemas applied dynamically across fresh client contracts
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[#d41514] font-mono font-medium bg-[#d41514]/10 px-2 py-0.5 rounded border border-[#d41514]/20">
                AUTO-SYNC ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                  Base Currency
                </label>
                <select
                  defaultValue="usd"
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] cursor-pointer shadow-luxury"
                >
                  <option value="usd">USD ($) • US Dollar</option>
                  <option value="eur">EUR (€) • Eurozone</option>
                  <option value="gbp">GBP (£) • British Pound</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                  Payment Terms
                </label>
                <select
                  defaultValue="net14"
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] cursor-pointer shadow-luxury"
                >
                  <option value="receipt">Due On Receipt (0 Days)</option>
                  <option value="net7">Net 7 Days</option>
                  <option value="net14">Net 14 Days (Standard)</option>
                  <option value="net30">Net 30 Days</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
                  Tax Calculation
                </label>
                <input
                  type="text"
                  defaultValue="8.25% - Auto Calculated"
                  className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-[#08080a] text-xs text-white focus:outline-none focus:border-[#d41514] shadow-luxury"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-white/[0.06] bg-[#08080a] flex items-center justify-between text-xs text-[#a1a1aa] font-normal shadow-luxury">
              <span>Wise &amp; Stripe payouts will auto-convert to <strong className="text-white">USD ($)</strong> via interbank spot rate.</span>
              <button type="button" className="text-[#d41514] text-xs font-mono font-medium hover:underline flex-shrink-0 ml-2">Edit FX</button>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Autonomous Routines & Toggle Switches */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard className="p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#d41514]/10 border border-[#d41514]/20 flex items-center justify-center text-[#d41514]">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                    Autonomous Routines
                  </h3>
                  <p className="text-[11px] text-[#71717a] font-normal">Zero-touch event dispatchers</p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-medium text-[#d41514] bg-[#d41514]/10 px-2 py-0.5 rounded border border-[#d41514]/20">
                3 ACTIVE
              </span>
            </div>

            {/* Toggle Switches */}
            <div className="flex flex-col gap-3">
              {/* Toggle 1 */}
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#08080a] flex items-center justify-between gap-3 shadow-luxury">
                <div className="flex items-start gap-2.5">
                  <Send className="h-4 w-4 text-[#d41514] mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">Auto-send invoice reminders</span>
                    <span className="text-[10px] text-[#71717a] font-normal">Pings client via email 3 days before maturity</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRemindersEnabled(!remindersEnabled)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                    remindersEnabled ? "bg-[#d41514]" : "bg-white/[0.1]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      remindersEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#08080a] flex items-center justify-between gap-3 shadow-luxury">
                <div className="flex items-start gap-2.5">
                  <Zap className="h-4 w-4 text-[#d41514] mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">Instant payment telemetry</span>
                    <span className="text-[10px] text-[#71717a] font-normal">Pushes real-time webhooks to Slack and SMS</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWebhooksEnabled(!webhooksEnabled)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                    webhooksEnabled ? "bg-[#d41514]" : "bg-white/[0.1]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      webhooksEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#08080a] flex items-center justify-between gap-3 shadow-luxury">
                <div className="flex items-start gap-2.5">
                  <Landmark className="h-4 w-4 text-[#d41514] mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">Bank feed auto-reconcile</span>
                    <span className="text-[10px] text-[#71717a] font-normal">Matches Stripe, Wise, and Mercury deposits</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoReconcile(!autoReconcile)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                    autoReconcile ? "bg-[#d41514]" : "bg-white/[0.1]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      autoReconcile ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4 */}
              <div className="p-3.5 rounded-lg border border-white/[0.06] bg-[#08080a] flex items-center justify-between gap-3 shadow-luxury opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-start gap-2.5">
                  <Globe className="h-4 w-4 text-[#71717a] mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">Client Portal public reviews</span>
                    <span className="text-[10px] text-[#71717a] font-normal">Allows guest clients to browse without passcode</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPublicReviews(!publicReviews)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                    publicReviews ? "bg-[#d41514]" : "bg-white/[0.1]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      publicReviews ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Plan & Governance Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-white">Enterprise Solo Operator Plan</span>
              <span className="font-mono text-xs text-[#d41514] font-bold">$39/mo</span>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed mb-4 font-normal">
              Unlimited client retainers, high-speed automated webhooks, custom branded invoices, and 3D card tokenization.
            </p>
            <div className="p-3 rounded-lg border border-white/[0.06] bg-[#08080a] flex items-center justify-between text-xs shadow-luxury">
              <span className="text-[#71717a] font-mono font-normal">Next billing date: Nov 15, 2026</span>
              <span className="text-[#d41514] font-mono font-semibold">Auto-renew</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
