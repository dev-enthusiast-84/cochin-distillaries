import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Returns the verified user id + email, or null when signed out. */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;
  return { id: claims.sub, email: claims.email as string | undefined };
}

/** Use at the top of protected pages and server actions. */
export async function requireUser(next?: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }
  return user;
}

/** Only allow same-site relative paths as post-login redirect targets. */
export function safeNextPath(next: unknown, fallback = "/dashboard") {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
