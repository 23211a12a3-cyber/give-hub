-- Run in Supabase SQL editor
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,            -- Firebase uid
  owner_name text,
  title text not null,
  description text,
  category text not null,
  condition text not null,
  location text,
  image_url text,
  status text not null default 'available' check (status in ('available','claimed')),
  claimed_by text,
  created_at timestamptz not null default now()
);

alter table items enable row level security;
-- Demo policies: Firebase handles login, so Supabase sees every request as anon.
-- Tighten these (e.g. via a Supabase Edge Function that verifies the Firebase token) before real use.
create policy "read items" on items for select using (true);
create policy "add items" on items for insert with check (true);
create policy "update items" on items for update using (true);
create policy "delete items" on items for delete using (true);

insert into storage.buckets (id, name, public) values ('item-images', 'item-images', true)
  on conflict do nothing;
create policy "read images" on storage.objects for select using (bucket_id = 'item-images');
create policy "upload images" on storage.objects for insert with check (bucket_id = 'item-images');
