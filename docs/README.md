# Musempire Documentation

This repository treats documentation as a first-class artifact. Product, architecture, schema, API, and decision records must move with the code.

## Source Of Truth Order

1. `docs/prd-v1.md`
2. `docs/adr/*.md`
3. `docs/schema-catalog.md`
4. `docs/rls-matrix.md`
5. `docs/api/openapi.json`
6. Tests and code

## Required Update Rule

Any change to schema, auth, prompts, permissions, or API shape must update the paired document in the same change set.
