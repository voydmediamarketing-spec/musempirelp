# Schema Catalog

## Core Identity

- `users`: auth-linked product user record, role, alpha access, onboarding status
- `profiles`: public-facing profile data and privacy settings
- `profile_links`: structured external links

## Social Graph And Presence

- `follow_edges`: follows between users
- `map_presence`: geographic and visibility state for map rendering
- `availability_status`: live collaboration or activity state

## Activity

- `status_posts`: text or event-linked activity entries
- `status_media`: uploaded or embedded media attached to posts
- `events`: public or limited visibility event records

## Collaboration

- `collab_requests`: artist and provider collaboration requests
- `conversations`: direct or project-scoped messaging containers
- `conversation_participants`: durable membership for direct and project chat
- `messages`: chat messages inside a conversation
- `project_rooms`: lightweight shared workspaces
- `project_members`: membership and role inside a room
- `project_tasks`: structured work items
- `project_assets`: uploaded files or external links

## Safety And Operations

- `reports`: user-generated trust and safety reports
- `blocks`: block edges between users
- `moderation_cases`: review workflow records
- `feature_flags`: database-driven release controls

## AiM

- `aim_threads`: persisted assistant conversations
- `aim_messages`: prompt and response history
- `aim_actions`: logged draft actions and recommendations
