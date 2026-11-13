"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { WorkspaceMode } from "@/lib/supabase/types";

export async function switchWorkspaceMode(newMode: WorkspaceMode) {
  try {
    const supabase = await createServerClient();
    if (supabase) {
      await supabase.from("profiles").update(
        { current_mode: newMode },
        "id",
        "00000000-0000-0000-0000-000000000000"
      );
    }
    revalidatePath("/");
    revalidatePath("/leads");
    revalidatePath("/network");
    revalidatePath("/clients");
    revalidatePath("/sales");
    revalidatePath("/analytics");
    revalidatePath("/settings");
    return { success: true, mode: newMode };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

