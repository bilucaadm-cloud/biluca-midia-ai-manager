import type { Artist, PlannedPost } from "@/lib/domain";

type OpenAIPostInput = {
  artist: Artist;
  campaignGoal: string;
  quantity: number;
  ragContext: string;
};

type GeneratedPostPayload = {
  title?: string;
  format?: string;
  caption?: string;
  cta?: string;
  hashtags?: string[];
  designBrief?: string;
};

function extractJson(text: string) {
  const withoutFence = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = withoutFence.indexOf("[");
  const end = withoutFence.lastIndexOf("]");

  if (start === -1 || end === -1) {
    throw new Error("OpenAI response did not include a JSON array.");
  }

  return withoutFence.slice(start, end + 1);
}

export async function generatePostsWithOpenAI({
  artist,
  campaignGoal,
  quantity,
  ragContext,
}: OpenAIPostInput): Promise<PlannedPost[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const model = process.env.OPENAI_CHAT_MODEL || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    body: JSON.stringify({
      input: [
        {
          content:
            "Voce e um social media musical senior para artistas brasileiros. Gere posts praticos, com copy, CTA, hashtags e briefing claro para designer. Responda somente JSON valido.",
          role: "system",
        },
        {
          content: `Artista:
- Nome: ${artist.artisticName}
- Genero: ${artist.genre ?? "nao informado"}
- Cidade/estado: ${[artist.city, artist.state].filter(Boolean).join("/") || "nao informado"}
- Publico: ${artist.audience ?? "nao informado"}
- Tom de voz: ${artist.toneOfVoice ?? "nao informado"}
- Objetivo cadastrado: ${artist.goals ?? "nao informado"}

Objetivo da campanha: ${campaignGoal}
Quantidade: ${quantity}

Contexto RAG:
${ragContext || "Sem contexto adicional."}

Retorne um array JSON com exatamente ${quantity} objetos. Cada objeto deve ter:
{
  "title": "titulo interno curto",
  "format": "Reels | Carrossel | Story | Post feed",
  "caption": "legenda pronta",
  "cta": "chamada para acao",
  "hashtags": ["sem #, lowercase"],
  "designBrief": "briefing objetivo para designer com formato, clima, elementos visuais e texto principal"
}`,
          role: "user",
        },
      ],
      model,
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  const outputText =
    payload.output_text ??
    payload.output
      ?.flatMap((item: { content?: Array<{ text?: string }> }) => item.content ?? [])
      .map((content: { text?: string }) => content.text ?? "")
      .join("");

  if (!outputText) {
    throw new Error("OpenAI response was empty.");
  }

  const generated = JSON.parse(extractJson(outputText)) as GeneratedPostPayload[];

  return generated.slice(0, quantity).map((post, index) => ({
    id: `openai-${Date.now()}-${index}`,
    artistId: artist.id,
    channel: "instagram",
    format: post.format || "Reels",
    title: post.title || `Post gerado ${index + 1}`,
    caption: post.caption,
    cta: post.cta,
    hashtags: post.hashtags ?? [],
    designBrief: post.designBrief,
    designStatus: "briefing_ready",
    status: "waiting_design",
    createdAt: new Date().toISOString(),
  }));
}
