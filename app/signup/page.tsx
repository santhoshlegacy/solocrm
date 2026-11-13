"use client";

import React, { useActionState, Suspense } from "react";
import Link from "next/link";
import { signupAction, AuthState } from "@/actions/auth";
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

function SignupForm() {
  const [state, formAction, isPending] = useActionState<AuthState, FormData>(
    signupAction,
    {}
  );

  return (
    <div className="w-full">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-[#d41514]" />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Solo<span className="text-[#d41514]">CRM</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1a1a1a] text-[#888] border border-[#262626]">
            v2.4 SECURE
          </span>
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]">
          Provision New Operator Terminal
        </p>
      </div>

      {/* Brutalist Container */}
      <div className="rounded-md bg-[#111111] border border-[#222] p-8">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#222]">
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight">
              Register Operator Account
            </h1>
            <p className="text-[11px] text-[#71717a] mt-0.5">
              Initialize your isolated single-tenant workspace
            </p>
          </div>
          <div className="h-7 w-7 rounded bg-[#160b0b] border border-[#d41514]/30 flex items-center justify-center text-[#d41514]">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-4 rounded-md border border-[#d41514]/30 bg-[#180d0d] p-3 text-xs text-[#d41514] flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="font-mono text-[11px] leading-relaxed">
              {state.error}
            </span>
          </div>
        )}

        {/* Success Alert */}
        {state?.success && (
          <div className="mb-4 rounded-md border border-white/20 bg-[#141414] p-3 text-xs text-white flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-[#d41514] shrink-0 mt-0.5" />
            <span className="font-mono text-[11px] leading-relaxed">
              {state.message}
            </span>
          </div>
        )}

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="fullName"
              className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]"
            >
              Operator Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="Alex Vance"
                className="w-full rounded-md bg-[#0a0a0a] border border-[#222] pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#d41514] transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]"
            >
              Operating Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="alex@studio.design"
                className="w-full rounded-md bg-[#0a0a0a] border border-[#222] pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#d41514] transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#71717a]"
            >
              Master Passkey (Min 8 Characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#555]" />
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="••••••••••••"
                className="w-full rounded-md bg-[#0a0a0a] border border-[#222] pl-9 pr-3 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#d41514] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 rounded-md bg-[#d41514] hover:bg-[#b5100f] text-white text-xs font-semibold py-2.5 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.99]"
          >
            <span>{isPending ? "Provisioning..." : "Initialize Operator Profile"}</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#222] flex items-center justify-between text-[11px]">
          <span className="text-[#666]">Already provisioned?</span>
          <Link
            href="/login"
            className="text-[#d41514] hover:underline font-mono text-[11px]"
          >
            Sign In →
          </Link>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-[10px] font-mono text-[#555]">
          Strict IP rate limiting enforced • 5 attempts / 15 minutes
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-md bg-[#111111] border border-[#222] p-8 text-center text-xs text-[#666]">
          Loading provisioning terminal...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
