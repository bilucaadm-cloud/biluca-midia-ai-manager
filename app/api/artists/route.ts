import { NextResponse } from "next/server";
import { mapArtistRow, mapArtistToInsert } from "@/lib/supabase/mappers";
import {
  createServerSupabaseClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { configured: false, artists: [] },
      { status: 200 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    configured: true,
    artists: data.map(mapArtistRow),
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

  if (!payload?.artisticName) {
    return NextResponse.json(
      { error: "Nome artistico e obrigatorio." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("artists")
    .insert(mapArtistToInsert(payload))
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ artist: mapArtistRow(data) }, { status: 201 });
}
