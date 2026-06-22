import { NextResponse } from "next/server";
import { mapPlannedPostRow, mapPlannedPostToInsert } from "@/lib/supabase/mappers";
import {
  createServerSupabaseClient,
  getAuthenticatedUser,
  isSupabasePublicConfigured,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { configured: false, plannedPosts: [] },
      { status: 200 },
    );
  }

  if (isSupabasePublicConfigured() && !(await getAuthenticatedUser(request))) {
    return NextResponse.json({ error: "Login obrigatorio." }, { status: 401 });
  }

  const url = new URL(request.url);
  const artistId = url.searchParams.get("artistId");
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("planned_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (artistId) {
    query = query.eq("artist_id", artistId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    plannedPosts: data.map(mapPlannedPostRow),
  });
}

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  if (isSupabasePublicConfigured() && !(await getAuthenticatedUser(request))) {
    return NextResponse.json({ error: "Login obrigatorio." }, { status: 401 });
  }

  const payload = await request.json();

  if (!payload?.artistId || !payload?.title || !payload?.format) {
    return NextResponse.json(
      { error: "Artista, titulo e formato sao obrigatorios." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("planned_posts")
    .insert(mapPlannedPostToInsert(payload))
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { plannedPost: mapPlannedPostRow(data) },
    { status: 201 },
  );
}
