# Musempire

Musempire is a Next.js 14 application that currently ships two surfaces in one deployment:

- A public marketing landing page at `/`
- An invite-only alpha product shell at `/app`

The alpha foundation includes:

- Repo-first product and architecture documentation under `docs/`
- Shared Zod contracts in `packages/contracts`
- Generated OpenAPI output at `docs/api/openapi.json`
- Supabase SSR auth utilities
- Role-aware onboarding for `artist`, `provider`, and `fan`
- World map, collaboration, project room, and AiM beta product routes
- SQL migrations for waitlist and platform foundation under `supabase/migrations`

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth, Postgres, Realtime, and Storage
- Zod

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
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY`
  or `SUPABASE_SERVICE_ROLE_KEY`

3. Apply the Supabase migrations in order:

- `supabase/migrations/001_waitlist.sql`
- `supabase/migrations/002_platform_foundation.sql`

4. Generate the OpenAPI artifact:

```bash
npm run generate:openapi
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Product Routes

- `/login`
- `/app`
- `/app/onboarding`
- `/app/map`
- `/app/collabs`
- `/app/projects`
- `/app/aim`
- `/app/invest`

## API Routes

- `/api/feature-flags`
- `/api/profile/me`
- `/api/onboarding`
- `/api/map/query`
- `/api/collab-requests`
- `/api/project-rooms`
- `/api/aim/threads`
- `/api/aim/respond`
- `/api/openapi`
- `/api/waitlist`

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run generate:openapi
```

## Documentation

Start with:

- `docs/README.md`
- `docs/prd-v1.md`
- `docs/system-architecture.md`
- `docs/schema-catalog.md`
- `docs/rls-matrix.md`
- `docs/aim-spec.md`

## Deployment

The app is structured for Vercel deployment. Marketing and product routes share one Next.js deployment and one Supabase backend.
