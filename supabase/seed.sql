-- Placeholder catalogue so the portal has something to show.
-- Replace with your real products (or delete) before going live.
insert into public.products (slug, name, category, description, abv, volume_ml, price_cents, members_only)
values
  ('classic-brandy', 'Classic Brandy', 'brandy', 'Smooth grape brandy, aged in oak.', 42.8, 750, 95000, false),
  ('dark-rum', 'Dark Rum', 'rum', 'Rich molasses rum with notes of caramel and spice.', 42.8, 750, 85000, false),
  ('reserve-whisky', 'Reserve Whisky', 'whisky', 'Limited small-batch release for members.', 46.0, 750, 240000, true)
on conflict (slug) do nothing;
