import Link from "next/link";
import { Card } from "@/components/ui";
import { ProductCard } from "@/components/product-card";
import { requireUser } from "@/lib/auth";
import { getActiveSubscription, getProducts, getProfile } from "@/lib/data";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser("/dashboard");
  const [profile, subscription, products] = await Promise.all([
    getProfile(user.id),
    getActiveSubscription(user.id),
    getProducts(),
  ]);
  const memberReleases = products.filter((p) => p.members_only);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>

      <Card className="space-y-2">
        <h2 className="text-lg font-semibold">Membership</h2>
        {subscription ? (
          <p className="text-sm text-muted">
            {subscription.plan_name ?? "Membership"} ·{" "}
            <span className="capitalize">{subscription.status.replace("_", " ")}</span>
            {subscription.current_period_end &&
              ` · ${subscription.cancel_at_period_end ? "ends" : "renews"} ${new Date(
                subscription.current_period_end,
              ).toLocaleDateString("en-IN", { dateStyle: "medium" })}`}
          </p>
        ) : (
          <p className="text-sm text-muted">
            You don&apos;t have an active membership yet. Subscriptions are
            coming soon.
          </p>
        )}
      </Card>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Members-only releases</h2>
          <Link href="/products" className="text-sm text-accent underline">
            All spirits
          </Link>
        </div>
        {memberReleases.length === 0 ? (
          <p className="text-sm text-muted">
            {subscription
              ? "No members-only releases right now."
              : "Members-only releases appear here once you have an active membership."}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {memberReleases.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
