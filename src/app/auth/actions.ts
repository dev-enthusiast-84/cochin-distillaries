"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth";
import type { FormState } from "@/components/ui";

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { message: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { message: error.message };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(formData.get("next")));
}

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const errors: Record<string, string> = {};

  if (!fullName) errors.full_name = "Enter your name.";
  if (!email) errors.email = "Enter your email.";
  if (password.length < 8) errors.password = "Use at least 8 characters.";
  if (formData.get("age_confirmed") !== "on") {
    errors.age_confirmed = "You must be of legal drinking age to join.";
  }
  if (Object.keys(errors).length > 0) return { errors };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, age_confirmed_at: new Date().toISOString() },
      emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=/dashboard`,
    },
  });
  if (error) {
    return { message: error.message };
  }

  // With email confirmation on (Supabase default) there is no session yet.
  if (!data.session) {
    return {
      ok: true,
      message: "Check your inbox for a link to confirm your email address.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

async function siteOrigin() {
  const h = await headers();
  return (
    h.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    `https://${h.get("host")}`
  );
}
