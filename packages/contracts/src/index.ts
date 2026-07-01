import { z } from "zod";

export const roleSchema = z.enum(["artist", "provider", "fan"]);
export const privacyLevelSchema = z.enum(["hidden", "city", "precise"]);
export const collabRequestStatusSchema = z.enum(["pending", "accepted", "rejected", "blocked", "cancelled"]);
export const moderationCaseStatusSchema = z.enum(["open", "reviewing", "resolved", "dismissed"]);
export const projectMemberRoleSchema = z.enum(["owner", "admin", "collaborator", "viewer"]);
export const statusPostKindSchema = z.enum(["update", "snippet", "event", "announcement"]);
export const statusMediaTypeSchema = z.enum(["image", "audio", "video", "embed"]);
export const conversationKindSchema = z.enum(["direct", "project"]);
export const taskStatusSchema = z.enum(["todo", "in_progress", "blocked", "done"]);
export const featureFlagKeySchema = z.enum([
  "invite_only_alpha",
  "providers_enabled",
  "fans_can_request_access",
  "map_activity_video",
  "map_activity_audio",
  "aim_beta",
  "invest_placeholder_enabled",
]);

export const apiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
});

export const profileLinkSchema = z.object({
  id: z.string().uuid().optional(),
  kind: z.string().min(2).max(40),
  label: z.string().min(1).max(80),
  url: z.string().url(),
  isPrimary: z.boolean().default(false),
});

export const profileSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string().min(1).max(80),
  username: z.string().min(3).max(32).regex(/^[a-z0-9_]+$/).nullable(),
  bio: z.string().max(500).nullable(),
  city: z.string().max(120).nullable(),
  region: z.string().max(120).nullable(),
  country: z.string().max(120).nullable(),
  privacyLevel: privacyLevelSchema,
  avatarUrl: z.string().url().nullable(),
  genres: z.array(z.string()).default([]),
  instruments: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  isSeekingCollaboration: z.boolean().default(true),
  consentLocation: z.boolean().default(false),
  consentAi: z.boolean().default(false),
  consentMarketing: z.boolean().default(false),
  role: roleSchema.nullable(),
  alphaAccessGranted: z.boolean().default(false),
  onboardingCompleted: z.boolean().default(false),
  links: z.array(profileLinkSchema).default([]),
});

export const profileUpdateSchema = profileSchema.pick({
  displayName: true,
  username: true,
  bio: true,
  city: true,
  region: true,
  country: true,
  privacyLevel: true,
  genres: true,
  instruments: true,
  skills: true,
  isSeekingCollaboration: true,
  consentLocation: true,
  consentAi: true,
  consentMarketing: true,
  links: true,
});

export const onboardingRequestSchema = z.object({
  role: roleSchema,
  displayName: z.string().min(1).max(80),
  username: z.string().min(3).max(32).regex(/^[a-z0-9_]+$/).optional(),
  city: z.string().min(1).max(120),
  region: z.string().max(120).optional(),
  country: z.string().min(2).max(120),
  privacyLevel: privacyLevelSchema.default("city"),
  genres: z.array(z.string()).min(1),
  instruments: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  isSeekingCollaboration: z.boolean().default(true),
  preciseLocationEnabled: z.boolean().default(false),
  consentLocation: z.boolean(),
  consentAi: z.boolean(),
  consentMarketing: z.boolean().default(false),
});

export const featureFlagSchema = z.object({
  key: featureFlagKeySchema,
  enabled: z.boolean(),
  description: z.string(),
  config: z.record(z.any()).default({}),
});

export const featureFlagsResponseSchema = z.object({
  flags: z.array(featureFlagSchema),
});

export const mapFilterSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  genres: z.array(z.string()).default([]),
  instruments: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  roles: z.array(roleSchema).default([]),
  seekingCollaboration: z.boolean().optional(),
});

export const mapPinSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string(),
  username: z.string().nullable(),
  role: roleSchema,
  city: z.string().nullable(),
  region: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  privacyLevel: privacyLevelSchema,
  genres: z.array(z.string()).default([]),
  instruments: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  headline: z.string().nullable(),
  isSeekingCollaboration: z.boolean(),
  isOnline: z.boolean().default(false),
  activitySnippet: z.string().nullable(),
});

export const mapQueryResponseSchema = z.object({
  pins: z.array(mapPinSchema),
  hotspots: z.array(
    z.object({
      id: z.string(),
      city: z.string(),
      region: z.string().nullable(),
      country: z.string(),
      artistCount: z.number().int().nonnegative(),
    }),
  ),
});

export const collabRequestCreateSchema = z.object({
  targetUserId: z.string().uuid(),
  message: z.string().min(1).max(500),
  requestedRole: z.string().min(2).max(80),
});

export const collabRequestSchema = z.object({
  id: z.string().uuid(),
  requesterUserId: z.string().uuid(),
  targetUserId: z.string().uuid(),
  message: z.string(),
  requestedRole: z.string(),
  status: collabRequestStatusSchema,
  createdAt: z.string(),
});

export const collabRequestsResponseSchema = z.object({
  requests: z.array(collabRequestSchema),
});

export const projectRoomCreateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).default(""),
  dueAt: z.string().datetime().nullable().optional(),
});

export const projectRoomSchema = z.object({
  id: z.string().uuid(),
  ownerUserId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  dueAt: z.string().nullable(),
  memberRole: projectMemberRoleSchema,
  taskSummary: z.object({
    todo: z.number().int().nonnegative(),
    inProgress: z.number().int().nonnegative(),
    done: z.number().int().nonnegative(),
  }),
  createdAt: z.string(),
});

export const projectRoomsResponseSchema = z.object({
  projectRooms: z.array(projectRoomSchema),
});

export const aimThreadCreateSchema = z.object({
  title: z.string().min(1).max(120),
  contextType: z.string().min(2).max(80),
});

export const aimThreadSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  contextType: z.string(),
  updatedAt: z.string(),
});

export const aimThreadsResponseSchema = z.object({
  threads: z.array(aimThreadSchema),
});

export const aimPromptRequestSchema = z.object({
  threadId: z.string().uuid().optional(),
  prompt: z.string().min(8).max(2000),
  contextType: z.enum([
    "career",
    "release",
    "outreach",
    "contracts",
    "pricing",
    "analytics",
    "next_steps",
  ]),
  artistSummary: z.string().max(1000).optional(),
});

export const aimDraftResponseSchema = z.object({
  threadId: z.string().uuid(),
  response: z.object({
    summary: z.string(),
    factualContext: z.array(z.string()),
    generatedAdvice: z.array(z.string()),
    nextActions: z.array(z.string()),
    caution: z.string(),
  }),
});

export const moderationReportSchema = z.object({
  reason: z.string().min(2).max(120),
  details: z.string().max(1000).optional(),
  targetUserId: z.string().uuid().optional(),
  statusPostId: z.string().uuid().optional(),
  messageId: z.string().uuid().optional(),
  projectRoomId: z.string().uuid().optional(),
});

export const sessionUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
});

export const meResponseSchema = z.object({
  user: sessionUserSchema,
  profile: profileSchema.nullable(),
  flags: z.array(featureFlagSchema),
});

export type Role = z.infer<typeof roleSchema>;
export type PrivacyLevel = z.infer<typeof privacyLevelSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type FeatureFlag = z.infer<typeof featureFlagSchema>;
export type MapPin = z.infer<typeof mapPinSchema>;
export type CollabRequest = z.infer<typeof collabRequestSchema>;
export type ProjectRoom = z.infer<typeof projectRoomSchema>;
