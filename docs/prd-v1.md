# V1 Product Requirements

## Product Goal

Ship an invite-only alpha that proves Musempire can function as a collaboration platform for artists before expanding into regulated monetization and heavier creation tooling.

## Target Users

- `artist`: the primary creator role
- `provider`: producers, studios, photographers, marketers, videographers, and similar collaborators
- `fan`: discovery and support role with constrained participation

## Core Outcomes

- A new user can authenticate, complete onboarding, and appear on the map with safe visibility defaults.
- Artists and providers can discover one another using geography, genre, instrument, skill, and collaboration filters.
- Users can publish activity updates and media snippets tied to map presence.
- Artists and providers can send collaboration requests, chat, and work in lightweight project rooms.
- Users can ask AiM for draft-only planning, outreach, contract, pricing, and analytics guidance.

## Out Of Scope For V1

- Real securities, tokenization, artist shares, wallets, or payouts
- Full remote DAW or live audio collaboration
- Automated sending, publishing, signing, or money movement by AiM
- Public open signups beyond alpha access rules

## Success Criteria

- The platform is deployable on Vercel and uses Supabase for auth, data, realtime, and storage.
- `/app` is authenticated and invite-aware.
- Role, privacy, and permissions are enforced in data access rather than only in UI.
- Web and later mobile clients can rely on a single typed API contract.
