"use client";

import React, { useState, useEffect, useTransition } from "react";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import {
  User,
  Building,
  Mail,
  DollarSign,
  CheckCircle2,
  Bot,
  Zap,
  Landmark,
  Send,
  ShieldCheck,
  X,
  Activity,
  Bell,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { updateProfile } from "@/actions/profile";

interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  ip: string;
  status: "verified" | "nominal";
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "general" | "notifications"
  >("general");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [webhooksEnabled, setWebhooksEnabled] = useState(true);
  const [autoReconcile, setAutoReconcile] = useState(true);
  const [saveToast, setSaveToast] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    title: string;
    businessEntity: string;
    bio: string;
    avatarUrl?: string;
    initials: string;
  }>({
    fullName: "",
    email: "",
    title: "",
    businessEntity: "",
    bio: "",
    initials: "",
  });

  const [auditLogs] = useState<AuditEntry[]>([
    {
      id: "log-1",
      timestamp: "Today, 18:45:12 IST",
      action: "Google OAuth 2.0 Token Exchange",
      details: "Session code exchanged for cryptographic JWT token",
      ip: "103.241.22.84",
      status: "verified",
    },
    {
      id: "log-2",
      timestamp: "Today, 18:46:04 IST",
      action: "Workspace Cookie Initialization",
      details: "solocrm_workspace_type set to edge header cache",
      ip: "103.241.22.84",
      status: "nominal",
    },
    {
      id: "log-3",
      timestamp: "Today, 17:15:30 IST",
      action: "Public Client Portal Magic Link Read",
      details: "UUID token validated against RLS read-only policy",
      ip: "157.240.198.35",
      status: "verified",
    },
    {
      id: "log-4",
      timestamp: "Yesterday, 22:11:48 IST",
      action: "Database Connection Pool Synced",
      details: "PostgreSQL transaction pool checked healthy",
      ip: "10.0.4.12",
      status: "nominal",
    },
  ]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "";
          const email = user.email || "";
          const avatarUrl =
            user.user_metadata?.avatar_url || user.user_metadata?.picture;
          const initials =
            name
              ? name
                  .split(" ")
                  .map((n: string) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : (email ? email.slice(0, 2).toUpperCase() : "OP");

          setUserData({
            fullName: name,
            email,
            title:
              user.user_metadata?.professional_title ||
              user.user_metadata?.title ||
              "",
            businessEntity:
              user.user_metadata?.business_entity || "",
            bio:
              user.user_metadata?.bio || "",
            avatarUrl,
            initials,
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUser();
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await updateProfile(formData);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 4000);
    });
  };

  const triggerActionToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
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
            <span className="rounded-full bg-[#E8B4F8]/15 px-3 py-1 text-[11px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] animate-pulse" />
              OPERATOR CONFIG
            </span>
            <span className="text-[#A098A8] text-xs font-mono">• Free Solo Edition</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-white mt-0.5">
            Account &amp; Business Settings
          </h1>
          <p className="text-xs text-[#A098A8] max-w-2xl font-normal">
            Configure your verified operator identity, currency parameters, background automation engines, and cryptographic access keys.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsAuditModalOpen(true)}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[#E2DCE7] hover:text-white text-xs font-mono transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Activity className="h-3.5 w-3.5 text-[#E8B4F8]" />
            <span>Audit Log</span>
          </button>
          {activeTab === "general" && (
            <button
              type="submit"
              form="settings-profile-form"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(178,112,162,0.35)] disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isPending ? "Syncing..." : "Save Changes"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Notification Toast */}
      <AnimatePresence>
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-[#E8B4F8]/30 bg-[#140D1B]/95 backdrop-blur-xl p-3.5 text-xs text-[#E8B4F8] flex items-center gap-2.5 shadow-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-[#E8B4F8]" />
            <span className="font-medium font-mono">
              All settings and parameters synced successfully with Supabase user metadata.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Notice Toast */}
      <AnimatePresence>
        {actionToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-[#E8B4F8]/30 bg-[#140D1B]/95 backdrop-blur-xl p-3.5 text-xs text-[#E8B4F8] flex items-center gap-2.5 shadow-2xl font-mono"
          >
            <Sparkles className="h-4 w-4 text-[#E8B4F8]" />
            <span className="font-medium">{actionToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizontal Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-lg overflow-x-auto w-fit">
        {[
          { id: "general", label: "General & Profile" },
          { id: "notifications", label: "Notifications" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-white/10 text-[#E8B4F8] border border-[#E8B4F8]/30 font-semibold shadow-sm"
                : "text-[#A098A8] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: General & Profile (Default Active View) */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Profile & Identity */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <GlassCard className="p-6 flex flex-col gap-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-sm font-semibold text-white tracking-tight">
                      Profile &amp; Operator Identity
                    </h2>
                    <p className="text-[11px] text-[#A098A8] font-normal">
                      Public identity stamped on client proposals, agreements, and invoices
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8B4F8]/15 text-[#E8B4F8] font-mono text-[10px] font-medium border border-[#E8B4F8]/30">
                  LIVE SUPABASE PROFILE
                </span>
              </div>

              {/* Avatar Tile */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.02]">
                {userData.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userData.avatarUrl}
                    alt={userData.fullName || "Operator"}
                    className="h-12 w-12 rounded-xl object-cover border border-white/10"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#B270A2]/30 to-[#7A5A97]/30 border border-white/15 flex items-center justify-center font-mono text-sm font-bold text-white">
                    {userData.initials || "OP"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-white">{userData.fullName || "Operator"}</span>
                  <span className="text-[11px] text-[#A098A8] font-mono">{userData.email || "No session email"}</span>
                  <span className="text-[10px] text-[#E8B4F8] font-mono mt-0.5">Google OAuth Verified</span>
                </div>
              </div>

              {/* Form Fields */}
              <form
                id="settings-profile-form"
                key={userData.email || "settings-profile-form"}
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] flex items-center gap-1">
                    <User className="h-3 w-3 text-[#E8B4F8]" />
                    Full Legal Name
                  </label>
                  <input
                    name="fullName"
                    defaultValue={userData.fullName}
                    placeholder="Enter full legal name"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-[#A098A8]/60 focus:outline-none focus:border-[#E8B4F8] focus:bg-white/[0.06] transition-all shadow-inner font-normal"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] flex items-center gap-1">
                    <Mail className="h-3 w-3 text-[#E8B4F8]" />
                    Operator Email
                  </label>
                  <input
                    name="email"
                    defaultValue={userData.email}
                    readOnly
                    placeholder="operator@company.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-[#A098A8] focus:outline-none font-mono cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] flex items-center gap-1">
                    <Building className="h-3 w-3 text-[#E8B4F8]" />
                    Business Entity Name
                  </label>
                  <input
                    name="businessEntity"
                    defaultValue={userData.businessEntity}
                    placeholder="e.g. Acme Corp (optional)"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-[#A098A8]/60 focus:outline-none focus:border-[#E8B4F8] focus:bg-white/[0.06] transition-all shadow-inner font-normal"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8] flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-[#E8B4F8]" />
                    Professional Title
                  </label>
                  <input
                    name="title"
                    defaultValue={userData.title}
                    placeholder="e.g. Principal Consultant"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-[#A098A8]/60 focus:outline-none focus:border-[#E8B4F8] focus:bg-white/[0.06] transition-all shadow-inner font-normal"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                    Bio &amp; Global Invoice Note
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    defaultValue={userData.bio}
                    placeholder="Enter operator bio and global invoice notes..."
                    className="w-full p-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-white placeholder:text-[#A098A8]/60 focus:outline-none focus:border-[#E8B4F8] focus:bg-white/[0.06] resize-none leading-relaxed shadow-inner font-normal"
                  />
                </div>
              </form>
            </GlassCard>
          </div>

          {/* Right Column: Autonomous Routines & Architecture */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <GlassCard className="p-6 flex flex-col gap-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8]">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                      Autonomous Routines
                    </h3>
                    <p className="text-[11px] text-[#A098A8] font-normal">Zero-touch event dispatchers</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-medium text-[#E8B4F8] bg-[#E8B4F8]/15 px-2.5 py-0.5 rounded-full border border-[#E8B4F8]/30">
                  ACTIVE
                </span>
              </div>

              {/* Toggle Switches */}
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shadow-sm hover:border-white/20 transition-all">
                  <div className="flex items-start gap-2.5">
                    <Send className="h-4 w-4 text-[#E8B4F8] mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-white">Auto-send invoice reminders</span>
                      <span className="text-[10px] text-[#A098A8] font-normal">Pings client via email 3 days before maturity</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRemindersEnabled(!remindersEnabled)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 cursor-pointer ${
                      remindersEnabled ? "bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] shadow-[0_0_12px_rgba(232,180,248,0.4)]" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        remindersEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shadow-sm hover:border-white/20 transition-all">
                  <div className="flex items-start gap-2.5">
                    <Zap className="h-4 w-4 text-[#E8B4F8] mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-white">Instant payment telemetry</span>
                      <span className="text-[10px] text-[#A098A8] font-normal">Pushes real-time webhooks on verified settlement</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWebhooksEnabled(!webhooksEnabled)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 cursor-pointer ${
                      webhooksEnabled ? "bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] shadow-[0_0_12px_rgba(232,180,248,0.4)]" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        webhooksEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shadow-sm hover:border-white/20 transition-all">
                  <div className="flex items-start gap-2.5">
                    <Landmark className="h-4 w-4 text-[#E8B4F8] mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-white">Bank feed auto-reconcile</span>
                      <span className="text-[10px] text-[#A098A8] font-normal">Matches bank ledger RTGS and IMPS credits</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoReconcile(!autoReconcile)}
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 cursor-pointer ${
                      autoReconcile ? "bg-gradient-to-r from-[#B270A2] to-[#E8B4F8] shadow-[0_0_12px_rgba(232,180,248,0.4)]" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        autoReconcile ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* Free Tier Solo Architecture SLA Card */}
            <GlassCard className="p-6 border border-white/10 bg-white/[0.04] backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#E8B4F8]" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                    Solo Engine Architecture
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#E8B4F8] bg-[#E8B4F8]/15 px-2.5 py-0.5 rounded-full border border-[#E8B4F8]/30 font-bold">
                  COMMUNITY PRO EDITION
                </span>
              </div>
              <p className="text-xs text-[#A098A8] leading-relaxed mb-4 font-normal">
                SoloCRM is an unmetered, 100% free production SaaS. Single-tenant database isolation, unguessable magic portals, and direct INR financial reporting.
              </p>
              <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono">
                <span className="text-[#A098A8]">Cryptographic SLA: 99.99%</span>
                <span className="text-white font-medium">Active &amp; Verified</span>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* TAB 2: Notifications */}
      {activeTab === "notifications" && (
        <GlassCard className="p-8 flex flex-col gap-6 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 flex items-center justify-center text-[#E8B4F8]">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-white tracking-tight">
                  Notification Routing &amp; Alerts
                </h3>
                <p className="text-xs text-[#A098A8]">
                  High-priority telemetry webhooks, security alerts, and SMS relays
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 font-mono text-[10px] font-semibold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />
              Routing Offline
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-[#E2DCE7]/80 leading-relaxed">
            Third-party SMS gateways and external Discord relays are offline. High-priority transaction alerts and cryptographic session notices are delivered directly via header notifications and forwarded to your primary address: <span className="text-white font-mono">{userData.email}</span>.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] uppercase text-[#A098A8] tracking-wider block mb-1">
                Email Dispatch
              </span>
              <span className="text-white font-bold">Enabled • Verified</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] uppercase text-[#A098A8] tracking-wider block mb-1">
                In-App Bell Dropdown
              </span>
              <span className="text-white font-bold">Active Stream</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-[10px] uppercase text-[#A098A8] tracking-wider block mb-1">
                External Webhooks
              </span>
              <span className="text-[#A098A8] font-bold">Standby Mode</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#A098A8] font-mono">
              Push notification worker status: dormant
            </span>
            <button
              onClick={() =>
                triggerActionToast(
                  `Dispatched test telemetry alert to ${userData.email}`
                )
              }
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] transition-all cursor-pointer"
            >
              Test Ping Relay
            </button>
          </div>
        </GlassCard>
      )}

      {/* Audit Log Modal */}
      <AnimatePresence>
        {isAuditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuditModalOpen(false)}
              className="absolute inset-0 bg-[#09050F]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#140D1B]/95 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#E8B4F8]/10 border border-[#E8B4F8]/20 text-[#E8B4F8] flex items-center justify-center">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                      Security &amp; Auth Audit Log
                    </h3>
                    <p className="text-[11px] text-[#A098A8] font-mono">
                      Recent cryptographic events and session tokens
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAuditModalOpen(false)}
                  className="p-2 rounded-full text-[#A098A8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 divide-y divide-white/10 max-h-80 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="py-3 flex items-start justify-between gap-4 text-xs font-mono"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white font-medium font-sans">{log.action}</span>
                      <span className="text-[#A098A8] text-[11px]">{log.details}</span>
                      <span className="text-[#A098A8]/60 text-[10px] mt-0.5">IP: {log.ip}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#E8B4F8]/15 text-[#E8B4F8] border border-[#E8B4F8]/30">
                        {log.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#A098A8]">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#A098A8]/60">
                  Encrypted at rest • AES-256 GCM
                </span>
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                >
                  Close Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
