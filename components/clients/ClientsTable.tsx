"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CopyPortalButton } from "@/components/portal/CopyPortalButton";
import { useWorkspaceMode } from "@/lib/workspace-context";
import { createClient } from "@/utils/supabase/client";
import { formatINR, parseCurrencyInput } from "@/lib/utils";
import {
  Users,
  Search,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export interface ClientRecord {
  id: string;
  name: string;
  company_name?: string;
  contact_person: string;
  email: string;
  status: string;
  total_billed: number | string;
  portal_token?: string;
}

// Maps database row ({ company_name, ltv, status, ... }) to frontend ClientRecord
export function mapDatabaseClientToRecord(row: any): ClientRecord {
  const company = row.company_name || row.name || "Enterprise Account";
  return {
    id: row.id,
    name: company,
    company_name: company,
    contact_person: row.contact_person || "Primary Stakeholder",
    email: row.email || `contact@${company.toLowerCase().replace(/[^a-z0-9]/g, "") || "client"}.com`,
    status: row.status || "Active",
    total_billed: Number(row.ltv ?? row.total_billed ?? 0),
    portal_token: row.portal_token,
  };
}

interface ClientsTableProps {
  clients: ClientRecord[];
}

export const ClientsTable: React.FC<ClientsTableProps> = ({ clients }) => {
  const router = useRouter();
  const { searchQuery, newActionTrigger } = useWorkspaceMode();
  const [clientList, setClientList] = useState<ClientRecord[]>(() =>
    (clients || []).map(mapDatabaseClientToRecord)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Keep clientList in sync with incoming server data
  useEffect(() => {
    if (clients) {
      setClientList(clients.map(mapDatabaseClientToRecord));
    }
  }, [clients]);

  // Open modal if newActionTrigger is triggered from header
  useEffect(() => {
    if (newActionTrigger > 0) {
      setIsModalOpen(true);
    }
  }, [newActionTrigger]);

  const filteredClients = clientList.filter((client) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      client.name?.toLowerCase().includes(q) ||
      client.company_name?.toLowerCase().includes(q) ||
      client.contact_person?.toLowerCase().includes(q) ||
      client.email?.toLowerCase().includes(q) ||
      client.status?.toLowerCase().includes(q)
    );
  });

  const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const company = (fd.get("company_name") as string) || "Acme Global Tech";
    const contact = (fd.get("contact_person") as string) || "Alex Rivera";
    const email = (fd.get("email") as string) || "contact@acme.com";
    const status = (fd.get("status") as string) || "Active";
    const amount = parseCurrencyInput(fd.get("total_billed"), 450000);
    const token = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : undefined;

    const optimisticRecord: ClientRecord = {
      id: `client-${Date.now()}`,
      name: company,
      company_name: company,
      contact_person: contact,
      email,
      status,
      total_billed: amount,
      portal_token: token,
    };

    setClientList((prev) => [optimisticRecord, ...prev]);
    setIsModalOpen(false);
    setToastMessage(`Added client ${company} to enterprise roster.`);
    setTimeout(() => setToastMessage(null), 3500);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        // Explicit object construction:
        // DB does NOT have 'company_name'. Map to 'name' and explicitly REMOVE 'company_name'.
        const clientPayload: {
          user_id: string;
          name: string;
          contact_person: string;
          email: string;
          status: string;
          total_billed: number;
          portal_token?: string;
        } = {
          user_id: user.id,
          name: company, // Explicitly mapped to 'name'; NO company_name property
          contact_person: contact,
          email: email,
          status: status || "Active",
          total_billed: Number(amount || 0),
        };

        if (token) {
          clientPayload.portal_token = token;
        }

        let { data, error } = await supabase
          .from("clients")
          .insert(clientPayload)
          .select()
          .single();

        if (error) {
          // Fallback if schema variant has 'company_name' and 'ltv'
          const fallbackPayload: any = {
            user_id: user.id,
            company_name: company,
            ltv: Number(amount || 0),
            status: status === "Archived" ? "Churned" : "Active",
            joined_at: new Date().toISOString(),
          };
          if (token) {
            fallbackPayload.portal_token = token;
          }

          const fallbackRes = await supabase
            .from("clients")
            .insert(fallbackPayload)
            .select()
            .single();

          if (!fallbackRes.error && fallbackRes.data) {
            data = fallbackRes.data;
            error = null;
          } else {
            console.error("Supabase client insert error:", error, fallbackRes.error);
          }
        }

        if (data) {
          const mapped = mapDatabaseClientToRecord({
            ...data,
            contact_person: contact,
            email: email,
          });
          setClientList((prev) => [
            mapped,
            ...prev.filter((c) => c.id !== optimisticRecord.id),
          ]);
        }
      }

      // Invalidate Next.js client router cache and refresh Server Components
      router.refresh();
    } catch (err) {
      console.error("Failed to persist client:", err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 pt-2">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#E8B4F8]/15 px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#E8B4F8] border border-[#E8B4F8]/30 flex items-center gap-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8B4F8] animate-pulse shadow-[0_0_8px_#E8B4F8]" />
              BUSINESS OS
            </span>
            <span className="text-[#A098A8] text-xs font-mono">• Client Management</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight text-[#E2DCE7] mt-0.5">
            Client Accounts
          </h1>
          <p className="text-xs text-[#A098A8] max-w-2xl font-normal">
            Manage corporate client accounts, key executive contacts, contract lifetime valuations, and unguessable magic portals.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_20px_rgba(178,112,162,0.35)] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>+ Add Client</span>
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
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Card Container */}
      <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#E8B4F8]">
              <Users className="h-4 w-4" />
            </div>
            <h2 className="text-[#E2DCE7] font-mono text-sm font-semibold tracking-wider">
              Client Accounts &amp; Retention Health
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {searchQuery && (
              <span className="text-[11px] font-mono text-[#E8B4F8] bg-[#E8B4F8]/15 px-2.5 py-0.5 rounded-full border border-[#E8B4F8]/30 flex items-center gap-1">
                <Search className="h-3 w-3" />
                Filtering: &quot;{searchQuery}&quot; ({filteredClients.length})
              </span>
            )}
            <span className="text-xs font-mono text-[#A098A8]">
              {filteredClients.length} of {clientList.length} ACCOUNTS
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#A098A8] font-mono text-xs uppercase tracking-wider">
                <th className="p-4 font-normal">Client Company</th>
                <th className="p-4 font-normal">Lead Contact</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 text-right font-normal">Lifetime Value</th>
                <th className="p-4 text-right font-normal">Client Portal</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.06]">
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/[0.05] text-[#E8B4F8] border border-white/10 flex items-center justify-center font-mono text-xs font-semibold group-hover:border-[#E8B4F8]/40 transition-colors">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[#E2DCE7] font-medium">{client.name}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-white font-medium">
                      {client.contact_person}
                    </div>
                    <div className="text-[#A098A8] text-xs font-mono mt-0.5">
                      {client.email}
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-mono rounded-full ${
                        client.status === "Active"
                          ? "bg-[#E8B4F8]/15 text-[#E8B4F8] border border-[#E8B4F8]/30"
                          : "bg-white/[0.05] text-[#A098A8] border border-white/10"
                      }`}
                    >
                      {client.status === "Active" ? "● Active" : client.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <span className="text-[#E2DCE7] font-mono tabular-nums font-semibold">
                      {formatINR(Number(client.total_billed))}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end">
                      <CopyPortalButton
                        token={client.portal_token || client.id}
                        clientName={client.name}
                        variant="button"
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {filteredClients.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-12 text-center text-[#A098A8] font-mono text-sm"
                  >
                    {searchQuery
                      ? `No clients found matching "${searchQuery}".`
                      : "No clients found in the database."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Client Modal */}
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
              className="relative w-full max-w-lg rounded-3xl bg-[#140D1B]/95 backdrop-blur-2xl border border-white/15 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-white/[0.05] border border-white/10 text-[#E8B4F8] flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-white tracking-tight">
                      Register Enterprise Client
                    </h3>
                    <p className="text-[11px] text-[#A098A8]">
                      Create authenticated portal &amp; client ledger record
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

              <form onSubmit={handleCreateClient} className="flex flex-col gap-4 mt-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                    Client / Company Name
                  </label>
                  <input
                    name="company_name"
                    required
                    placeholder="e.g. Stripe Financial Services"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Lead Contact Person
                    </label>
                    <input
                      name="contact_person"
                      required
                      placeholder="e.g. David Vance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Contact Work Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="e.g. david@stripe.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Contract Value (INR ₹)
                    </label>
                    <input
                      name="total_billed"
                      type="number"
                      defaultValue={650000}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] text-xs text-white placeholder:text-[#A098A8] focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A098A8]">
                      Account Status
                    </label>
                    <select
                      name="status"
                      defaultValue="Active"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#140D1B] text-xs text-white focus:outline-none focus:border-[#E8B4F8] transition-colors shadow-inner cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
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
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#B270A2] to-[#7A5A97] hover:brightness-110 text-white text-xs font-semibold active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_20px_rgba(178,112,162,0.35)]"
                  >
                    Save Client Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
