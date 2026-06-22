"use client";

import {
  Activity,
  Album,
  BarChart3,
  Bot,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  FileAudio,
  Library,
  MessageCircle,
  MessageSquareReply,
  Mic2,
  Music2,
  Network,
  Palette,
  Plus,
  Radio,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  SquarePen,
  Target,
  TrendingUp,
  UploadCloud,
  Users,
  Wand2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Artist, MusicRelease, PlannedPost, SocialAccount } from "@/lib/domain";
import { brazilianMusicGenres } from "@/lib/music-genres";

const agentModes = [
  "Planejar lancamento",
  "Criar calendario",
  "Responder artista",
  "Analisar metricas",
];

const knowledge = [
  "Checklist de lancamento musical",
  "Referencias de artistas por estilo brasileiro",
  "Guia de social media musical",
  "Scripts de WhatsApp",
  "Processo operacional Biluca Midia",
];

const instagramCapabilities = [
  {
    title: "Criar e aprovar posts",
    detail: "Legenda, roteiro, briefing de arte, CTA e hashtags por estilo musical.",
    Icon: SquarePen,
    status: "MVP",
  },
  {
    title: "Publicar no Instagram",
    detail: "Publicacao via API para conta profissional, depois de permissao Meta.",
    Icon: Camera,
    status: "API",
  },
  {
    title: "Responder comentarios",
    detail: "Sugestao e resposta automatica com tom do artista e filtros de seguranca.",
    Icon: MessageSquareReply,
    status: "API",
  },
  {
    title: "Ler metricas",
    detail: "Insights de posts, Reels e crescimento para relatorios semanais.",
    Icon: BarChart3,
    status: "API",
  },
];

const socialVaultPreview = [
  { platform: "Instagram", status: "OAuth planejado", permission: "Publicar, comentarios, insights" },
  { platform: "TikTok", status: "OAuth planejado", permission: "Publicar e metricas quando disponivel" },
  { platform: "YouTube", status: "OAuth planejado", permission: "Videos, Shorts, comentarios e metricas" },
  { platform: "WhatsApp", status: "API planejada", permission: "Atendimento e notificacoes" },
];

const socialPlatforms = [
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "YouTube", value: "youtube" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Facebook", value: "facebook" },
  { label: "Threads", value: "threads" },
  { label: "Spotify", value: "spotify" },
] as const;

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

const calendar = [
  {
    day: "Hoje",
    channel: "Instagram",
    format: "Reels",
    title: "Gancho do refrao + bastidor do estudio",
    intent: "Salvamentos",
  },
  {
    day: "Amanha",
    channel: "TikTok",
    format: "Trend",
    title: "Versao acustica de 15 segundos",
    intent: "Uso do audio",
  },
  {
    day: "Sex",
    channel: "YouTube",
    format: "Short",
    title: "Historia real por tras da musica",
    intent: "Retencao",
  },
];

const initialArtists: Artist[] = [
  {
    id: "artist-1",
    artisticName: "Lia Vento",
    city: "Sao Paulo",
    state: "SP",
    genre: "Pop brasileiro",
    audience: "Jovens de 18 a 28 anos que consomem pop urbano e Reels",
    toneOfVoice: "Proximo, confiante e emocional",
    goals: "Crescer pre-save e preparar lancamento do single",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "artist-2",
    artisticName: "Rafa Norte",
    city: "Recife",
    state: "PE",
    genre: "Trap nordestino",
    audience: "Publico jovem do Nordeste ligado em trap, moda e rua",
    toneOfVoice: "Direto, regional e aspiracional",
    goals: "Criar presenca forte no TikTok",
    status: "onboarding",
    createdAt: new Date().toISOString(),
  },
  {
    id: "artist-3",
    artisticName: "Duo Marfim",
    city: "Goiania",
    state: "GO",
    genre: "Sertanejo universitário",
    audience: "Fas de sertanejo romantico e universitario",
    toneOfVoice: "Romantico, popular e leve",
    goals: "Organizar ficha tecnica e distribuicao",
    status: "lead",
    createdAt: new Date().toISOString(),
  },
];

