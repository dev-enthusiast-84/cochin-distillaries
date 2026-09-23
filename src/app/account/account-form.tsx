"use client";

import { useActionState } from "react";
import { Button, Field, FormMessage } from "@/components/ui";
import type { Profile } from "@/lib/data";
import { updateProfile } from "./actions";

export function AccountForm({
  email,
  profile,
}: {
  email?: string;
  profile: Profile | null;
}) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field label="Email" type="email" value={email ?? ""} disabled readOnly />
      <Field
        label="Full name"
        name="full_name"
        autoComplete="name"
        defaultValue={profile?.full_name ?? ""}
        required
        error={state?.errors?.full_name}
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        defaultValue={profile?.phone ?? ""}
      />
      <FormMessage state={state} />
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
