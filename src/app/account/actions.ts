"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/components/ui";

export async function updateProfile(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser("/account");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!fullName) {
    return { errors: { full_name: "Enter your name." } };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", user.id);
  if (error) {
    return { message: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Saved." };
}