const initialReleases: MusicRelease[] = [
  {
    id: "release-1",
    artistId: "artist-1",
    title: "Meia Noite",
    releaseType: "single",
    targetDate: "2026-07-10",
    status: "pre_save",
    audioStatus: "approved",
    coverStatus: "approved",
    technicalSheetStatus: "pending",
    notes: "Priorizar Reels, pre-save e lista VIP.",
    createdAt: new Date().toISOString(),
  },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>(initialArtists);
  const [releases, setReleases] = useState<MusicRelease[]>(initialReleases);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [plannedPosts, setPlannedPosts] = useState<PlannedPost[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState(initialArtists[0].id);
  const [selectedMode, setSelectedMode] = useState(agentModes[0]);
  const [connectionStatus, setConnectionStatus] = useState(
    "Modo local: configure o Supabase para salvar no banco.",
  );
  const [isSaving, setIsSaving] = useState(false);

  const selectedArtist = artists.find((artist) => artist.id === selectedArtistId) ?? artists[0];
  const selectedRelease = releases.find((release) => release.artistId === selectedArtist?.id);
  const selectedSocialAccounts = socialAccounts.filter(
    (account) => account.artistId === selectedArtist?.id,
  );
  const selectedPlannedPosts = plannedPosts.filter(
    (post) => post.artistId === selectedArtist?.id,
  );

  const activeArtists = artists.filter((artist) => artist.status === "active").length;
  const pendingTasks = releases.reduce((total, release) => {
    return (
      total +
      [release.audioStatus, release.coverStatus, release.technicalSheetStatus].filter(
        (status) => status !== "approved",
      ).length
    );
  }, 0);

  const agentPreview = useMemo(() => {
    if (!selectedArtist) {
      return "Cadastre um artista para o agente montar um plano com base no estilo, publico e objetivo.";
    }

    return `Plano inicial para ${selectedArtist.artisticName}: adaptar a estrategia para ${selectedArtist.genre}, falar com ${selectedArtist.audience || "o publico definido no cadastro"} e transformar o objetivo "${selectedArtist.goals || "crescimento artistico"}" em calendario, tarefas e mensagens de atendimento.`;
  }, [selectedArtist]);

  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const [artistsResponse, releasesResponse] = await Promise.all([
          fetch("/api/artists"),
          fetch("/api/releases"),
        ]);
        const artistsPayload = await artistsResponse.json();
        const releasesPayload = await releasesResponse.json();

        if (!artistsPayload.configured || !releasesPayload.configured) {
          setConnectionStatus("Modo local: Supabase ainda nao configurado.");
          return;
        }

        setArtists(artistsPayload.artists);
        setReleases(releasesPayload.releases);
        setSelectedArtistId(artistsPayload.artists[0]?.id ?? "");
        setConnectionStatus("Conectado ao Supabase: dados reais carregados.");
      } catch {
        setConnectionStatus("Modo local: nao foi possivel carregar o Supabase.");
      }
    }

    loadSupabaseData();
  }, []);

  useEffect(() => {
    async function loadArtistWorkflow() {
      if (!selectedArtistId || !isUuid(selectedArtistId)) {
        return;
      }

      try {
        const [socialResponse, postsResponse] = await Promise.all([
          fetch(`/api/social-accounts?artistId=${selectedArtistId}`),
          fetch(`/api/planned-posts?artistId=${selectedArtistId}`),
        ]);
        const socialPayload = await socialResponse.json();
        const postsPayload = await postsResponse.json();

        if (socialPayload.configured && Array.isArray(socialPayload.socialAccounts)) {
          setSocialAccounts((current) => {
            const otherAccounts = current.filter(
              (account) => account.artistId !== selectedArtistId,
            );
            return [...socialPayload.socialAccounts, ...otherAccounts];
          });
        }

        if (postsPayload.configured && Array.isArray(postsPayload.plannedPosts)) {
          setPlannedPosts((current) => {
            const otherPosts = current.filter((post) => post.artistId !== selectedArtistId);
            return [...postsPayload.plannedPosts, ...otherPosts];
          });
        }
      } catch {
        setConnectionStatus("Nao foi possivel carregar conexoes sociais e posts.");
      }
    }

    loadArtistWorkflow();
  }, [selectedArtistId]);

  async function handleArtistSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const artisticName = String(form.get("artisticName") ?? "").trim();

    if (!artisticName) {
      return;
    }

    const artist: Artist = {
      id: `artist-${Date.now()}`,
      artisticName,
      legalName: String(form.get("legalName") ?? "").trim() || undefined,
      city: String(form.get("city") ?? "").trim() || undefined,
      state: String(form.get("state") ?? "").trim() || undefined,
      genre: String(form.get("genre") ?? "").trim() || undefined,
      audience: String(form.get("audience") ?? "").trim() || undefined,
      toneOfVoice: String(form.get("toneOfVoice") ?? "").trim() || undefined,
      goals: String(form.get("goals") ?? "").trim() || undefined,
      instagramUrl: String(form.get("instagramUrl") ?? "").trim() || undefined,
      status: "onboarding",
      createdAt: new Date().toISOString(),
    };

    setIsSaving(true);

    try {
      const response = await fetch("/api/artists", {
        body: JSON.stringify(artist),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (response.ok) {
        const payload = await response.json();
        const savedArtist = payload.artist as Artist;
        setArtists((current) => [savedArtist, ...current]);
        setSelectedArtistId(savedArtist.id);
        setConnectionStatus("Artista salvo no Supabase.");
      } else if (response.status === 503) {
        setArtists((current) => [artist, ...current]);
        setSelectedArtistId(artist.id);
        setConnectionStatus("Supabase nao configurado. Artista salvo apenas nesta tela.");
      } else {
        const payload = await response.json();
        setConnectionStatus(payload.error ?? "Erro ao salvar artista.");
      }
    } catch {
      setArtists((current) => [artist, ...current]);
      setSelectedArtistId(artist.id);
      setConnectionStatus("Sem conexao com API. Artista salvo apenas nesta tela.");
    } finally {
      setIsSaving(false);
      formElement.reset();
    }
  }

  async function handleReleaseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();

    if (!selectedArtist || !title) {
      return;
    }

    const release: MusicRelease = {
      id: `release-${Date.now()}`,
      artistId: selectedArtist.id,
      title,
      releaseType: String(form.get("releaseType") ?? "single") as MusicRelease["releaseType"],
      targetDate: String(form.get("targetDate") ?? "") || undefined,
      status: "collecting_assets",
      audioStatus: String(form.get("audioStatus") ?? "pending") as MusicRelease["audioStatus"],
      coverStatus: String(form.get("coverStatus") ?? "pending") as MusicRelease["coverStatus"],
      technicalSheetStatus: String(
        form.get("technicalSheetStatus") ?? "pending",
      ) as MusicRelease["technicalSheetStatus"],
      notes: String(form.get("notes") ?? "").trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setIsSaving(true);

    try {
      const response = await fetch("/api/releases", {
        body: JSON.stringify(release),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (response.ok) {
        const payload = await response.json();
        setReleases((current) => [payload.release as MusicRelease, ...current]);
        setConnectionStatus("Lancamento salvo no Supabase.");
      } else if (response.status === 503) {
        setReleases((current) => [release, ...current]);
        setConnectionStatus("Supabase nao configurado. Lancamento salvo apenas nesta tela.");
      } else {
        const payload = await response.json();
        setConnectionStatus(payload.error ?? "Erro ao salvar lancamento.");
      }
    } catch {
      setReleases((current) => [release, ...current]);
      setConnectionStatus("Sem conexao com API. Lancamento salvo apenas nesta tela.");
    } finally {
      setIsSaving(false);
      formElement.reset();
    }
  }

  async function handleSocialAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);

    if (!selectedArtist) {
      return;
    }

    const socialAccount: SocialAccount = {
      id: `social-${Date.now()}`,
      artistId: selectedArtist.id,
      platform: String(form.get("platform") ?? "instagram") as SocialAccount["platform"],
      accountLabel: String(form.get("accountLabel") ?? "").trim(),
      username: String(form.get("username") ?? "").trim() || undefined,
      loginEmail: String(form.get("loginEmail") ?? "").trim() || undefined,
      status: String(form.get("status") ?? "not_connected") as SocialAccount["status"],
      scopes: [],
      connectedAt: undefined,
      createdAt: new Date().toISOString(),
    };

    if (!socialAccount.accountLabel) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/social-accounts", {
        body: JSON.stringify(socialAccount),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (response.ok) {
        const payload = await response.json();
        setSocialAccounts((current) => [
          payload.socialAccount as SocialAccount,
          ...current,
        ]);
        setConnectionStatus("Conexao social salva no Supabase.");
      } else {
        const payload = await response.json();
        setConnectionStatus(payload.error ?? "Erro ao salvar conexao social.");
      }
    } catch {
      setConnectionStatus("Sem conexao com API. Conexao social nao foi salva.");
    } finally {
      setIsSaving(false);
      formElement.reset();
    }
  }

  async function handlePlannedPostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);

    if (!selectedArtist) {
      return;
    }

    const hashtags = String(form.get("hashtags") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const plannedPost: PlannedPost = {
      id: `post-${Date.now()}`,
      artistId: selectedArtist.id,
      socialAccountId: String(form.get("socialAccountId") ?? "") || undefined,
      channel: String(form.get("channel") ?? "instagram") as PlannedPost["channel"],
      format: String(form.get("format") ?? "").trim(),
      title: String(form.get("title") ?? "").trim(),
      caption: String(form.get("caption") ?? "").trim() || undefined,
      cta: String(form.get("cta") ?? "").trim() || undefined,
      hashtags,
      designBrief: String(form.get("designBrief") ?? "").trim() || undefined,
      designStatus: String(form.get("designStatus") ?? "briefing_ready") as PlannedPost["designStatus"],
      artworkUrl: String(form.get("artworkUrl") ?? "").trim() || undefined,
      scheduledFor: String(form.get("scheduledFor") ?? "") || undefined,
      status: "waiting_design",
      createdAt: new Date().toISOString(),
    };

    if (!plannedPost.title || !plannedPost.format) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/planned-posts", {
        body: JSON.stringify(plannedPost),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (response.ok) {
        const payload = await response.json();
        setPlannedPosts((current) => [payload.plannedPost as PlannedPost, ...current]);
        setConnectionStatus("Post planejado salvo no Supabase.");
      } else {
        const payload = await response.json();
        setConnectionStatus(payload.error ?? "Erro ao salvar post planejado.");
      }
    } catch {
      setConnectionStatus("Sem conexao com API. Post planejado nao foi salvo.");
    } finally {
      setIsSaving(false);
      formElement.reset();
    }
  }

  async function handleGeneratePostsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(event.currentTarget);

    if (!selectedArtist) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/generate-posts", {
        body: JSON.stringify({
          artistId: selectedArtist.id,
          campaignGoal: String(form.get("campaignGoal") ?? "").trim(),
          quantity: Number(form.get("quantity") ?? 3),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (response.ok) {
        const payload = await response.json();
        setPlannedPosts((current) => [
          ...(payload.plannedPosts as PlannedPost[]),
          ...current,
        ]);
        setConnectionStatus(
          payload.generationSource === "openai"
            ? "OpenAI gerou e salvou posts planejados."
            : payload.generationWarning ??
                "Gerador local criou os posts. Configure OPENAI_API_KEY para IA completa.",
        );
      } else {
        const payload = await response.json();
        setConnectionStatus(payload.error ?? "Erro ao gerar posts.");
      }
    } catch {
      setConnectionStatus("Sem conexao com API. Nao foi possivel gerar posts.");
    } finally {
      setIsSaving(false);
      formElement.reset();
    }
  }

  return (
    <main className="min-h-screen bg-[#edf1f2] text-[#121417]">
      <section className="border-b border-[#1d2528] bg-[#0b0f12] text-[#f6fbf9]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside className="flex flex-col justify-between rounded-lg border border-[#243034] bg-[#11181b] p-5 shadow-2xl shadow-black/20">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-[#72f2a6] text-[#0b0f12]">
                  <Music2 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm text-[#a8b7b2]">Biluca Midia</p>
                  <h1 className="text-xl font-semibold">AI Manager</h1>
                </div>
              </div>
              <nav className="mt-8 grid gap-2 text-sm">
                {[
                  ["Comando", Bot],
                  ["Artistas", Users],
                  ["Lancamentos", Album],
                  ["Conteudo", CalendarDays],
                  ["RAG", Library],
                  ["WhatsApp", MessageCircle],
                ].map(([label, Icon]) => (
                  <button
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-[#e7efed] transition hover:bg-[#1d282c]"
                    key={String(label)}
                    type="button"
                  >
                    <Icon size={17} />
                    {String(label)}
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-8 rounded-md border border-[#243034] bg-[#0e1416] p-4">
              <p className="text-xs uppercase text-[#72f2a6]">Cobertura musical</p>
              <p className="mt-2 text-sm leading-6 text-[#d7e0dc]">
                Preparado para forro, funk, gospel, sertanejo, rap, samba, piseiro,
                brega, MPB, rock, pagode e outras cenas do Brasil.
              </p>
            </div>
          </aside>

          <div className="grid gap-6">
            <header className="flex flex-col gap-5 py-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm text-[#f2c14e]">
                  <Radio size={16} />
                  Central de operacao musical brasileira
                </p>
                <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                  Um social media inteligente para criar, aprovar, publicar e medir.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#b8c4c0]">
                  Primeiro ele organiza o trabalho. Depois conecta Instagram, comentarios,
                  metricas e automacoes oficiais da Meta.
                </p>
              </div>
              <div className="grid min-w-64 gap-3 rounded-lg border border-[#243034] bg-[#11181b] p-4 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between text-sm text-[#b8c4c0]">
                  <span>Estilos mapeados</span>
                  <span className="flex items-center gap-1 text-[#72f2a6]">
                    <CheckCircle2 size={15} />
                    {brazilianMusicGenres.length}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#243034]">
                  <div className="h-2 w-full rounded-full bg-[#72f2a6]" />
                </div>
                <p className="text-xs text-[#8da09a]">
                  Base preparada para artistas de todas as regioes.
                </p>
              </div>
            </header>

            <section className="grid gap-4 md:grid-cols-4">
              {[
                ["Artistas", String(artists.length), Users, `${activeArtists} ativos`],
                ["Lancamentos", String(releases.length), FileAudio, "em planejamento"],
                ["Conteudos", "46", CalendarDays, "modelo inicial"],
                ["Pendencias", String(pendingTasks), Clock3, "arquivos e ficha"],
              ].map(([label, value, Icon, detail]) => (
                <article
                  className="rounded-lg border border-[#243034] bg-[#11181b] p-4 shadow-xl shadow-black/10"
                  key={String(label)}
                >
                  <div className="flex items-center justify-between text-[#b8c4c0]">
                    <p className="text-sm">{String(label)}</p>
                    <Icon size={18} />
                  </div>
                  <p className="mt-3 text-3xl font-semibold">{String(value)}</p>
                  <p className="mt-1 text-sm text-[#8da09a]">{String(detail)}</p>
                </article>
              ))}
            </section>
            <div className="rounded-lg border border-[#243034] bg-[#11181b] px-4 py-3 text-sm text-[#e7efed]">
              {connectionStatus}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="grid gap-6">
          <article className="rounded-lg border border-[#ccd6d8] bg-[#10171a] p-5 text-white shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-[#72f2a6]">
                  <Camera size={17} />
                  Social Media Agent
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  O agente vai operar como uma equipe de Instagram para artistas.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#b8c4c0]">
                  No MVP ele cria, organiza e aprova. Na fase Meta API ele publica,
                  responde comentarios, coleta metricas e gera relatorios.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-[#2b3a3f] bg-[#172024] px-3 py-2 text-sm text-[#d7e0dc]">
                <ShieldCheck size={16} className="text-[#72f2a6]" />
                Publicacao com aprovacao humana
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {instagramCapabilities.map(({ title, detail, Icon, status }) => (
                <div className="rounded-lg border border-[#253237] bg-[#172024] p-4" key={title}>
                  <div className="flex items-center justify-between">
                    <Icon size={20} className="text-[#72f2a6]" />
                    <span className="rounded-full bg-[#223036] px-2 py-1 text-xs text-[#b8c4c0]">
                      {status}
                    </span>
                  </div>
                  <h4 className="mt-3 font-semibold">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#a8b7b2]">{detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-[#8d4f2a]">
                  <Sparkles size={16} />
                  Comando do agente
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Selecione um artista para orientar a IA
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {agentModes.map((mode) => (
                  <button
                    className={`rounded-md border px-3 py-2 text-sm transition ${
                      selectedMode === mode
                        ? "border-[#191714] bg-[#191714] text-white"
                        : "border-[#ded6cb] bg-[#fbf8f2] text-[#544b40] hover:border-[#bcae9d]"
                    }`}
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
              <label className="grid gap-2 text-sm font-medium">
                Artista ativo
                <select
                  className="rounded-md border border-[#d8cec0] bg-[#fbf8f2] px-3 py-3 outline-none ring-[#f2c14e] transition focus:ring-2"
                  onChange={(event) => setSelectedArtistId(event.target.value)}
                  value={selectedArtistId}
                >
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.artisticName} - {artist.genre}
                    </option>
                  ))}
                </select>
              </label>
              <div className="rounded-lg border border-[#eadfcd] bg-[#fffaf1] p-4">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f2c14e]">
                    <Bot size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{selectedMode}</p>
                    <p className="mt-2 leading-7 text-[#5d5348]">{agentPreview}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="flex items-center gap-2 rounded-md bg-[#191714] px-3 py-2 text-sm text-white"
                        type="button"
                      >
                        <Wand2 size={16} />
                        Gerar plano
                      </button>
                      <button
                        className="flex items-center gap-2 rounded-md border border-[#d8cec0] px-3 py-2 text-sm"
                        type="button"
                      >
                        <UploadCloud size={16} />
                        Adicionar documento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-md bg-[#191714] text-white">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#8d4f2a]">Cadastro</p>
                  <h3 className="text-xl font-semibold">Novo artista</h3>
                </div>
              </div>

              <form className="mt-5 grid gap-3" onSubmit={handleArtistSubmit}>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput label="Nome artistico" name="artisticName" required />
                  <TextInput label="Responsavel / nome civil" name="legalName" />
                  <TextInput label="Cidade" name="city" />
                  <TextInput label="Estado" name="state" placeholder="SP, RJ, BA..." />
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Estilo musical
                  <select
                    className="rounded-md border border-[#d8cec0] bg-[#fbf8f2] px-3 py-3 outline-none ring-[#f2c14e] transition focus:ring-2"
                    name="genre"
                    defaultValue="Sertanejo"
                  >
                    {brazilianMusicGenres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </label>
                <TextInput label="Publico alvo" name="audience" />
                <TextInput label="Tom de voz" name="toneOfVoice" />
                <TextInput label="Objetivo principal" name="goals" />
                <TextInput label="Instagram" name="instagramUrl" placeholder="https://instagram.com/..." />
                <button
                  className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#191714] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSaving}
                  type="submit"
                >
                  <Save size={17} />
                  {isSaving ? "Salvando..." : "Salvar artista"}
                </button>
              </form>
            </article>

            <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-md bg-[#191714] text-white">
                  <Album size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#8d4f2a]">Cadastro</p>
                  <h3 className="text-xl font-semibold">Novo lancamento</h3>
                </div>
              </div>

              <form className="mt-5 grid gap-3" onSubmit={handleReleaseSubmit}>
                <TextInput label="Titulo da musica/projeto" name="title" required />
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Tipo
                    <select
                      className="rounded-md border border-[#d8cec0] bg-[#fbf8f2] px-3 py-3 outline-none ring-[#f2c14e] transition focus:ring-2"
                      name="releaseType"
                      defaultValue="single"
                    >
                      <option value="single">Single</option>
                      <option value="ep">EP</option>
                      <option value="album">Album</option>
                      <option value="remix">Remix</option>
                      <option value="live_session">Live session</option>
                    </select>
                  </label>
                  <TextInput label="Data alvo" name="targetDate" type="date" defaultValue={todayIso()} />
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <StatusSelect label="Audio" name="audioStatus" />
                  <StatusSelect label="Capa" name="coverStatus" />
                  <StatusSelect label="Ficha tecnica" name="technicalSheetStatus" />
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Observacoes
                  <textarea
                    className="min-h-24 rounded-md border border-[#d8cec0] bg-[#fbf8f2] px-3 py-3 outline-none ring-[#f2c14e] transition focus:ring-2"
                    name="notes"
                    placeholder="Ex: precisa de pre-save, roteiro de Reels, pitch de playlist..."
                  />
                </label>
                <button
                  className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#8d4f2a] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSaving || !selectedArtist}
                  type="submit"
                >
                  <Plus size={17} />
                  {isSaving ? "Salvando..." : "Criar lancamento"}
                </button>
              </form>
            </article>
          </section>

          <article className="rounded-lg border border-[#ccd6d8] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-[#0f7b4f]">
                  <Network size={17} />
                  Cofre de conexoes sociais
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Cada artista tera suas redes conectadas com seguranca.
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5e696b]">
                  O agente nao precisa saber a senha. Ele usa autorizacoes oficiais,
                  tokens criptografados e logs para agir na conta correta.
                </p>
              </div>
              <div className="rounded-md border border-[#d7e1e3] bg-[#edf7f1] px-3 py-2 text-sm font-medium text-[#0f7b4f]">
                Vault + OAuth
              </div>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <form className="grid gap-3 rounded-lg border border-[#dce5e7] bg-[#f7faf9] p-4" onSubmit={handleSocialAccountSubmit}>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Plataforma
                    <select
                      className="rounded-md border border-[#d8cec0] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                      name="platform"
                      defaultValue="instagram"
                    >
                      {socialPlatforms.map((platform) => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <TextInput label="Nome da conexao" name="accountLabel" placeholder="Instagram oficial" required />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput label="Usuario/perfil" name="username" placeholder="@artista" />
                  <TextInput label="Email de login" name="loginEmail" type="email" placeholder="email do responsavel" />
                </div>
                <label className="grid gap-2 text-sm font-medium">
                  Status
                  <select
                    className="rounded-md border border-[#d8cec0] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                    name="status"
                    defaultValue="not_connected"
                  >
                    <option value="not_connected">Aguardando OAuth</option>
                    <option value="connected">Conectado</option>
                    <option value="needs_reauth">Precisa reconectar</option>
                    <option value="disabled">Desativado</option>
                  </select>
                </label>
                <button
                  className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#10171a] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSaving || !selectedArtist}
                  type="submit"
                >
                  <ShieldCheck size={17} />
                  {isSaving ? "Salvando..." : "Salvar conexao"}
                </button>
              </form>

              <div className="grid gap-3">
                {selectedSocialAccounts.length > 0 ? (
                  selectedSocialAccounts.map((account) => (
                    <div className="rounded-lg border border-[#dce5e7] bg-[#f7faf9] p-4" key={account.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{account.accountLabel}</p>
                          <p className="mt-1 text-sm text-[#667174]">
                            {account.platform} {account.username ? `- ${account.username}` : ""}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#edf7f1] px-2.5 py-1 text-xs text-[#0f7b4f]">
                          {account.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#667174]">
                        Email registrado: {account.loginEmail || "nao informado"}. Tokens
                        ficam no Vault quando o OAuth for conectado.
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-[#b9c7ca] bg-[#f7faf9] p-5 text-sm leading-6 text-[#667174]">
                    Nenhuma rede conectada para {selectedArtist?.artisticName}. Cadastre a
                    primeira conexao acima para preparar a automacao.
                  </div>
                )}

                <div className="grid gap-3 md:grid-cols-2">
                  {socialVaultPreview.slice(0, 2).map((item) => (
                    <div className="rounded-lg border border-[#dce5e7] bg-white p-4" key={item.platform}>
                      <p className="font-semibold">{item.platform}</p>
                      <p className="mt-2 text-sm text-[#0f7b4f]">{item.status}</p>
                      <p className="mt-2 text-sm leading-6 text-[#667174]">{item.permission}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-[#ccd6d8] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-[#0f7b4f]">
                  <Palette size={17} />
                  Posts e artes
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  Planeje o post e mande o briefing para o designer.
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5e696b]">
                  Cada post precisa de copy, formato, briefing visual, status de design
                  e arte aprovada antes de entrar na fila de publicacao.
                </p>
              </div>
              <div className="rounded-md border border-[#d7e1e3] bg-[#edf7f1] px-3 py-2 text-sm font-medium text-[#0f7b4f]">
                Design + aprovacao
              </div>
            </div>

            <form
              className="mt-5 grid gap-3 rounded-lg border border-[#c9d8d2] bg-[#edf7f1] p-4 md:grid-cols-[1fr_130px_auto]"
              onSubmit={handleGeneratePostsSubmit}
            >
              <label className="grid gap-2 text-sm font-medium">
                Objetivo da campanha
                <input
                  className="rounded-md border border-[#b9c7ca] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                  name="campaignGoal"
                  placeholder="Ex: lancamento de single, pre-save, engajamento..."
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Posts
                <input
                  className="rounded-md border border-[#b9c7ca] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                  defaultValue={3}
                  max={6}
                  min={1}
                  name="quantity"
                  type="number"
                />
              </label>
              <button
                className="self-end rounded-md bg-[#0f7b4f] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving || !selectedArtist}
                type="submit"
              >
                {isSaving ? "Gerando..." : "Gerar posts"}
              </button>
            </form>

            <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <form className="grid gap-3 rounded-lg border border-[#dce5e7] bg-[#f7faf9] p-4" onSubmit={handlePlannedPostSubmit}>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Conta social
                    <select
                      className="rounded-md border border-[#d8cec0] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                      name="socialAccountId"
                      defaultValue=""
                    >
                      <option value="">Selecionar depois</option>
                      {selectedSocialAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountLabel} - {account.platform}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Canal
                    <select
                      className="rounded-md border border-[#d8cec0] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                      name="channel"
                      defaultValue="instagram"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <TextInput label="Titulo interno" name="title" placeholder="Reels de pre-save" required />
                  <TextInput label="Formato" name="format" placeholder="Reels, carrossel, story..." required />
                </div>
                <TextInput label="CTA" name="cta" placeholder="Clique no link da bio" />
                <TextInput label="Hashtags" name="hashtags" placeholder="#sertanejo, #lancamento, #presave" />
                <label className="grid gap-2 text-sm font-medium">
                  Legenda / copy
                  <textarea
                    className="min-h-24 rounded-md border border-[#d8cec0] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                    name="caption"
                    placeholder="Texto que vai acompanhar o post..."
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Briefing da arte para designer
                  <textarea
                    className="min-h-28 rounded-md border border-[#d8cec0] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                    name="designBrief"
                    placeholder="Ex: capa vertical 1080x1920, clima noturno, foto do artista, tipografia grande..."
                  />
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium">
                    Status da arte
                    <select
                      className="rounded-md border border-[#d8cec0] bg-white px-3 py-3 outline-none ring-[#72f2a6] transition focus:ring-2"
                      name="designStatus"
                      defaultValue="briefing_ready"
                    >
                      <option value="briefing_ready">Briefing pronto</option>
                      <option value="in_design">Em design</option>
                      <option value="received">Arte recebida</option>
                      <option value="approved">Arte aprovada</option>
                    </select>
                  </label>
                  <TextInput label="Link/caminho da arte" name="artworkUrl" placeholder="https://... ou storage/..." />
                </div>
                <TextInput label="Data/hora planejada" name="scheduledFor" type="datetime-local" />
                <button
                  className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[#10171a] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSaving || !selectedArtist}
                  type="submit"
                >
                  <Save size={17} />
                  {isSaving ? "Salvando..." : "Salvar post planejado"}
                </button>
              </form>

              <div className="grid gap-3">
                {selectedPlannedPosts.length > 0 ? (
                  selectedPlannedPosts.map((post) => (
                    <div className="rounded-lg border border-[#dce5e7] bg-[#f7faf9] p-4" key={post.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{post.title}</p>
                          <p className="mt-1 text-sm text-[#667174]">
                            {post.channel} - {post.format}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#edf7f1] px-2.5 py-1 text-xs text-[#0f7b4f]">
                          {post.designStatus}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#667174]">
                        {post.designBrief || "Sem briefing de arte informado."}
                      </p>
                      <div className="mt-3 grid gap-2 text-sm">
                        <InfoLine label="Status do post" value={post.status} />
                        <InfoLine label="Arte" value={post.artworkUrl || "Aguardando anexo/link da arte"} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-[#b9c7ca] bg-[#f7faf9] p-5 text-sm leading-6 text-[#667174]">
                    Nenhum post planejado para {selectedArtist?.artisticName}. Crie o primeiro
                    briefing para iniciar o fluxo com o designer.
                  </div>
                )}
              </div>
            </div>
          </article>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm font-medium text-[#8d4f2a]">Artistas</p>
                <h3 className="mt-1 text-xl font-semibold">Pipeline musical</h3>
              </div>
              <div className="mt-4 grid gap-3">
                {artists.map((artist) => (
                  <button
                    className={`rounded-lg border p-4 text-left transition ${
                      artist.id === selectedArtistId
                        ? "border-[#191714] bg-[#fffaf1]"
                        : "border-[#ece3d8] bg-[#fbf8f2] hover:border-[#bcae9d]"
                    }`}
                    key={artist.id}
                    onClick={() => setSelectedArtistId(artist.id)}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{artist.artisticName}</p>
                        <p className="mt-1 text-sm text-[#6f6255]">
                          {artist.genre} - {[artist.city, artist.state].filter(Boolean).join("/")}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#e4f4dc] px-2.5 py-1 text-xs text-[#2e6b2f]">
                        {artist.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-[#6f6255]">{artist.goals}</p>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
              <div>
                <p className="text-sm font-medium text-[#8d4f2a]">Lancamentos</p>
                <h3 className="mt-1 text-xl font-semibold">Projetos cadastrados</h3>
              </div>
              <div className="mt-4 grid gap-3">
                {releases.map((release) => {
                  const artist = artists.find((item) => item.id === release.artistId);
                  return (
                    <div className="rounded-lg border border-[#ece3d8] bg-[#fbf8f2] p-4" key={release.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{release.title}</p>
                          <p className="mt-1 text-sm text-[#6f6255]">
                            {artist?.artisticName} - {release.releaseType}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#eee3d3] px-2.5 py-1 text-xs text-[#6f4a2a]">
                          {release.status}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm">
                        <ReleaseStatusLine label="Audio" value={release.audioStatus} />
                        <ReleaseStatusLine label="Capa" value={release.coverStatus} />
                        <ReleaseStatusLine label="Ficha" value={release.technicalSheetStatus} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        </div>

        <aside className="grid gap-6">
          <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-md bg-[#191714] text-white">
                <FileAudio size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#8d4f2a]">Artista ativo</p>
                <h3 className="text-xl font-semibold">{selectedArtist?.artisticName}</h3>
              </div>
            </div>
            <div className="mt-4 grid gap-3 text-sm">
              <InfoLine label="Estilo" value={selectedArtist?.genre} />
              <InfoLine label="Cidade" value={[selectedArtist?.city, selectedArtist?.state].filter(Boolean).join("/")} />
              <InfoLine label="Publico" value={selectedArtist?.audience} />
              <InfoLine label="Tom" value={selectedArtist?.toneOfVoice} />
              <InfoLine label="Lancamento" value={selectedRelease?.title ?? "Nenhum lancamento vinculado"} />
            </div>
          </article>

          <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8d4f2a]">Calendario</p>
                <h3 className="mt-1 text-xl font-semibold">Proximas acoes</h3>
              </div>
              <CalendarDays size={22} />
            </div>
            <div className="mt-4 grid gap-3">
              {calendar.map((item) => (
                <div
                  className="grid grid-cols-[58px_1fr] gap-3 rounded-lg border border-[#ece3d8] bg-[#fbf8f2] p-3"
                  key={`${item.day}-${item.channel}`}
                >
                  <div className="rounded-md bg-white p-2 text-center text-sm font-semibold">
                    {item.day}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6f6255]">
                      <span>{item.channel}</span>
                      <span>{item.format}</span>
                      <span className="rounded-full bg-[#eee3d3] px-2 py-0.5">
                        {item.intent}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-[#ded6cb] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Library size={21} />
              <div>
                <p className="text-sm font-medium text-[#8d4f2a]">Base RAG</p>
                <h3 className="text-xl font-semibold">Memoria do agente</h3>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {knowledge.map((item) => (
                <div
                  className="flex items-center justify-between rounded-md border border-[#ece3d8] px-3 py-2 text-sm"
                  key={item}
                >
                  <span>{item}</span>
                  <CheckCircle2 size={16} className="text-[#3f8f42]" />
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-[#ded6cb] bg-[#191714] p-5 text-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#f2c14e]">WhatsApp</p>
                <h3 className="mt-1 text-xl font-semibold">Atendimento sugerido</h3>
              </div>
              <MessageCircle size={22} />
            </div>
            <div className="mt-4 rounded-lg bg-[#27221d] p-4 text-sm leading-6 text-[#efe7da]">
              Ola, tudo bem? Para avancarmos com o projeto de {selectedArtist?.artisticName},
              preciso confirmar audio WAV, capa final, ficha tecnica e data desejada. Assim que
              voce enviar, atualizo o status do lancamento.
            </div>
            <button
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#f2c14e] px-4 py-3 text-sm font-semibold text-[#191714]"
              type="button"
            >
              <Send size={17} />
              Preparar resposta
            </button>
          </article>
        </aside>
      </section>

      <section className="border-t border-[#ded6cb] bg-[#eee5d8]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 md:grid-cols-4 lg:px-8">
          {[
            ["Estrategia", Target, "Planeja campanhas conforme genero, regiao e publico."],
            ["Crescimento", TrendingUp, "Acompanha sinais de seguidores, cliques e conteudo."],
            ["Operacao", Activity, "Transforma cadastro em tarefas, status e proximas acoes."],
            ["Musica", Mic2, "Mantem linguagem e decisoes no universo artistico brasileiro."],
          ].map(([title, Icon, text]) => (
            <article className="rounded-lg bg-white p-4" key={String(title)}>
              <Icon className="text-[#8d4f2a]" size={21} />
              <h3 className="mt-3 font-semibold">{String(title)}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6f6255]">{String(text)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function TextInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <input
        className="rounded-md border border-[#d8cec0] bg-[#fbf8f2] px-3 py-3 outline-none ring-[#f2c14e] transition focus:ring-2"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function StatusSelect({ label, name }: { label: string; name: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select
        className="rounded-md border border-[#d8cec0] bg-[#fbf8f2] px-3 py-3 outline-none ring-[#f2c14e] transition focus:ring-2"
        name={name}
        defaultValue="pending"
      >
        <option value="pending">Pendente</option>
        <option value="received">Recebido</option>
        <option value="approved">Aprovado</option>
      </select>
    </label>
  );
}

function InfoLine({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border border-[#ece3d8] bg-[#fbf8f2] px-3 py-2">
      <p className="text-xs text-[#8d4f2a]">{label}</p>
      <p className="mt-1 font-medium text-[#4a4036]">{value || "Nao informado"}</p>
    </div>
  );
}

function ReleaseStatusLine({ label, value }: { label: string; value: string }) {
  const done = value === "approved";
  return (
    <div className="flex items-center justify-between rounded-md bg-white px-3 py-2">
      <span>{label}</span>
      <span className={`flex items-center gap-1 ${done ? "text-[#3f8f42]" : "text-[#b56a2c]"}`}>
        {done ? <CheckCircle2 size={15} /> : <Clock3 size={15} />}
        {value}
      </span>
    </div>
  );
}
