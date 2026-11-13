"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export type LeadStatus = "Contacted" | "Pitched" | "Won" | "Lost" | "In Progress";

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus
) {
  try {
    const supabase = await createServerClient();
    if (supabase) {
      // Gracefully map "In Progress" to "Pitched" if sent from legacy UI
      const dbStatus = newStatus === "In Progress" ? "Pitched" : newStatus;
      const { data, error } = await supabase
        .from("leads")
        .update({ status: dbStatus as any }, "id", leadId);

      if (error) {
        console.error("Supabase updateLeadStatus error:", error);
      }
    }

    revalidatePath("/leads");
    revalidatePath("/");
    return { success: true, leadId, newStatus };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createLead(formData: FormData) {
  try {
    const name =
      (formData.get("name") as string) ||
      (formData.get("client_name") as string) ||
      "New Opportunity";
    const projectDetails =
      (formData.get("project_details") as string) ||
      (formData.get("project_title") as string) ||
      "Design & Development";
    const value = parseFloat((formData.get("value") as string) || "0");
    const rawStatus = (formData.get("status") as string) || "Contacted";
    const status = (rawStatus === "In Progress" ? "Pitched" : rawStatus) as any;

    const supabase = await createServerClient();
    if (supabase) {
      await supabase.from("leads").insert({
        user_id: "00000000-0000-0000-0000-000000000000",
        name,
        project_details: projectDetails,
        value,
        status,
        tags: ["UI/UX", "Next.js"],
      });
    }

    revalidatePath("/leads");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
