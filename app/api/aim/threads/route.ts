import { NextResponse } from "next/server";
import { aimThreadCreateSchema } from "@musempire/contracts";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ threads: [] });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data } = await supabase
    .from("aim_threads")
    .select("id, user_id, title, context_type, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return NextResponse.json({
    threads: (data ?? []).map((thread) => ({
      id: thread.id,
      userId: thread.user_id,
      title: thread.title,
      contextType: thread.context_type,
      updatedAt: thread.updated_at,
    })),
  });
}

export async function POST(request: Request) {
  const payload = aimThreadCreateSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid AiM thread payload." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({
      threads: [
        {
          id: crypto.randomUUID(),
          userId: "00000000-0000-0000-0000-000000000000",
          title: payload.data.title,
          contextType: payload.data.contextType,
          updatedAt: new Date().toISOString(),
        },
      ],
    }, { status: 201 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  await supabase.from("aim_threads").insert({
    user_id: user.id,
    title: payload.data.title,
    context_type: payload.data.contextType,
  });

  return GET();
}
