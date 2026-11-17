"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard, staggerContainerVariants } from "@/components/ui/GlassCard";
import {
  Network,
  Users,
  MessageSquare,
  Sparkles,
  Search,
  Plus,
  Calendar,
  X,
  CheckCircle2,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useWorkspaceMode } from "@/lib/workspace-context";

interface NetworkContact {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  platform: "LinkedIn" | "Twitter / X" | "Referral";
  lastContacted: string;
  status: "Warm Lead" | "Partner" | "Active Client" | "Inactive";
  notes: string;
}

export default function NetworkClient() {
  const router = useRouter();
  const { searchQuery } = useWorkspaceMode();
  const [connections, setConnections] = useState<NetworkContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNetworkContacts() {
      try {
        const supabase = createClient();
        let { data, error } = await supabase
          .from("network")
          .select("*")
          .order("created_at", { ascending: false });

        if (error || !data) {
          const res = await supabase
            .from("connections")
            .select("*")
            .order("created_at", { ascending: false });
          if (res.data) {
            data = res.data;
            error = null;
          }
        }

        if (data && !error) {
          const mapped: NetworkContact[] = data.map((item: any) => ({
            id: item.id || `net-${Math.random()}`,
            name: item.name || item.contact_name || "Unnamed Contact",
            role: item.role || item.title || "Collaborator",
            company: item.company || item.company_name || "Independent",
            avatar:
              item.avatar ||
              ((item.name || item.contact_name)
                ? (item.name || item.contact_name)
                    .split(" ")
                    .map((s: string) => s[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                : "NC"),
            platform: (item.platform || item.network_platform || "LinkedIn") as NetworkContact["platform"],
            lastContacted: item.last_contacted || item.lastContacted || "Recently",
            status: (item.status || "Warm Lead") as NetworkContact["status"],
            notes: item.notes || "Strategic network partner.",
          }));
          setConnections(mapped);
        } else {
          setConnections([]);
        }
      } catch (err) {
        console.warn("Network contacts fetch warning:", err);
        setConnections([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNetworkContacts();
  }, []);

  const filtered = connections.filter((item) => {
    const q = (search || searchQuery).toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.company.toLowerCase().includes(q) ||
      item.role.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q);

    const matchesFilter = filter === "all" || item.platform === filter;
    return matchesSearch && matchesFilter;
  });

  const handleAddConnection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string) || "New Contact";
    const role = (fd.get("role") as string) || "Product Lead";
    const company = (fd.get("company") as string) || "Partner Studio";
    const platform = (fd.get("platform") as NetworkContact["platform"]) || "LinkedIn";
    const status = (fd.get("status") as NetworkContact["status"]) || "Warm Lead";
    const notes = (fd.get("notes") as string) || "Strategic design and engineering collaboration.";

    const initials =
      name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "NC";

    const newContact: NetworkContact = {
      id: `net-${Date.now()}`,
      name,
      role,
      company,
      avatar: initials,
      platform,
      lastContacted: "Just now",
      status,
      notes,
    };

    setConnections((prev) => [newContact, ...prev]);
    setIsModalOpen(false);
    setToastMessage(`Added "${name}" to operator rolodex.`);
    setTimeout(() => setToastMessage(null), 3500);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("No authenticated user session found");
        return;
      }

      let { data, error } = await supabase
        .from("network")
        .insert({
          user_id: user.id,
          name,
          role,
          company,
          platform,
          status,
          notes,
        })
        .select()
        .single();

      if (error) {
        console.warn("Supabase network table insert error, trying connections fallback:", error);
        const fallbackRes = await supabase
          .from("connections")
          .insert({
            user_id: user.id,
            contact_name: name,
            network_platform: platform,
            notes: `${role} at ${company}. ${notes}`,
            last_contacted: new Date().toISOString(),
          })
          .select()
          .single();

        if (fallbackRes.data && !fallbackRes.error) {
          data = fallbackRes.data;
          error = null;
        } else {
          console.error("Failed to insert network contact:", error, fallbackRes.error);
        }
      }

      if (data) {
        setConnections((prev) =>
          prev.map((c) => (c.id === newContact.id ? { ...c, id: data.id } : c))
        );
      }

      router.refresh();
    } catch (err) {
      console.error("Failed to persist network contact:", err);
    }
  };

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 pt-2"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 flex items-center gap-1.5 shadow-sm">
              <Network className="h-3.5 w-3.5 text-[#E8B4F8]" />
              FREELANCE NETWORK
            </span>
            <span className="text-[#A098A8] text-xs font-mono">• Operator CRM</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-[#E2DCE7] mt-0.5">
            Network &amp; Connections
          </h1>
          <p className="text-xs text-[#A098A8] max-w-2xl font-normal">
            Cultivate strategic client relationships, agency partners, and referral channels to sustain high-velocity inbound freelance deals.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Add Connection</span>
          </button>
        </div>
      </div>

      {/* Floating Feedback Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-[#E8B4F8]/30 bg-[#140D1B]/95 backdrop-blur-xl p-3 text-xs text-[#E8B4F8] flex items-center gap-2 shadow-2xl font-mono"
          >
            <CheckCircle2 className="h-4 w-4 text-[#E8B4F8] shrink-0" />
            <span className="font-medium font-mono">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Bento Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Total Network Size
            </span>
            <Users className="h-3.5 w-3.5 text-[#E8B4F8]" />
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums">
            {connections.length}
          </span>
          <p className="text-[11px] text-[#A098A8] mt-2 font-normal">
            {connections.length > 0 ? `${connections.length} registered contacts` : "0 contacts in orbit"}
          </p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Active Dialogues
            </span>
            <MessageSquare className="h-3.5 w-3.5 text-[#E8B4F8]" />
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums">
            {connections.filter((c) => c.status === "Active Client" || c.status === "Warm Lead").length}
          </span>
          <p className="text-[11px] text-[#A098A8] mt-2 font-normal">
            {connections.length > 0 ? "Proposals & active accounts" : "No pipeline dialogues"}
          </p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Top Acquisition Rail
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#E8B4F8]" />
          </div>
          <span className="font-display text-lg font-bold text-[#E2DCE7] tracking-tight">
            {connections.length > 0 ? "LinkedIn / Referrals" : "None Registered"}
          </span>
          <p className="text-[11px] text-[#A098A8] mt-2 font-normal">
            {connections.length > 0 ? "Primary inbound channel" : "Awaiting network data"}
          </p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
              Touchpoint Cadence
            </span>
            <Calendar className="h-3.5 w-3.5 text-[#A098A8]" />
          </div>
          <span className="font-display text-2xl lg:text-3xl font-bold text-[#E2DCE7] tracking-tight tabular-nums">
            {connections.length > 0 ? "4.2 Days" : "—"}
          </span>
          <p className="text-[11px] text-[#A098A8] mt-2 font-normal">
            {connections.length > 0 ? "Average response latency" : "No telemetry recorded"}
          </p>
        </GlassCard>
      </div>

      {/* Main Connection Table / Cards */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8]">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-[#E2DCE7] tracking-tight">
                Rolodex &amp; Contact Records
              </h3>
              <p className="text-xs text-[#A098A8] font-normal">
                Direct contacts with notes, platform origins, and interaction timestamps
              </p>
            </div>
          </div>

          {/* Search & Platform Filter */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A098A8] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="pl-9 pr-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
              />
            </div>

            <div className="flex items-center bg-white/[0.04] border border-white/10 p-1 rounded-full shadow-inner">
              {["all", "LinkedIn", "Twitter / X", "Referral"].map((pf) => (
                <button
                  key={pf}
                  onClick={() => setFilter(pf)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                    filter === pf
                      ? "bg-white/10 text-white border border-white/10 shadow-sm font-semibold"
                      : "text-[#A098A8] hover:text-white"
                  }`}
                >
                  {pf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State or Connection Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-[#A098A8] font-mono text-xs">
            <div className="h-6 w-6 border-2 border-[#E8B4F8] border-t-transparent rounded-full animate-spin mb-3" />
            Querying network rolodex...
          </div>
        ) : connections.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-center my-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] mb-3">
              <Network className="h-6 w-6" />
            </div>
            <h4 className="font-display text-sm font-bold text-white tracking-tight mb-1">
              Zero Network Records
            </h4>
            <p className="text-xs text-[#A098A8] max-w-sm mb-4 font-normal">
              Your network database is clean. Register advisors, referral partners, and agency contacts to track acquisition channels.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Register First Contact</span>
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-12 text-center text-[#A098A8] font-mono text-xs border border-dashed border-white/10 rounded-2xl">
            No contacts found matching the active criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-sm flex flex-col justify-between gap-3 hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-[1px] transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center font-mono font-medium text-xs text-[#E8B4F8]">
                      {item.avatar}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-[#E2DCE7] truncate group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#A098A8] truncate font-normal">
                        {item.role} • {item.company}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/[0.03] border border-white/10 text-[#A098A8] flex-shrink-0">
                    {item.platform}
                  </span>
                </div>

                <p className="text-xs text-[#A098A8] line-clamp-2 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/10 font-normal">
                  {item.notes}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                  <span className="text-[#A098A8] font-mono font-normal">
                    Contacted {item.lastContacted}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#E8B4F8]/15 text-[#E8B4F8] border border-[#E8B4F8]/30">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Add Connection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#140D1B]/95 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                      Add Network Connection
                    </h3>
                    <p className="text-[11px] text-[#A098A8] font-mono">
                      Register strategic partner or referral channel
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-[#A098A8] hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddConnection} className="flex flex-col gap-4 mt-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                    Contact Full Name
                  </label>
                  <input
                    name="name"
                    required
                    placeholder="e.g. Liam Zhang"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Role / Title
                    </label>
                    <input
                      name="role"
                      required
                      placeholder="e.g. VP Engineering"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Company / Organization
                    </label>
                    <input
                      name="company"
                      required
                      placeholder="e.g. Apex Core"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Acquisition Platform
                    </label>
                    <select
                      name="platform"
                      defaultValue="LinkedIn"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#140D1B] text-xs text-white focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter / X">Twitter / X</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Pipeline Status
                    </label>
                    <select
                      name="status"
                      defaultValue="Warm Lead"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#140D1B] text-xs text-white focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="Warm Lead">Warm Lead</option>
                      <option value="Active Client">Active Client</option>
                      <option value="Partner">Partner</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                    Strategic Notes &amp; Interaction Summary
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="e.g. Met during design systems roadshow. Interested in Q2 UI migration sprint."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 mt-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full text-[#A098A8] hover:text-white hover:bg-white/[0.04] text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
