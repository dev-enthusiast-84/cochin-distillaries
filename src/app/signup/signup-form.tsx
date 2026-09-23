"use client";

import { useActionState } from "react";
import { signup } from "@/app/auth/actions";
import { Button, Field, FormMessage } from "@/components/ui";

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const errors = state?.errors ?? {};

  if (state?.ok) {
    return <FormMessage state={state} />;
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field
        label="Full name"
        name="full_name"
        autoComplete="name"
        required
        error={errors.full_name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={errors.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        error={errors.password}
      />
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="age_confirmed" required className="mt-1" />
        <span>
          I confirm I am of legal drinking age in my place of residence.
          {errors.age_confirmed && (
            <span className="block text-danger">{errors.age_confirmed}</span>
          )}
        </span>
      </label>
      <FormMessage state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
