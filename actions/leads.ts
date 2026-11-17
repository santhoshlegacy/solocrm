"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export type LeadStatus = "Contacted" | "Pitched" | "Won" | "Lost" | "In Progress";

export async function updateLeadStatus(
  leadId: string,
  newStatus: LeadStatus
) {
  try {
    const supabase = await createClient();
    // Gracefully map "In Progress" to "Pitched" to satisfy Postgres check constraint
    const dbStatus = newStatus === "In Progress" ? "Pitched" : newStatus;
    const { error } = await supabase
      .from("leads")
      .update({ status: dbStatus as any })
      .eq("id", leadId);

    if (error) {
      console.error("Supabase updateLeadStatus error:", error);
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
      (formData.get("client_name") as string) ||
      (formData.get("name") as string) ||
      "New Opportunity";
    const projectDetails =
      (formData.get("project_title") as string) ||
      (formData.get("project_details") as string) ||
      "Design & Development";
    const value = parseFloat((formData.get("value") as string) || "0");
    const rawStatus = (formData.get("status") as string) || "Contacted";
    const status = (rawStatus === "In Progress" ? "Pitched" : rawStatus) as any;
    const portalToken = (formData.get("portal_token") as string) || crypto.randomUUID();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Primary: client_name / description / budget (strictly strip initials)
      const primaryPayload: any = {
        user_id: user.id,
        client_name: name,
        description: projectDetails,
        budget: value,
        status,
        tags: ["UI/UX", "Next.js"],
        portal_token: portalToken,
      };

      const { error } = await supabase.from("leads").insert(primaryPayload);
      if (error) {
        // Fallback for schema variants with name / project_details / value
        await supabase.from("leads").insert({
          user_id: user.id,
          name,
          project_details: projectDetails,
          value,
          status: status === "In Progress" ? "Pitched" : status,
          tags: ["UI/UX", "Next.js"],
          portal_token: portalToken,
        });
      }
    }

    revalidatePath("/leads");
    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
