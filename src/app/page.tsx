import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <section className="flex flex-col items-start gap-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-accent">
        Members portal
      </p>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Crafted spirits from Cochin Distillaries.
      </h1>
      <p className="max-w-xl text-lg text-muted">
        Explore our range, get access to members-only releases, and manage your
        membership in one place.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={user ? "/dashboard" : "/signup"}
          className="rounded-md bg-accent px-5 py-2.5 font-medium text-accent-foreground hover:opacity-90"
        >
          {user ? "Go to dashboard" : "Become a member"}
        </Link>
        <Link
          href="/products"
          className="rounded-md border border-border px-5 py-2.5 font-medium hover:border-accent"
        >
          Browse spirits
        </Link>
      </div>
    </section>
  );
}
