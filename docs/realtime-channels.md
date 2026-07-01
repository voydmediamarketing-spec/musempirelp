# Realtime Channel Map

## Channels

- `presence:user:{userId}`: last-seen and transient presence
- `conversation:{conversationId}`: direct and room-scoped chat updates
- `project-room:{projectRoomId}`: task and asset changes
- `map-activity`: fresh post and event visibility updates
- `collab-request:{userId}`: inbound or outbound request changes

## Delivery Expectations

- Realtime is an enhancement, not the only source of truth.
- Every realtime event must correspond to a durable database record.
- Client state should recover cleanly through REST refetch after reconnect.
