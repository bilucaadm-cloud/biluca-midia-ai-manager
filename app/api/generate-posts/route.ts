import { NextResponse } from "next/server";
import type { Artist } from "@/lib/domain";
import { generatePostsWithOpenAI } from "@/lib/openai-post-generator";
import { generatePlannedPosts } from "@/lib/post-generator";
import {
  createServerSupabaseClient,
  getAuthenticatedUser,
  isSupabasePublicConfigured,
  isSupabaseServerConfigured,
} from "@/lib/supabase/server";
import { mapPlannedPostRow, mapPlannedPostToInsert } from "@/lib/supabase/mappers";

type RagDocumentRow = {
  title: string;
  body: string;
};

function buildRagContext(documents: RagDocumentRow[]) {
  return documents
    .map((document) => `# ${document.title}\n${document.body.slice(0, 2500)}`)
    .join("\n\n---\n\n")
    .slice(0, 10000);
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

  if (!payload?.artistId || !payload?.campaignGoal) {
    return NextResponse.json(
      { error: "Artista e objetivo da campanha sao obrigatorios." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();
  const { data: artistRow, error: artistError } = await supabase
    .from("artists")
    .select("*")
    .eq("id", payload.artistId)
    .single();

  if (artistError) {
    return NextResponse.json({ error: artistError.message }, { status: 500 });
  }

  const artist: Artist = {
    id: artistRow.id,
    artisticName: artistRow.artistic_name,
    legalName: artistRow.legal_name ?? undefined,
    city: artistRow.city ?? undefined,
    state: artistRow.state ?? undefined,
    genre: artistRow.genre ?? undefined,
    audience: artistRow.audience ?? undefined,
    toneOfVoice: artistRow.tone_of_voice ?? undefined,
    goals: artistRow.goals ?? undefined,
    instagramUrl: artistRow.instagram_url ?? undefined,
    status: artistRow.status,
    createdAt: artistRow.created_at,
  };

  const quantity = Math.min(Math.max(Number(payload.quantity) || 3, 1), 6);
  const { data: ragDocuments } = await supabase
    .from("rag_documents")
    .select("title, body")
    .is("artist_id", null)
    .limit(5);

  let generationSource: "openai" | "fallback" = "fallback";
  let generationWarning: string | undefined;
  let generatedPosts = generatePlannedPosts({
    artist,
    campaignGoal: payload.campaignGoal,
    quantity,
  });

  if (process.env.OPENAI_API_KEY) {
    try {
      generatedPosts = await generatePostsWithOpenAI({
        artist,
        campaignGoal: payload.campaignGoal,
        quantity,
        ragContext: buildRagContext((ragDocuments ?? []) as RagDocumentRow[]),
      });
      generationSource = "openai";
    } catch (error) {
      console.error(error);
      generationWarning =
        error instanceof Error && error.message.includes("insufficient_quota")
          ? "OpenAI sem cota/credito ativo. Usando gerador local."
          : "OpenAI falhou. Usando gerador local.";
      generationSource = "fallback";
    }
  }

  const { data, error } = await supabase
    .from("planned_posts")
    .insert(generatedPosts.map(mapPlannedPostToInsert))
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    generationSource,
    generationWarning,
    plannedPosts: data.map(mapPlannedPostRow),
  });
}
