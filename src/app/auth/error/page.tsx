import Link from "next/link";
import { Card } from "@/components/ui";

export const metadata = { title: "Sign-in link problem" };

export default function AuthErrorPage() {
  return (
    <Card className="mx-auto max-w-md space-y-3">
      <h1 className="text-xl font-semibold">That link didn&apos;t work</h1>
      <p className="text-sm text-muted">
        The link may have expired or already been used. Try signing in again,
        or sign up to get a new confirmation email.
      </p>
      <Link href="/login" className="inline-block text-sm text-accent underline">
        Back to sign in
      </Link>
    </Card>
  );
}
