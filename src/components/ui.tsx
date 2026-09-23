import type { ComponentProps } from "react";

export function Field({
  label,
  error,
  ...props
}: ComponentProps<"input"> & { label: string; error?: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <input
        {...props}
        className="rounded-md border border-border bg-surface px-3 py-2 text-base outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
      {error && <span className="text-danger">{error}</span>}
    </label>
  );
}

export function Button({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`rounded-md bg-accent px-4 py-2 font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50 ${className}`}
    />
  );
}

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-border bg-surface p-6 ${className}`}
    />
  );
}

export function FormMessage({ state }: { state?: FormState }) {
  if (!state?.message) return null;
  return (
    <p
      role="status"
      className={`text-sm ${state.ok ? "text-accent" : "text-danger"}`}
    >
      {state.message}
    </p>
  );
}

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
} | undefined;
