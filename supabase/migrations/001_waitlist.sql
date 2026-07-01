create extension if not exists pgcrypto;

create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;

drop policy if exists waitlist_insert_public on waitlist;
create policy waitlist_insert_public
on waitlist
for insert
to anon, authenticated
with check (true);

drop policy if exists waitlist_select_public on waitlist;
create policy waitlist_select_public
on waitlist
for select
to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated;
grant insert, select on table public.waitlist to anon, authenticated;
