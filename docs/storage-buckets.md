# Storage Bucket Map

## Planned Buckets

- `avatars`: profile images
- `status-media`: 24-hour snippets, images, and event media
- `project-assets`: files attached to project rooms
- `aim-attachments`: optional supporting files for AiM context

## Rules

- Client uploads use signed or direct authenticated flows with RLS-backed ownership checks.
- Ephemeral status content should include expiry metadata and cleanup routines.
- External embeds remain first-class and reduce storage pressure where appropriate.
