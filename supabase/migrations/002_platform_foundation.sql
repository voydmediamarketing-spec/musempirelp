create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'role_type') then
    create type role_type as enum ('artist', 'provider', 'fan');
  end if;
  if not exists (select 1 from pg_type where typname = 'privacy_level') then
    create type privacy_level as enum ('hidden', 'city', 'precise');
  end if;
  if not exists (select 1 from pg_type where typname = 'collab_request_status') then
    create type collab_request_status as enum ('pending', 'accepted', 'rejected', 'blocked', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'moderation_case_status') then
    create type moderation_case_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
  end if;
  if not exists (select 1 from pg_type where typname = 'project_member_role') then
    create type project_member_role as enum ('owner', 'admin', 'collaborator', 'viewer');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_post_kind') then
    create type status_post_kind as enum ('update', 'snippet', 'event', 'announcement');
  end if;
  if not exists (select 1 from pg_type where typname = 'status_media_type') then
    create type status_media_type as enum ('image', 'audio', 'video', 'embed');
  end if;
  if not exists (select 1 from pg_type where typname = 'conversation_kind') then
    create type conversation_kind as enum ('direct', 'project');
  end if;
  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type task_status as enum ('todo', 'in_progress', 'blocked', 'done');
  end if;
  if not exists (select 1 from pg_type where typname = 'aim_message_role') then
    create type aim_message_role as enum ('user', 'assistant', 'system', 'tool');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_visible_profile(profile_user_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = profile_user_id
      and (
        p.user_id = auth.uid()
        or p.privacy_level <> 'hidden'
      )
  );
$$;

create or replace function public.is_project_member(room_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.project_members pm
    where pm.project_room_id = room_id
      and pm.user_id = auth.uid()
  );
$$;

create or replace function public.is_project_admin(room_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.project_members pm
    where pm.project_room_id = room_id
      and pm.user_id = auth.uid()
      and pm.member_role in ('owner', 'admin')
  )
  or exists (
    select 1
    from public.project_rooms pr
    where pr.id = room_id
      and pr.owner_user_id = auth.uid()
  );
$$;

create or replace function public.is_conversation_member(conversation_id_param uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conversation_id_param
      and cp.user_id = auth.uid()
  );
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role role_type,
  alpha_access_granted boolean not null default false,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  last_seen_at timestamptz
);

create table if not exists public.profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  display_name text not null default '',
  username text unique,
  bio text,
  city text,
  region text,
  country text,
  latitude double precision,
  longitude double precision,
  privacy_level privacy_level not null default 'city',
  avatar_path text,
  genres text[] not null default '{}'::text[],
  instruments text[] not null default '{}'::text[],
  skills text[] not null default '{}'::text[],
  availability_note text,
  is_seeking_collaboration boolean not null default true,
  consent_location boolean not null default false,
  consent_ai boolean not null default false,
  consent_marketing boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profile_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  kind text not null,
  label text not null,
  url text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.follow_edges (
  follower_user_id uuid not null references public.users(id) on delete cascade,
  followed_user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (follower_user_id, followed_user_id),
  check (follower_user_id <> followed_user_id)
);

