import Link from "next/link";
import { Card } from "@/components/ui";
import { SignupForm } from "./signup-form";

export const metadata = { title: "Join" };

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-muted">
          Join to browse our spirits and manage your membership.
        </p>
      </div>
      <SignupForm />
      <p className="text-sm text-muted">
        Already a member?{" "}
        <Link href="/login" className="text-accent underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
