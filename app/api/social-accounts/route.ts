import { NextResponse } from "next/server";
import {
  mapSocialAccountRow,
  mapSocialAccountToInsert,
} from "@/lib/supabase/mappers";
import {
  createServerSupabaseClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

export async function GET(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { configured: false, socialAccounts: [] },
      { status: 200 },
    );
  }

  const url = new URL(request.url);
  const artistId = url.searchParams.get("artistId");
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("social_accounts")
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
    socialAccounts: data.map(mapSocialAccountRow),
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

  if (!payload?.artistId || !payload?.platform || !payload?.accountLabel) {
    return NextResponse.json(
      { error: "Artista, plataforma e nome da conta sao obrigatorios." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("social_accounts")
    .insert(mapSocialAccountToInsert(payload))
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { socialAccount: mapSocialAccountRow(data) },
    { status: 201 },
  );
}
