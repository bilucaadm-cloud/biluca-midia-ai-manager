import type { Artist, PlannedPost } from "@/lib/domain";

type GeneratePostsInput = {
  artist: Artist;
  campaignGoal: string;
  quantity: number;
};

const formatPlan = [
  "Reels",
  "Carrossel",
  "Story",
  "Reels",
  "Post feed",
  "Story",
];

const goalTemplates = {
  lancamento: [
    "apresentar a historia da musica",
    "criar expectativa para o lancamento",
    "convidar para o pre-save",
    "mostrar bastidor da gravacao",
  ],
  engajamento: [
    "abrir conversa com o publico",
    "gerar comentarios",
    "estimular compartilhamentos",
    "aproximar artista e fas",
  ],
  crescimento: [
    "atrair novos seguidores",
    "apresentar identidade artistica",
    "mostrar diferencial musical",
    "criar conteudo facil de descobrir",
  ],
};

function pickGoalThemes(goal: string) {
  const normalized = goal.toLowerCase();

  if (normalized.includes("lanc") || normalized.includes("pré") || normalized.includes("pre")) {
    return goalTemplates.lancamento;
  }

  if (normalized.includes("engaj") || normalized.includes("coment")) {
    return goalTemplates.engajamento;
  }

  return goalTemplates.crescimento;
}

function cleanHashtag(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

export function generatePlannedPosts({
  artist,
  campaignGoal,
  quantity,
}: GeneratePostsInput): PlannedPost[] {
  const themes = pickGoalThemes(campaignGoal);
  const genre = artist.genre ?? "musica brasileira";
  const city = artist.city ? ` de ${artist.city}` : "";
  const audience = artist.audience ?? "seu publico";
  const tone = artist.toneOfVoice ?? "proximo, claro e profissional";

  return Array.from({ length: quantity }).map((_, index) => {
    const theme = themes[index % themes.length];
    const format = formatPlan[index % formatPlan.length];
    const title = `${format} - ${theme}`;
    const hook =
      index % 2 === 0
        ? `Se voce curte ${genre}, esse momento e pra voce.`
        : `Tem uma historia por tras desse som que ${audience} precisa conhecer.`;

    return {
      id: `generated-${Date.now()}-${index}`,
      artistId: artist.id,
      channel: "instagram",
      format,
      title,
      caption: `${hook}\n\n${artist.artisticName}${city} esta construindo uma nova fase com foco em ${campaignGoal}. Acompanhe os proximos passos e salva esse post para nao perder.\n\n`,
      cta: index % 2 === 0 ? "Comenta o que voce achou." : "Salva e envia para alguem que vai curtir.",
      hashtags: [
        cleanHashtag(genre),
        cleanHashtag(artist.artisticName),
        "musicabrasileira",
        "lancamentomusical",
      ].filter(Boolean),
      designBrief: `Criar arte para ${format} com linguagem ${tone}. Visual focado em ${genre}, usando imagem do artista, titulo forte, contraste alto e elementos que comuniquem ${theme}. Formato recomendado: ${format === "Story" ? "1080x1920" : "1080x1350 ou 1080x1920"}.`,
      designStatus: "briefing_ready",
      status: "waiting_design",
      createdAt: new Date().toISOString(),
    };
  });
}
