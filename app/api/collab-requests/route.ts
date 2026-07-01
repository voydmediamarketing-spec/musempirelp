import { NextResponse } from "next/server";
import { collabRequestCreateSchema } from "@musempire/contracts";
import { sampleCollabRequests } from "@/lib/product-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function buildFallbackResponse() {
  return { requests: sampleCollabRequests };
}

export async function GET() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json(await buildFallbackResponse());
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data } = await supabase
    .from("collab_requests")
    .select("id, requester_user_id, target_user_id, message, requested_role, status, created_at")
    .or(`requester_user_id.eq.${user.id},target_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (!data) {
    return NextResponse.json(await buildFallbackResponse());
  }

  return NextResponse.json({
    requests: data.map((request) => ({
      id: request.id,
      requesterUserId: request.requester_user_id,
      targetUserId: request.target_user_id,
      message: request.message,
      requestedRole: request.requested_role,
      status: request.status,
      createdAt: request.created_at,
    })),
  });
}

export async function POST(request: Request) {
  const payload = collabRequestCreateSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid collaboration request payload." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({
      requests: [
        {
          id: crypto.randomUUID(),
          requesterUserId: "00000000-0000-0000-0000-000000000000",
          targetUserId: payload.data.targetUserId,
          message: payload.data.message,
          requestedRole: payload.data.requestedRole,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        ...sampleCollabRequests,
      ],
    }, { status: 201 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  await supabase.from("collab_requests").insert({
    requester_user_id: user.id,
    target_user_id: payload.data.targetUserId,
    message: payload.data.message,
    requested_role: payload.data.requestedRole,
  });

  return GET();
}
