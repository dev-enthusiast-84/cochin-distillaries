# Cochin Distillaries

Members portal built with Next.js 16 (App Router), Supabase (auth + Postgres) and Tailwind CSS. Deployed on Vercel. Stripe subscriptions come later.

## What's here

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Landing page |
| `/products` | public | Spirits catalogue (members also see members-only releases) |
| `/signup`, `/login` | signed out | Email + password auth, with a legal-drinking-age confirmation |
| `/dashboard` | signed in | Membership status and members-only releases |
| `/account` | signed in | Edit name and phone |
| `/auth/confirm` | — | Landing point for Supabase email links |
| `/auth/signout` | — | `POST` to sign out |

Key files:

- `src/proxy.ts` + `src/lib/supabase/proxy.ts`: refreshes the Supabase session on every request and redirects signed-out users away from protected pages. (Next.js 16 renamed `middleware.ts` to `proxy.ts`.)
- `src/lib/supabase/{server,client}.ts`: Supabase clients for server and browser code.
- `src/lib/auth.ts`: `getCurrentUser()` / `requireUser()`. Protected pages and server actions call `requireUser()` themselves; the proxy check is only a fast path.
- `supabase/migrations/`: database schema with row-level security.

## Database

`supabase/migrations/20260923000000_init.sql` creates:

- **profiles**: one per user, created by a trigger on sign-up. Users can edit only `full_name` and `phone`.
- **products**: the catalogue. Everyone sees active products; `members_only` products are visible only to users with an active subscription (enforced by RLS).
- **subscriptions**: a mirror of Stripe subscriptions. Users can read their own; only the server (service-role key, from a Stripe webhook) writes to it.

`supabase/seed.sql` adds three placeholder products.

## Setup

1. Create a Supabase project, then apply the schema, either with the CLI (`supabase link` then `supabase db push`) or by pasting the migration (and optionally the seed) into the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in the values from Supabase → Project Settings → API.
3. In Supabase → Authentication → URL Configuration, set the **Site URL** and add these **Redirect URLs**:
   - `http://localhost:3000/**`
   - `https://<your-vercel-domain>/**`
   - `https://*-<your-vercel-team>.vercel.app/**` (preview deployments)
4. `npm install` then `npm run dev`.

## Deploying to Vercel

Import the repo in Vercel and add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as environment variables (Production and Preview). No other build settings are needed.

## Adding Stripe later

The schema is ready for it: `profiles.stripe_customer_id` and the `subscriptions` table. You'll add:

1. A server action that creates a Stripe Checkout session (subscription mode) for the signed-in user.
2. A route handler at `/api/stripe/webhook` that verifies the signature and upserts `subscriptions` rows using a Supabase **service-role** client. That key must stay server-only (never `NEXT_PUBLIC_`).
3. A link to the Stripe Customer Portal from `/account` for managing billing.
