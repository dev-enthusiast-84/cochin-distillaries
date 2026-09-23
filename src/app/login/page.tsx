import Link from "next/link";
import { Card } from "@/components/ui";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;

  return (
    <Card className="mx-auto max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted">Welcome back to the members portal.</p>
      </div>
      <LoginForm next={typeof next === "string" ? next : undefined} />
      <p className="text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="text-accent underline">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
