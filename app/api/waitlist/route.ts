import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistInsert = {
  email: string;
};

async function fetchWaitlistCount(supabase: NonNullable<ReturnType<typeof createAdminSupabaseClient>>) {
  const { count, error } = await supabase
    .from("waitlist")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function GET() {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase environment variables are missing." },
      { status: 503 },
    );
  }

  try {
    const count = await fetchWaitlistCount(supabase);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ message: "Failed to load waitlist count." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createAdminSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase environment variables are missing." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as WaitlistInsert;
    const email = body.email?.trim().toLowerCase();

    if (!email || !emailPattern.test(email)) {
      return NextResponse.json({ message: "Please provide a valid email." }, { status: 400 });
    }

    const { error } = await supabase.from("waitlist").insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "This email is already on the waitlist." }, { status: 409 });
      }

      return NextResponse.json({ message: "Unable to join waitlist right now." }, { status: 500 });
    }

    const count = await fetchWaitlistCount(supabase);

    return NextResponse.json({ message: "You're in. We'll be in touch.", count }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Unexpected request error." }, { status: 500 });
  }
}
