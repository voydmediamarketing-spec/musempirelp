import { NextResponse } from "next/server";
import { projectRoomCreateSchema } from "@musempire/contracts";
import { sampleProjectRooms } from "@/lib/product-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ projectRooms: sampleProjectRooms });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: memberships } = await supabase
    .from("project_members")
    .select("project_room_id, member_role, project_rooms!inner(id, owner_user_id, name, description, due_at, created_at)")
    .eq("user_id", user.id);

  if (!memberships) {
    return NextResponse.json({ projectRooms: sampleProjectRooms });
  }

  const rooms = memberships
    .map((membership) => {
      const room = Array.isArray(membership.project_rooms)
        ? membership.project_rooms[0]
        : membership.project_rooms;

      if (!room) {
        return null;
      }

      return {
        id: room.id,
        ownerUserId: room.owner_user_id,
        name: room.name,
        description: room.description,
        dueAt: room.due_at,
        memberRole: membership.member_role,
        taskSummary: {
          todo: 0,
          inProgress: 0,
          done: 0,
        },
        createdAt: room.created_at,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ projectRooms: rooms });
}

export async function POST(request: Request) {
  const payload = projectRoomCreateSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid project room payload." }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return NextResponse.json({
      projectRooms: [
        {
          id: crypto.randomUUID(),
          ownerUserId: "00000000-0000-0000-0000-000000000000",
          name: payload.data.name,
          description: payload.data.description,
          dueAt: payload.data.dueAt ?? null,
          memberRole: "owner",
          taskSummary: {
            todo: 0,
            inProgress: 0,
            done: 0,
          },
          createdAt: new Date().toISOString(),
        },
        ...sampleProjectRooms,
      ],
    }, { status: 201 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const { data: room } = await supabase
    .from("project_rooms")
    .insert({
      owner_user_id: user.id,
      name: payload.data.name,
      description: payload.data.description,
      due_at: payload.data.dueAt ?? null,
    })
    .select("id")
    .single();

  if (room) {
    await supabase.from("project_members").insert({
      project_room_id: room.id,
      user_id: user.id,
      member_role: "owner",
    });
  }

  return GET();
}
