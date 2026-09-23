import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  abv: number | null;
  volume_ml: number | null;
  price_cents: number | null;
  currency: string;
  image_url: string | null;
  members_only: boolean;
};

export type Subscription = {
  id: string;
  status: string;
  plan_name: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
};

// RLS decides which products each visitor can see.
export async function getProducts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, category, description, abv, volume_ml, price_cents, currency, image_url, members_only",
    )
    .order("members_only")
    .order("name");
  if (error) throw error;
  return data as Product[];
}

export async function getProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function getActiveSubscription(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, status, plan_name, current_period_end, cancel_at_period_end")
    .eq("user_id", userId)
    .in("status", ["active", "trialing", "past_due"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Subscription | null;
}

export function formatPrice(cents: number | null, currency: string) {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    cents / 100,
  );
}
