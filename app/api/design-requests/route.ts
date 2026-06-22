import { NextResponse } from "next/server";
import {
  createServerSupabaseClient,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";

type DesignRequestRow = {
  id: string;
  title: string;
  artist_name: string | null;
  description: string | null;
  content_type: string | null;
  platform: string | null;
  requested_by_name: string | null;
  requested_by_email: string | null;
  requested_by_role: string | null;
  approved_by_name: string | null;
  approved_by_email: string | null;
  approved_by_role: string | null;
  approved_at: string | null;
  asset_url: string | null;
  asset_path: string | null;
  file_name: string | null;
  status: string;
  created_at: string;
};

async function mapRow(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  row: DesignRequestRow,
) {
  let signedAssetUrl = row.asset_url ?? undefined;

  if (row.asset_path) {
    const { data } = await supabase.storage
      .from("post-artworks")
      .createSignedUrl(row.asset_path, 60 * 60 * 12);

    signedAssetUrl = data?.signedUrl ?? signedAssetUrl;
  }

  return {
    id: row.id,
    title: row.title,
    artist_name: row.artist_name ?? undefined,
    description: row.description ?? undefined,
    content_type: row.content_type ?? undefined,
    platform: row.platform ?? undefined,
    requested_by_name: row.requested_by_name ?? undefined,
    requested_by_email: row.requested_by_email ?? undefined,
    requested_by_role: row.requested_by_role ?? undefined,
    approved_by_name: row.approved_by_name ?? undefined,
    approved_by_email: row.approved_by_email ?? undefined,
    approved_by_role: row.approved_by_role ?? undefined,
    approved_at: row.approved_at ?? undefined,
    asset_url: signedAssetUrl,
    asset_path: row.asset_path ?? undefined,
    file_name: row.file_name ?? undefined,
    status: row.status,
    created_at: row.created_at,
  };
}

export async function GET() {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        items: [],
        error: "Supabase ainda nao configurado para salvar demandas.",
      },
      { status: 200 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("design_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        configured: false,
        items: [],
        error:
          "Tabela design_requests ainda nao existe no banco. Rode a query desta etapa no Supabase.",
      },
      { status: 200 },
    );
  }

  const items = await Promise.all(
    (data ?? []).map((row) => mapRow(supabase, row as DesignRequestRow)),
  );

  return NextResponse.json({
    configured: true,
    items,
  });
}

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        error: "Supabase ainda nao configurado para salvar demandas.",
      },
      { status: 200 },
    );
  }

  const payload = await request.json();

  if (!payload?.title || !payload?.description) {
    return NextResponse.json(
      { error: "Titulo e descricao sao obrigatorios." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("design_requests")
    .insert([
      {
        title: payload.title,
        artist_name: payload.artist_name ?? null,
        description: payload.description,
        content_type: payload.content_type ?? null,
        platform: payload.platform ?? null,
        requested_by_name: payload.requested_by_name ?? null,
        requested_by_email: payload.requested_by_email ?? null,
        requested_by_role: payload.requested_by_role ?? null,
        asset_url: payload.asset_url ?? null,
        asset_path: payload.asset_path ?? null,
        file_name: payload.file_name ?? null,
        status: "pending",
      },
    ])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      {
        configured: false,
        error:
          "Nao foi possivel salvar no Supabase. Verifique se a tabela design_requests foi criada.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    configured: true,
    item: await mapRow(supabase, data as DesignRequestRow),
  });
}

export async function PUT(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        error: "Supabase ainda nao configurado para atualizar demandas.",
      },
      { status: 200 },
    );
  }

  const payload = await request.json();

  if (!payload?.id || !payload?.status) {
    return NextResponse.json(
      { error: "Id e status sao obrigatorios." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("design_requests")
    .update({
      status: payload.status,
      approved_by_name: payload.approved_by_name ?? null,
      approved_by_email: payload.approved_by_email ?? null,
      approved_by_role: payload.approved_by_role ?? null,
      approved_at: payload.status === "approved" ? new Date().toISOString() : null,
    })
    .eq("id", payload.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      {
        configured: false,
        error: "Nao foi possivel atualizar a demanda no Supabase.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    configured: true,
    item: await mapRow(supabase, data as DesignRequestRow),
  });
}
