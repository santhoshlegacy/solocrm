"use server";

import { createClient } from "@/utils/supabase/server";
import { checkAuthRateLimit } from "@/utils/rate-limit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AuthState {
  error?: string;
  success?: boolean;
  message?: string;
}

/**
 * Server Action for User Login
 * Guarded with IP rate limiting (max 5 attempts per 15 min)
 */
export async function loginAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  // 1. IP Rate Limiting Guard
  const rateLimit = await checkAuthRateLimit("login", 5, 15);
  if (!rateLimit.success) {
    return { error: rateLimit.error };
  }

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const returnTo = (formData.get("returnTo") as string) || "/";

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  // 2. Supabase Authentication
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "Invalid email or security passkey. Please check your credentials."
          : error.message,
    };
  }

  // 3. Revalidate & Redirect
  revalidatePath("/", "layout");
  redirect(returnTo);
}

/**
 * Server Action for User Registration
 * Guarded with IP rate limiting (max 5 attempts per 15 min)
 */
export async function signupAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  // 1. IP Rate Limiting Guard
  const rateLimit = await checkAuthRateLimit("signup", 5, 15);
  if (!rateLimit.success) {
    return { error: rateLimit.error };
  }

  const fullName = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { error: "Passkey must be at least 8 characters long." };
  }

  // 2. Supabase Registration
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || "Solo Operator",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If Supabase has email confirmation disabled, user session is created immediately
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  return {
    success: true,
    message:
      "Operator account provisioned. Check your inbox for a cryptographic confirmation link to activate your access.",
  };
}

/**
 * Server Action for Sign Out
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
