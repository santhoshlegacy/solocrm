"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export type WorkspaceType = "freelance" | "business";

/**
 * Server Action to set the user's workspace architecture during Onboarding.
 * Updates auth.users metadata, profiles table, and sets an HTTP-only session cookie.
 */
export async function setWorkspaceType(workspaceType: WorkspaceType) {
  if (workspaceType !== "freelance" && workspaceType !== "business") {
    throw new Error("Invalid workspace type selected.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Update user_metadata in auth.users
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      workspace_type: workspaceType,
    },
  });

  if (authError) {
    console.error("Failed to update user auth metadata:", authError);
  }

  // 2. Update profiles table if it exists
  try {
    await supabase
      .from("profiles")
      .update({
        workspace_type: workspaceType,
        current_mode: workspaceType === "freelance" ? "freelancer" : "business",
      })
      .eq("id", user.id);
  } catch (err) {
    console.error("Profiles table update skipped or errored:", err);
  }

  // 3. Set cookie for zero-latency middleware route decisions
  const cookieStore = await cookies();
  cookieStore.set("solocrm_workspace_type", workspaceType, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Fetch current user's workspace type
 */
export async function getWorkspaceType(): Promise<WorkspaceType | null> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("solocrm_workspace_type")?.value as WorkspaceType | undefined;
  if (cookieValue === "freelance" || cookieValue === "business") {
    return cookieValue;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const metadataType = user.user_metadata?.workspace_type as WorkspaceType | undefined;
  if (metadataType === "freelance" || metadataType === "business") {
    return metadataType;
  }

  return null;
}