create table if not exists public.map_presence (
  user_id uuid primary key references public.users(id) on delete cascade,
  city text,
  region text,
  country text,
  latitude double precision,
  longitude double precision,
  precise_location_enabled boolean not null default false,
  is_visible boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.availability_status (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  status text not null,
  note text,
  is_active boolean not null default true,
  starts_at timestamptz not null default timezone('utc', now()),
  ends_at timestamptz
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  host_user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  event_type text not null default 'gig',
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue_name text,
  city text,
  region text,
  country text,
  latitude double precision,
  longitude double precision,
  visibility privacy_level not null default 'city',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.status_posts (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references public.users(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null,
  kind status_post_kind not null default 'update',
  body text not null default '',
  visibility privacy_level not null default 'city',
  location_label text,
  external_url text,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.status_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.status_posts(id) on delete cascade,
  media_type status_media_type not null,
  storage_path text,
  external_url text,
  mime_type text,
  duration_seconds integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.collab_requests (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null references public.users(id) on delete cascade,
  target_user_id uuid not null references public.users(id) on delete cascade,
  project_room_id uuid,
  message text not null,
  requested_role text not null,
  status collab_request_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz,
  check (requester_user_id <> target_user_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  kind conversation_kind not null default 'direct',
  project_room_id uuid,
  created_by_user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default timezone('utc', now()),
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_user_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  message_type text not null default 'text',
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.project_rooms (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  visibility text not null default 'invite_only',
  due_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_members (
  project_room_id uuid not null references public.project_rooms(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  member_role project_member_role not null default 'collaborator',
  joined_at timestamptz not null default timezone('utc', now()),
  primary key (project_room_id, user_id)
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_room_id uuid not null references public.project_rooms(id) on delete cascade,
  created_by_user_id uuid not null references public.users(id) on delete cascade,
  assigned_user_id uuid references public.users(id) on delete set null,
  title text not null,
  description text not null default '',
  status task_status not null default 'todo',
  due_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_room_id uuid not null references public.project_rooms(id) on delete cascade,
  uploaded_by_user_id uuid not null references public.users(id) on delete cascade,
  asset_type text not null,
  title text not null,
  storage_path text,
  external_url text,
  mime_type text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references public.users(id) on delete cascade,
  target_user_id uuid references public.users(id) on delete set null,
  status_post_id uuid references public.status_posts(id) on delete set null,
  message_id uuid references public.messages(id) on delete set null,
  project_room_id uuid references public.project_rooms(id) on delete set null,
  reason text not null,
  details text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blocks (
  blocker_user_id uuid not null references public.users(id) on delete cascade,
  blocked_user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (blocker_user_id, blocked_user_id),
  check (blocker_user_id <> blocked_user_id)
);

create table if not exists public.moderation_cases (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references public.reports(id) on delete set null,
  subject_user_id uuid references public.users(id) on delete set null,
  subject_type text not null,
  subject_id uuid,
  status moderation_case_status not null default 'open',
  notes text,
  reviewed_by_user_id uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.aim_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  context_type text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.aim_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.aim_threads(id) on delete cascade,
  role aim_message_role not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.aim_actions (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.aim_threads(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  action_type text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  risk_level text not null default 'medium',
  approved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.feature_flags (
  key text primary key,
  description text not null,
  enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.collab_requests
  add constraint collab_requests_project_room_id_fkey
  foreign key (project_room_id) references public.project_rooms(id) on delete set null;

alter table public.conversations
  add constraint conversations_project_room_id_fkey
  foreign key (project_room_id) references public.project_rooms(id) on delete set null;

create index if not exists idx_profiles_visibility on public.profiles (privacy_level, city, country);
create index if not exists idx_profiles_role_city on public.users (role, alpha_access_granted, onboarding_completed);
create index if not exists idx_map_presence_location on public.map_presence (city, region, country);
create index if not exists idx_status_posts_author_created_at on public.status_posts (author_user_id, created_at desc);
create index if not exists idx_events_host_starts_at on public.events (host_user_id, starts_at desc);
create index if not exists idx_collab_requests_target_status on public.collab_requests (target_user_id, status, created_at desc);
create index if not exists idx_messages_conversation_created_at on public.messages (conversation_id, created_at desc);
create index if not exists idx_project_tasks_room_status on public.project_tasks (project_room_id, status);
create index if not exists idx_reports_reporter_created_at on public.reports (reporter_user_id, created_at desc);
create index if not exists idx_aim_threads_user_updated_at on public.aim_threads (user_id, updated_at desc);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists map_presence_set_updated_at on public.map_presence;
create trigger map_presence_set_updated_at
before update on public.map_presence
for each row execute function public.set_updated_at();

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists status_posts_set_updated_at on public.status_posts;
create trigger status_posts_set_updated_at
before update on public.status_posts
for each row execute function public.set_updated_at();

drop trigger if exists collab_requests_set_updated_at on public.collab_requests;
create trigger collab_requests_set_updated_at
before update on public.collab_requests
for each row execute function public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists messages_set_updated_at on public.messages;
create trigger messages_set_updated_at
before update on public.messages
for each row execute function public.set_updated_at();

drop trigger if exists project_rooms_set_updated_at on public.project_rooms;
create trigger project_rooms_set_updated_at
before update on public.project_rooms
for each row execute function public.set_updated_at();

drop trigger if exists project_tasks_set_updated_at on public.project_tasks;
create trigger project_tasks_set_updated_at
before update on public.project_tasks
for each row execute function public.set_updated_at();

drop trigger if exists moderation_cases_set_updated_at on public.moderation_cases;
create trigger moderation_cases_set_updated_at
before update on public.moderation_cases
for each row execute function public.set_updated_at();

drop trigger if exists aim_threads_set_updated_at on public.aim_threads;
create trigger aim_threads_set_updated_at
before update on public.aim_threads
for each row execute function public.set_updated_at();

drop trigger if exists feature_flags_set_updated_at on public.feature_flags;
create trigger feature_flags_set_updated_at
before update on public.feature_flags
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  default_name text;
  granted boolean;
begin
  default_name := coalesce(split_part(new.email, '@', 1), 'Musempire User');
  granted := exists(
    select 1
    from public.waitlist w
    where lower(w.email) = lower(new.email)
  );

  insert into public.users (id, email, alpha_access_granted)
  values (new.id, new.email, granted)
  on conflict (id) do update
  set email = excluded.email,
      alpha_access_granted = excluded.alpha_access_granted;

  insert into public.profiles (user_id, display_name)
  values (new.id, default_name)
  on conflict (user_id) do nothing;

  insert into public.map_presence (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

insert into public.feature_flags (key, description, enabled, config)
values
  ('invite_only_alpha', 'Restrict product access to approved alpha accounts', true, '{}'::jsonb),
  ('providers_enabled', 'Allow provider accounts in the alpha build', true, '{}'::jsonb),
  ('fans_can_request_access', 'Allow fans to request access to gated rooms and communities', true, '{}'::jsonb),
  ('map_activity_video', 'Enable video snippets on the map activity layer', true, '{"maxDurationSeconds":30}'::jsonb),
  ('map_activity_audio', 'Enable audio snippets on the map activity layer', true, '{"maxDurationSeconds":30}'::jsonb),
  ('aim_beta', 'Expose the AiM beta surface in the authenticated app', true, '{"mode":"draft_only"}'::jsonb),
  ('invest_placeholder_enabled', 'Expose the regulated-feature placeholder route', true, '{}'::jsonb)
on conflict (key) do update
set description = excluded.description,
    enabled = excluded.enabled,
    config = excluded.config;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on public.feature_flags to authenticated;

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_links enable row level security;
alter table public.follow_edges enable row level security;
alter table public.map_presence enable row level security;
alter table public.availability_status enable row level security;
alter table public.events enable row level security;
alter table public.status_posts enable row level security;
alter table public.status_media enable row level security;
alter table public.collab_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.project_rooms enable row level security;
alter table public.project_members enable row level security;
alter table public.project_tasks enable row level security;
alter table public.project_assets enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.moderation_cases enable row level security;
alter table public.aim_threads enable row level security;
alter table public.aim_messages enable row level security;
alter table public.aim_actions enable row level security;
alter table public.feature_flags enable row level security;

drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
for select to authenticated
using (id = auth.uid());

drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists profiles_select_visible on public.profiles;
create policy profiles_select_visible on public.profiles
for select to authenticated
using (user_id = auth.uid() or privacy_level <> 'hidden');

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists profile_links_select_visible on public.profile_links;
create policy profile_links_select_visible on public.profile_links
for select to authenticated
using (public.is_visible_profile(user_id));

drop policy if exists profile_links_manage_self on public.profile_links;
create policy profile_links_manage_self on public.profile_links
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists follow_edges_select_participants on public.follow_edges;
create policy follow_edges_select_participants on public.follow_edges
for select to authenticated
using (follower_user_id = auth.uid() or followed_user_id = auth.uid());

drop policy if exists follow_edges_insert_self on public.follow_edges;
create policy follow_edges_insert_self on public.follow_edges
for insert to authenticated
with check (follower_user_id = auth.uid());

drop policy if exists follow_edges_delete_self on public.follow_edges;
create policy follow_edges_delete_self on public.follow_edges
for delete to authenticated
using (follower_user_id = auth.uid());

drop policy if exists map_presence_select_visible on public.map_presence;
create policy map_presence_select_visible on public.map_presence
for select to authenticated
using (user_id = auth.uid() or is_visible or public.is_visible_profile(user_id));

drop policy if exists map_presence_manage_self on public.map_presence;
create policy map_presence_manage_self on public.map_presence
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists availability_status_select_visible on public.availability_status;
create policy availability_status_select_visible on public.availability_status
for select to authenticated
using (user_id = auth.uid() or (is_active and public.is_visible_profile(user_id)));

drop policy if exists availability_status_manage_self on public.availability_status;
create policy availability_status_manage_self on public.availability_status
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists events_select_visible on public.events;
create policy events_select_visible on public.events
for select to authenticated
using (host_user_id = auth.uid() or visibility <> 'hidden');

drop policy if exists events_manage_self on public.events;
create policy events_manage_self on public.events
for all to authenticated
using (host_user_id = auth.uid())
with check (host_user_id = auth.uid());

drop policy if exists status_posts_select_visible on public.status_posts;
create policy status_posts_select_visible on public.status_posts
for select to authenticated
using (author_user_id = auth.uid() or visibility <> 'hidden');

drop policy if exists status_posts_manage_self on public.status_posts;
create policy status_posts_manage_self on public.status_posts
for all to authenticated
using (author_user_id = auth.uid())
with check (author_user_id = auth.uid());

drop policy if exists status_media_select_with_post on public.status_media;
create policy status_media_select_with_post on public.status_media
for select to authenticated
using (
  exists (
    select 1
    from public.status_posts sp
    where sp.id = post_id
      and (sp.author_user_id = auth.uid() or sp.visibility <> 'hidden')
  )
);

drop policy if exists status_media_manage_self on public.status_media;
create policy status_media_manage_self on public.status_media
for all to authenticated
using (
  exists (
    select 1
    from public.status_posts sp
    where sp.id = post_id
      and sp.author_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.status_posts sp
    where sp.id = post_id
      and sp.author_user_id = auth.uid()
  )
);

drop policy if exists collab_requests_select_participants on public.collab_requests;
create policy collab_requests_select_participants on public.collab_requests
for select to authenticated
using (requester_user_id = auth.uid() or target_user_id = auth.uid());

drop policy if exists collab_requests_insert_self on public.collab_requests;
create policy collab_requests_insert_self on public.collab_requests
for insert to authenticated
with check (requester_user_id = auth.uid());

drop policy if exists collab_requests_update_participants on public.collab_requests;
create policy collab_requests_update_participants on public.collab_requests
for update to authenticated
using (requester_user_id = auth.uid() or target_user_id = auth.uid())
with check (requester_user_id = auth.uid() or target_user_id = auth.uid());

drop policy if exists conversations_select_members on public.conversations;
create policy conversations_select_members on public.conversations
for select to authenticated
using (public.is_conversation_member(id));

drop policy if exists conversations_insert_creator on public.conversations;
create policy conversations_insert_creator on public.conversations
for insert to authenticated
with check (created_by_user_id = auth.uid());

drop policy if exists conversations_update_members on public.conversations;
create policy conversations_update_members on public.conversations
for update to authenticated
using (public.is_conversation_member(id))
with check (public.is_conversation_member(id));

drop policy if exists conversation_participants_select_members on public.conversation_participants;
create policy conversation_participants_select_members on public.conversation_participants
for select to authenticated
using (user_id = auth.uid() or public.is_conversation_member(conversation_id));

drop policy if exists conversation_participants_insert_creator on public.conversation_participants;
create policy conversation_participants_insert_creator on public.conversation_participants
for insert to authenticated
with check (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.created_by_user_id = auth.uid()
  )
  or public.is_conversation_member(conversation_id)
);

drop policy if exists messages_select_members on public.messages;
create policy messages_select_members on public.messages
for select to authenticated
using (public.is_conversation_member(conversation_id));

drop policy if exists messages_insert_members on public.messages;
create policy messages_insert_members on public.messages
for insert to authenticated
with check (sender_user_id = auth.uid() and public.is_conversation_member(conversation_id));

drop policy if exists messages_update_sender on public.messages;
create policy messages_update_sender on public.messages
for update to authenticated
using (sender_user_id = auth.uid())
with check (sender_user_id = auth.uid());

drop policy if exists project_rooms_select_members on public.project_rooms;
create policy project_rooms_select_members on public.project_rooms
for select to authenticated
using (public.is_project_member(id) or owner_user_id = auth.uid());

drop policy if exists project_rooms_insert_owner on public.project_rooms;
create policy project_rooms_insert_owner on public.project_rooms
for insert to authenticated
with check (owner_user_id = auth.uid());

drop policy if exists project_rooms_update_admins on public.project_rooms;
create policy project_rooms_update_admins on public.project_rooms
for update to authenticated
using (public.is_project_admin(id))
with check (public.is_project_admin(id));

drop policy if exists project_members_select_members on public.project_members;
create policy project_members_select_members on public.project_members
for select to authenticated
using (public.is_project_member(project_room_id));

drop policy if exists project_members_insert_admins on public.project_members;
create policy project_members_insert_admins on public.project_members
for insert to authenticated
with check (
  public.is_project_admin(project_room_id)
  or exists (
    select 1
    from public.project_rooms pr
    where pr.id = project_room_id
      and pr.owner_user_id = auth.uid()
  )
);

drop policy if exists project_members_update_admins on public.project_members;
create policy project_members_update_admins on public.project_members
for update to authenticated
using (public.is_project_admin(project_room_id))
with check (public.is_project_admin(project_room_id));

drop policy if exists project_tasks_select_members on public.project_tasks;
create policy project_tasks_select_members on public.project_tasks
for select to authenticated
using (public.is_project_member(project_room_id));

drop policy if exists project_tasks_manage_members on public.project_tasks;
create policy project_tasks_manage_members on public.project_tasks
for all to authenticated
using (public.is_project_member(project_room_id))
with check (public.is_project_member(project_room_id) and created_by_user_id = auth.uid());

drop policy if exists project_assets_select_members on public.project_assets;
create policy project_assets_select_members on public.project_assets
for select to authenticated
using (public.is_project_member(project_room_id));

drop policy if exists project_assets_manage_members on public.project_assets;
create policy project_assets_manage_members on public.project_assets
for all to authenticated
using (public.is_project_member(project_room_id))
with check (public.is_project_member(project_room_id) and uploaded_by_user_id = auth.uid());

drop policy if exists reports_select_self on public.reports;
create policy reports_select_self on public.reports
for select to authenticated
using (reporter_user_id = auth.uid());

drop policy if exists reports_insert_self on public.reports;
create policy reports_insert_self on public.reports
for insert to authenticated
with check (reporter_user_id = auth.uid());

drop policy if exists blocks_select_participants on public.blocks;
create policy blocks_select_participants on public.blocks
for select to authenticated
using (blocker_user_id = auth.uid() or blocked_user_id = auth.uid());

drop policy if exists blocks_manage_self on public.blocks;
create policy blocks_manage_self on public.blocks
for all to authenticated
using (blocker_user_id = auth.uid())
with check (blocker_user_id = auth.uid());

drop policy if exists aim_threads_select_owner on public.aim_threads;
create policy aim_threads_select_owner on public.aim_threads
for select to authenticated
using (user_id = auth.uid());

drop policy if exists aim_threads_manage_owner on public.aim_threads;
create policy aim_threads_manage_owner on public.aim_threads
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists aim_messages_select_owner on public.aim_messages;
create policy aim_messages_select_owner on public.aim_messages
for select to authenticated
using (
  exists (
    select 1
    from public.aim_threads at
    where at.id = thread_id
      and at.user_id = auth.uid()
  )
);

drop policy if exists aim_messages_manage_owner on public.aim_messages;
create policy aim_messages_manage_owner on public.aim_messages
for all to authenticated
using (
  exists (
    select 1
    from public.aim_threads at
    where at.id = thread_id
      and at.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.aim_threads at
    where at.id = thread_id
      and at.user_id = auth.uid()
  )
);

drop policy if exists aim_actions_select_owner on public.aim_actions;
create policy aim_actions_select_owner on public.aim_actions
for select to authenticated
using (user_id = auth.uid());

drop policy if exists aim_actions_insert_owner on public.aim_actions;
create policy aim_actions_insert_owner on public.aim_actions
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists feature_flags_select_authenticated on public.feature_flags;
create policy feature_flags_select_authenticated on public.feature_flags
for select to authenticated
using (true);
