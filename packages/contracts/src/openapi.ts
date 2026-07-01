import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  aimDraftResponseSchema,
  aimPromptRequestSchema,
  aimThreadCreateSchema,
  aimThreadsResponseSchema,
  apiErrorSchema,
  collabRequestCreateSchema,
  collabRequestsResponseSchema,
  featureFlagsResponseSchema,
  mapFilterSchema,
  mapQueryResponseSchema,
  meResponseSchema,
  onboardingRequestSchema,
  projectRoomCreateSchema,
  projectRoomsResponseSchema,
  profileUpdateSchema,
} from "./index";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const ApiError = registry.register("ApiError", apiErrorSchema);
const MeResponse = registry.register("MeResponse", meResponseSchema);
const FeatureFlagsResponse = registry.register("FeatureFlagsResponse", featureFlagsResponseSchema);
const OnboardingRequest = registry.register("OnboardingRequest", onboardingRequestSchema);
const ProfileUpdate = registry.register("ProfileUpdate", profileUpdateSchema);
const MapFilter = registry.register("MapFilter", mapFilterSchema);
const MapQueryResponse = registry.register("MapQueryResponse", mapQueryResponseSchema);
const CollabRequestCreate = registry.register("CollabRequestCreate", collabRequestCreateSchema);
const CollabRequestsResponse = registry.register("CollabRequestsResponse", collabRequestsResponseSchema);
const ProjectRoomCreate = registry.register("ProjectRoomCreate", projectRoomCreateSchema);
const ProjectRoomsResponse = registry.register("ProjectRoomsResponse", projectRoomsResponseSchema);
const AimThreadCreate = registry.register("AimThreadCreate", aimThreadCreateSchema);
const AimThreadsResponse = registry.register("AimThreadsResponse", aimThreadsResponseSchema);
const AimPromptRequest = registry.register("AimPromptRequest", aimPromptRequestSchema);
const AimDraftResponse = registry.register("AimDraftResponse", aimDraftResponseSchema);

registry.registerPath({
  method: "get",
  path: "/api/feature-flags",
  tags: ["Feature Flags"],
  responses: {
    200: {
      description: "Current feature flag state for the alpha app",
      content: {
        "application/json": {
          schema: FeatureFlagsResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/profile/me",
  tags: ["Profile"],
  responses: {
    200: {
      description: "Current authenticated user and product profile",
      content: {
        "application/json": {
          schema: MeResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/api/profile/me",
  tags: ["Profile"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: ProfileUpdate,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated profile",
      content: {
        "application/json": {
          schema: MeResponse,
        },
      },
    },
    400: {
      description: "Validation failure",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/onboarding",
  tags: ["Auth"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: OnboardingRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Onboarding completed",
      content: {
        "application/json": {
          schema: MeResponse,
        },
      },
    },
    401: {
      description: "Authentication required",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/map/query",
  tags: ["Map"],
  request: {
    query: MapFilter,
  },
  responses: {
    200: {
      description: "Map pins and hotspot summary",
      content: {
        "application/json": {
          schema: MapQueryResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/collab-requests",
  tags: ["Collaboration"],
  responses: {
    200: {
      description: "Collaboration requests visible to the current user",
      content: {
        "application/json": {
          schema: CollabRequestsResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/collab-requests",
  tags: ["Collaboration"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CollabRequestCreate,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Collaboration request created",
      content: {
        "application/json": {
          schema: CollabRequestsResponse,
        },
      },
    },
    400: {
      description: "Validation failure",
      content: {
        "application/json": {
          schema: ApiError,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/project-rooms",
  tags: ["Projects"],
  responses: {
    200: {
      description: "Project rooms the user can access",
      content: {
        "application/json": {
          schema: ProjectRoomsResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/project-rooms",
  tags: ["Projects"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: ProjectRoomCreate,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Project room created",
      content: {
        "application/json": {
          schema: ProjectRoomsResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/aim/threads",
  tags: ["AiM"],
  responses: {
    200: {
      description: "AiM threads owned by the current user",
      content: {
        "application/json": {
          schema: AimThreadsResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/aim/threads",
  tags: ["AiM"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: AimThreadCreate,
        },
      },
    },
  },
  responses: {
    201: {
      description: "AiM thread created",
      content: {
        "application/json": {
          schema: AimThreadsResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/aim/respond",
  tags: ["AiM"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: AimPromptRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: "AiM draft-only beta response",
      content: {
        "application/json": {
          schema: AimDraftResponse,
        },
      },
    },
  },
});

export function buildOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Musempire API",
      version: "0.1.0",
      description: "Typed API contracts for the Musempire alpha platform.",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  });
}
