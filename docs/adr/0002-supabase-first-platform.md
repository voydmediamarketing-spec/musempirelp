# ADR 0002: Supabase As The First Platform Backend

## Status

Accepted

## Decision

Musempire alpha will use Supabase for authentication, Postgres, realtime, and storage.

## Rationale

- It provides the full backend surface needed for an invite-only collaboration alpha.
- RLS allows permissions to live in the data layer from the beginning.
- It keeps the stack compact while the product shape is still evolving quickly.
