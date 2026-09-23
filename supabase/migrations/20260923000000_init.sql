-- Cochin Distillaries portal: initial schema.
-- Apply with `supabase db push`, or paste into the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles: one row per auth user, created automatically on sign-up.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  age_confirmed_at timestamptz,
  -- Filled in by the Stripe integration (server-side only).
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Users may only edit their contact details, never billing fields.
revoke update on public.profiles from authenticated, anon;
grant update (full_name, phone) on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, age_confirmed_at)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    (new.raw_user_meta_data ->> 'age_confirmed_at')::timestamptz
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Subscriptions: mirror of Stripe subscriptions, written only by the Stripe
-- webhook using the service-role key. Clients can read their own rows.
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  id text primary key, -- Stripe subscription id (sub_...)
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null, -- trialing | active | past_due | canceled | ...
  price_id text,
  plan_name text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.has_active_subscription()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.subscriptions
    where user_id = (select auth.uid())
      and status in ('active', 'trialing')
  );
$$;

-- ---------------------------------------------------------------------------
-- Products: the spirits catalogue. Managed from the Supabase dashboard.
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null, -- e.g. brandy, rum, whisky, gin
  description text,
  abv numeric(4, 1),
  volume_ml integer,
  price_cents integer,
  currency text not null default 'INR',
  image_url text,
  is_active boolean not null default true,
  members_only boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;

create policy "Anyone can view public products"
  on public.products for select
  to anon, authenticated
  using (is_active and not members_only);

create policy "Members can view members-only products"
  on public.products for select
  to authenticated
  using (is_active and members_only and (select public.has_active_subscription()));
