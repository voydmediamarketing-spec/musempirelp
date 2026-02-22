# [YOUR APP NAME] Landing Page

Animated, dark-mode-only music platform landing page built with Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase JS client

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

Set values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Create the waitlist table in Supabase:

```sql
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Waitlist API

- `GET /api/waitlist` returns live count from Supabase.
- `POST /api/waitlist` inserts email and returns updated count.

## Build

```bash
npm run build
npm start
```

## Deploy

This app is deploy-ready for Vercel.
