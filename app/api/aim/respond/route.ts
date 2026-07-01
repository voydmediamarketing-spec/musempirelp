import { NextResponse } from "next/server";
import { aimPromptRequestSchema } from "@musempire/contracts";
import { buildAimDraft } from "@/lib/aim";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = aimPromptRequestSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid AiM prompt payload." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(buildAimDraft(payload.data, crypto.randomUUID()));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  let threadId = payload.data.threadId;

  if (!threadId) {
    const { data: thread } = await supabase
      .from("aim_threads")
      .insert({
        user_id: user.id,
        title: `${payload.data.contextType} draft`,
        context_type: payload.data.contextType,
      })
      .select("id")
      .single();

    threadId = thread?.id ?? crypto.randomUUID();
  }

  const resolvedThreadId = threadId ?? crypto.randomUUID();

  await supabase.from("aim_messages").insert({
    thread_id: resolvedThreadId,
    role: "user",
    content: payload.data.prompt,
    metadata: {
      contextType: payload.data.contextType,
      artistSummary: payload.data.artistSummary ?? null,
    },
  });

  const draft = buildAimDraft(payload.data, resolvedThreadId);

  await supabase.from("aim_messages").insert({
    thread_id: resolvedThreadId,
    role: "assistant",
    content: draft.response.summary,
    metadata: draft.response,
  });

  await supabase.from("aim_actions").insert({
    thread_id: resolvedThreadId,
    user_id: user.id,
    action_type: payload.data.contextType,
    input: payload.data,
    output: draft.response,
    risk_level: payload.data.contextType === "contracts" ? "high" : "medium",
    approved: false,
  });

  return NextResponse.json(draft);
}
