# AiM Beta Specification

## Purpose

AiM is a draft-only career copilot for the Musempire alpha. It helps an artist or provider think, plan, and draft without taking irreversible actions.

## Supported V1 Use Cases

- Career planning
- Release strategy suggestions
- Outreach draft generation
- Contract review summaries
- Pricing suggestions
- Analytics interpretation
- Next-step task generation

## Guardrails

- AiM does not send emails, sign contracts, publish posts, or move money.
- AiM must separate factual context from generated advice in every response.
- Every interaction is logged into `aim_threads`, `aim_messages`, and `aim_actions`.

## Grounding Inputs

- User profile and role
- Goals and onboarding context
- Project room metadata
- Release timing inputs
- Structured prompt context supplied in the request
