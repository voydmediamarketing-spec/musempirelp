# ADR 0001: Single Next App With Shared Contracts

## Status

Accepted

## Decision

Musempire will keep marketing and product in one Next.js codebase and will publish shared contracts from `packages/contracts`.

## Rationale

- One deployment keeps the landing page and alpha product moving together.
- Shared contracts prevent web and later mobile from inventing divergent API shapes.
- The current repo is small enough that introducing a separate app repo would add overhead instead of clarity.
