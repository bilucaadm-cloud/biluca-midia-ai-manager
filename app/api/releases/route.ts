import { NextResponse } from "next/server";
import { mapReleaseRow, mapReleaseToInsert } from "@/lib/supabase/mappers";
import {
  createServerSupabaseClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { configured: false, releases: [] },
      { status: 200 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("releases")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    releases: data.map(mapReleaseRow),
  });
}

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const payload = await request.json();

  if (!payload?.artistId || !payload?.title) {
    return NextResponse.json(
      { error: "Artista e titulo sao obrigatorios." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("releases")
    .insert(mapReleaseToInsert(payload))
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ release: mapReleaseRow(data) }, { status: 201 });
}
