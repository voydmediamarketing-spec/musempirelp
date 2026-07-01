# System Architecture

## Runtime Topology

- One Next.js application serves both marketing and product routes.
- Supabase provides Auth, Postgres, Realtime, and Storage.
- Shared TypeScript contracts live in `packages/contracts`.
- OpenAPI is generated from Zod schemas and committed to `docs/api/openapi.json`.

## Product Boundaries

- Marketing remains static-first and public.
- Product routes under `/app` are authenticated.
- The app shell consumes typed route handlers rather than ad hoc JSON shapes.
- AiM beta is implemented as a draft generator inside the product, not as an autonomous actor.

## Security Baseline

- Row Level Security protects every user-facing table.
- Middleware refreshes auth cookies for protected routes.
- Invite-only access is enforced by profile and feature-flag state.
- Moderation, block, and report entities exist from the first schema revision.
