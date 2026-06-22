"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  ImagePlus,
  LockKeyhole,
  LoaderCircle,
  Music2,
  UploadCloud,
} from "lucide-react";
import {
  getDefaultSessionProfile,
  readSessionProfile,
  type SessionProfile,
} from "@/lib/session-profile";

type DesignRequest = {
  id: string;
  title: string;
  artist_name?: string;
  description?: string;
  content_type?: string;
  platform?: string;
  status: string;
  asset_url?: string;
  asset_path?: string;
  file_name?: string;
  created_at?: string;
  requested_by_name?: string;
  requested_by_email?: string;
  requested_by_role?: string;
};

const LOCAL_STORAGE_KEY = "biluca-design-requests";

function readLocalRequests(): DesignRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DesignRequest[]) : [];
  } catch {
    return [];
  }
}

function saveLocalRequests(requests: DesignRequest[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(requests));
}

export default function DemandasPage() {
  const [demandas, setDemandas] = useState<DesignRequest[]>([]);
  const [artist, setArtist] = useState("");
  const [type, setType] = useState("Post estatico");
  const [platform, setPlatform] = useState("Instagram");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Pronto para receber novas demandas.");
  const [isSaving, setIsSaving] = useState(false);
  const [sessionProfile, setSessionProfile] = useState<SessionProfile>(
    getDefaultSessionProfile(),
  );

  async function loadData() {
    try {
      const response = await fetch("/api/design-requests", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || payload.configured === false) {
        const localRequests = readLocalRequests();
        setDemandas(localRequests);
        setStatusMessage(
          payload.error ??
            "Modo local ativo: as demandas ficam salvas neste navegador ate conectarmos o banco.",
        );
        return;
      }

      const items = Array.isArray(payload.items) ? payload.items : [];
      setDemandas(items);
      setStatusMessage("Demandas carregadas com sucesso.");
    } catch {
      const localRequests = readLocalRequests();
      setDemandas(localRequests);
      setStatusMessage(
        "Sem resposta do servidor. Continuando em modo local com demandas desta maquina.",
      );
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      setSessionProfile(readSessionProfile());
      void loadData();
    });
  }, []);

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);

    if (!nextFile) {
      setPreview(null);
      return;
    }

    setPreview(URL.createObjectURL(nextFile));
  }

  async function criarDemanda() {
    if (!["designer", "social", "admin", "owner"].includes(sessionProfile.role)) {
      setStatusMessage("Seu perfil atual nao pode criar demandas.");
      return;
    }

    if (!artist.trim() || !description.trim()) {
      setStatusMessage("Preencha nome do artista e descricao da demanda.");
      return;
    }

    setIsSaving(true);

    let assetUrl: string | null = null;
    let assetPath: string | null = null;
    const fileName: string | null = file?.name ?? null;

    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadPayload = await uploadResponse.json();
        assetUrl = uploadPayload.url ?? null;
        assetPath = uploadPayload.path ?? null;
        if (uploadPayload.path) {
          assetPath = uploadPayload.path ?? null;
        }
      }

      const payload = {
        title: `${type} - ${artist.trim()}`,
        artist_name: artist.trim(),
        description: description.trim(),
        asset_url: assetUrl,
        asset_path: assetPath,
        content_type: type,
        platform,
        file_name: fileName,
        requested_by_name: sessionProfile.name,
        requested_by_email: sessionProfile.email,
        requested_by_role: sessionProfile.role,
      };

      const response = await fetch("/api/design-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const responsePayload = await response.json();

      if (!response.ok || responsePayload.configured === false) {
        const localRequest: DesignRequest = {
          id: `local-${Date.now()}`,
          status: "pending",
          created_at: new Date().toISOString(),
          ...payload,
          asset_url: assetUrl ?? undefined,
          asset_path: assetPath ?? undefined,
          file_name: fileName ?? undefined,
        };
        const nextItems = [localRequest, ...readLocalRequests()];
        saveLocalRequests(nextItems);
        setDemandas(nextItems);
        setStatusMessage(
          responsePayload.error ??
            "Demanda criada em modo local. Assim que o banco estiver pronto, a gente liga isso no Supabase.",
        );
      } else {
        setDemandas((current) => [responsePayload.item as DesignRequest, ...current]);
        setStatusMessage("Demanda criada com sucesso.");
      }

      setArtist("");
      setDescription("");
      setType("Post estatico");
      setPlatform("Instagram");
      setPreview(null);
      setFile(null);
    } catch {
      setStatusMessage("Nao foi possivel criar a demanda agora.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        <article className="rounded-[28px] border border-[#243034] bg-[#10171a] p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-sm font-medium text-[#72f2a6]">
            <ClipboardList size={17} />
            Central de Demandas
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
            Briefing criativo com contexto suficiente para o agente entender o que vai ao ar.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#b8c4c0]">
            Aqui o designer ou atendimento sobe a solicitacao, anexa a arte e descreve o
            objetivo da peca. Depois a aprovacao destrava a publicacao.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#28463b] bg-[#12231d] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#72f2a6]">
            <LockKeyhole size={14} />
            Perfil ativo: {sessionProfile.role}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#243034] bg-[#11181b] p-6 shadow-xl shadow-black/15">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome do artista">
              <input
                onChange={(event) => setArtist(event.target.value)}
                placeholder="Ex: Lia Vento"
                value={artist}
              />
            </Field>
            <Field label="Plataforma">
              <select onChange={(event) => setPlatform(event.target.value)} value={platform}>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>YouTube</option>
                <option>WhatsApp</option>
              </select>
            </Field>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Tipo de conteudo">
              <select onChange={(event) => setType(event.target.value)} value={type}>
                <option>Post estatico</option>
                <option>Carrossel</option>
                <option>Story</option>
                <option>Reels</option>
                <option>Capa de lancamento</option>
              </select>
            </Field>
            <Field label="Anexo da arte">
              <label className="flex h-12 items-center gap-3 rounded-2xl border border-dashed border-[#35505a] bg-[#0d1316] px-4 text-sm text-[#b8c4c0]">
                <UploadCloud size={16} className="text-[#72f2a6]" />
                <span className="truncate">{file?.name ?? "Selecionar arquivo ou imagem"}</span>
                <input className="hidden" onChange={handleFile} type="file" />
              </label>
            </Field>
          </div>

          <Field className="mt-4" label="Descricao da demanda">
            <textarea
              className="min-h-36"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Explique a ideia da arte, a campanha, o CTA e o que o agente precisa entender."
              value={description}
            />
          </Field>

          {preview ? (
            <div className="mt-4 overflow-hidden rounded-[24px] border border-[#243034] bg-[#0d1316] p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Preview do anexo"
                className="max-h-[320px] w-full rounded-2xl object-cover"
                src={preview}
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#8fa39d]">{statusMessage}</p>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#72f2a6] px-5 py-3 text-sm font-semibold text-[#0b0f12] transition hover:brightness-95 disabled:opacity-60"
              disabled={isSaving || !["designer", "social", "admin", "owner"].includes(sessionProfile.role)}
              onClick={criarDemanda}
              type="button"
            >
              {isSaving ? <LoaderCircle className="animate-spin" size={17} /> : <ImagePlus size={17} />}
              {isSaving ? "Criando..." : "Criar demanda"}
            </button>
          </div>
        </article>

        <section className="grid gap-4">
          {demandas.length === 0 ? (
            <article className="rounded-[28px] border border-dashed border-[#243034] bg-[#0d1316] p-6 text-sm leading-7 text-[#9db0ab]">
              Nenhuma demanda criada ainda. Assim que subir a primeira arte, ela aparece aqui
              com status e contexto.
            </article>
          ) : (
            demandas.map((item) => (
              <article
                className="rounded-[28px] border border-[#243034] bg-[#11181b] p-5 shadow-lg shadow-black/10"
                key={item.id}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-[#9db0ab]">
                      {item.platform ?? "Canal nao informado"} - {item.content_type ?? "Formato livre"}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#6f827d]">
                      Criado por {item.requested_by_name ?? "Equipe"} - {item.requested_by_role ?? "sem papel"}
                    </p>
                  </div>
                  <span className="rounded-full border border-[#28463b] bg-[#12231d] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#72f2a6]">
                    {item.status}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#c5d1ce]">{item.description}</p>

                {item.asset_url ? (
                  <div className="mt-4 overflow-hidden rounded-[22px] border border-[#243034] bg-[#0d1316] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={item.file_name ?? item.title}
                      className="max-h-[280px] w-full rounded-2xl object-cover"
                      src={item.asset_url}
                    />
                  </div>
                ) : null}
              </article>
            ))
          )}
        </section>
      </section>

      <aside className="grid content-start gap-6">
        <article className="rounded-[28px] border border-[#243034] bg-[#11181b] p-6 shadow-xl shadow-black/15">
          <div className="flex items-center gap-2 text-sm font-medium text-[#72f2a6]">
            <Music2 size={16} />
            Como usar
          </div>
          <div className="mt-4 grid gap-3">
            {[
              "Suba a arte ou o anexo do designer.",
              "Explique a campanha e o objetivo da peca.",
              "Depois a fila de aprovacoes decide o que libera para publicacao.",
            ].map((text) => (
              <div className="rounded-2xl border border-[#243034] bg-[#0d1316] p-4 text-sm text-[#c5d1ce]" key={text}>
                {text}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#2f3024] bg-[#17140f] p-6 shadow-xl shadow-black/15">
          <div className="flex items-center gap-2 text-sm font-medium text-[#f2c14e]">
            <CheckCircle2 size={16} />
            Fluxo correto
          </div>
          <p className="mt-4 text-sm leading-7 text-[#dfd4c2]">
            O ideal e separar quem cria da pessoa que aprova. A tela de aprovacoes ja fica
            pronta para esse proximo passo.
          </p>
        </article>
      </aside>
    </div>
  );
}

function Field({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-[#dce6e2] ${className ?? ""}`}>
      {label}
      {children}
    </label>
  );
}
