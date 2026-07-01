# Row Level Security Matrix

| Table | Read | Write |
| --- | --- | --- |
| `users` | Self only | Self-only updates to safe columns |
| `profiles` | Public rows when visibility allows | Owner only |
| `profile_links` | Public with profile | Owner only |
| `follow_edges` | Self involved only | Follower only |
| `map_presence` | Public rows when visible | Owner only |
| `availability_status` | Public active rows when allowed | Owner only |
| `status_posts` | Public or member-visible rows | Author only |
| `status_media` | Visible with parent post | Author only through parent |
| `events` | Public or member-visible rows | Host only |
| `collab_requests` | Requester or target only | Requester create, requester or target status changes |
| `conversations` | Members only | Members via helper flows |
| `conversation_participants` | Members only | Conversation creator or existing members |
| `messages` | Conversation members only | Conversation members only |
| `project_rooms` | Members only | Owner and admins |
| `project_members` | Members of the room | Owner and admins |
| `project_tasks` | Members of the room | Members with room role |
| `project_assets` | Members of the room | Members with room role |
| `reports` | Reporter only | Reporter create only |
| `blocks` | Self involved only | Blocker only |
| `moderation_cases` | Service role only | Service role only |
| `aim_threads` | Owner only | Owner only |
| `aim_messages` | Thread owner only | Thread owner only |
| `aim_actions` | Owner only | Server-authenticated creation only |
| `feature_flags` | Authenticated read | Service role only |
