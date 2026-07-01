import type { aimDraftResponseSchema, aimPromptRequestSchema } from "@musempire/contracts";
import type { z } from "zod";

type AimPromptRequest = z.infer<typeof aimPromptRequestSchema>;
type AimDraftResponse = z.infer<typeof aimDraftResponseSchema>;

const contextLeads: Record<AimPromptRequest["contextType"], string> = {
  career: "Focus on a 90-day growth rhythm that compounds visibility and repeatable habits.",
  release: "Optimize around timing, audience preparation, and a clear sequence of release assets.",
  outreach: "Keep outreach specific, respectful, and easy for the recipient to answer.",
  contracts: "Use this as a draft summary only and review legal language with a qualified professional.",
  pricing: "Anchor pricing in proof, scope, turnaround, and the artist's current leverage.",
  analytics: "Separate signal from noise and only act on metrics that connect to actual fan behavior.",
  next_steps: "Turn uncertainty into a short list of shippable actions with owners and due dates.",
};

export function buildAimDraft(input: AimPromptRequest, threadId: string): AimDraftResponse {
  const lead = contextLeads[input.contextType];
  const artistSummary = input.artistSummary?.trim();

  return {
    threadId,
    response: {
      summary: `${lead} ${artistSummary ? `Context noted: ${artistSummary}` : "Use the current profile and project context as the baseline."}`,
      factualContext: [
        "AiM beta is operating in draft-only mode.",
        `Request type: ${input.contextType}.`,
        artistSummary ? `User-supplied context: ${artistSummary}` : "No additional artist summary was provided.",
      ],
      generatedAdvice: [
        "Clarify the exact outcome you want before committing to a tactic.",
        "Reduce the next move to one message, one asset, or one decision owner.",
        "Pair every recommendation with a date and an observable success signal.",
      ],
      nextActions: [
        "Create a project room milestone for this goal.",
        "Draft outreach or rollout copy and review it before sending.",
        "Record one follow-up metric to check in the next seven days.",
      ],
      caution: "This response is generated guidance, not legal, financial, or publishing execution.",
    },
  };
}
