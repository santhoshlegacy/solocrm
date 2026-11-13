"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const professionalTitle = formData.get("professionalTitle") as string;
    const businessEntity = formData.get("businessEntity") as string;
    const email = formData.get("email") as string;
    const timezone = formData.get("timezone") as string;
    const bio = formData.get("bio") as string;

    const supabase = await createServerClient();
    if (supabase) {
      await supabase.from("profiles").update(
        {
          full_name: fullName,
          role: professionalTitle,
          business_entity: businessEntity,
          email,
          timezone,
          bio,
        },
        "id",
        "00000000-0000-0000-0000-000000000000"
      );
    }

    revalidatePath("/settings");
    revalidatePath("/");
    return { success: true, message: "Profile updated successfully via Server Action" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

