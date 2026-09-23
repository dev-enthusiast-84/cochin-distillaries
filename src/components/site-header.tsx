import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Cochin Distillaries
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:text-accent">
            Spirits
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-accent">
                Dashboard
              </Link>
              <Link href="/account" className="hover:text-accent">
                Account
              </Link>
              <form action="/auth/signout" method="post">
                <button className="text-muted hover:text-foreground">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-accent">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-accent px-3 py-1.5 font-medium text-accent-foreground hover:opacity-90"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
