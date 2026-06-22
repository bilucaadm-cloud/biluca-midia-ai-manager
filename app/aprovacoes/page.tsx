"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, LoaderCircle, LockKeyhole, XCircle } from "lucide-react";
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
  requested_by_name?: string;
  requested_by_email?: string;
  requested_by_role?: string;
  approved_by_name?: string;
  approved_by_email?: string;
  approved_by_role?: string;
  approved_at?: string;
  status: string;
  asset_url?: string;
  file_name?: string;
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

export default function AprovacoesPage() {
  const [items, setItems] = useState<DesignRequest[]>([]);
  const [statusMessage, setStatusMessage] = useState("Carregando fila de aprovacao...");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [sessionProfile, setSessionProfile] = useState<SessionProfile>(
    getDefaultSessionProfile(),
  );

  async function load() {
    try {
      const response = await fetch("/api/design-requests", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok || payload.configured === false) {
        setItems(readLocalRequests());
        setStatusMessage(
          payload.error ?? "Modo local ativo: aprovacoes salvas neste navegador.",
        );
        return;
      }

      setItems(Array.isArray(payload.items) ? payload.items : []);
      setStatusMessage("Fila carregada.");
    } catch {
      setItems(readLocalRequests());
      setStatusMessage("Sem resposta da API. Mostrando aprovacoes locais.");
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      setSessionProfile(readSessionProfile());
      void load();
    });
  }, []);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    if (!["owner", "admin"].includes(sessionProfile.role)) {
      setStatusMessage("Somente owner ou admin podem aprovar ou pedir ajuste.");
      return;
    }

    setBusyId(id);

    try {
      const response = await fetch("/api/design-requests", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
          approved_by_name: sessionProfile.name,
          approved_by_email: sessionProfile.email,
          approved_by_role: sessionProfile.role,
        }),
      });
      const payload = await response.json();

      if (!response.ok || payload.configured === false) {
        const nextItems = readLocalRequests().map((item) =>
          item.id === id ? { ...item, status } : item,
        );
        saveLocalRequests(nextItems);
        setItems(nextItems);
      } else {
        setItems((current) =>
          current.map((item) => (item.id === id ? { ...item, status } : item)),
        );
      }

      setStatusMessage(
        status === "approved"
          ? "Conteudo aprovado e pronto para virar publicacao."
          : "Conteudo marcado para revisao."
      );
    } catch {
      setStatusMessage("Nao foi possivel atualizar esta aprovacao.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
      <section className="space-y-6">
        <article className="rounded-[28px] border border-[#243034] bg-[#10171a] p-6 shadow-xl shadow-black/20">
          <p className="text-sm font-medium text-[#72f2a6]">Fila de Aprovacoes</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
            Aprovacao separada da criacao, do jeito certo para a operacao amadurecer.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#b8c4c0]">{statusMessage}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#4c4328] bg-[#1c1911] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f2c14e]">
            <LockKeyhole size={14} />
            Perfil ativo: {sessionProfile.role}
          </div>
        </article>

        <div className="grid gap-4">
          {items.length === 0 ? (
            <article className="rounded-[28px] border border-dashed border-[#243034] bg-[#11181b] p-6 text-sm leading-7 text-[#9db0ab]">
              Nenhuma arte aguardando decisao ainda.
            </article>
          ) : (
            items.map((item) => (
              <article
                className="rounded-[28px] border border-[#243034] bg-[#11181b] p-5 shadow-lg shadow-black/10"
                key={item.id}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                    <p className="mt-2 text-sm text-[#9db0ab]">
                      {item.platform ?? "Plataforma livre"} - {item.content_type ?? "Tipo livre"}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#6f827d]">
                      Pedido por {item.requested_by_name ?? "Equipe"} - {item.requested_by_role ?? "sem papel"}
                    </p>
                  </div>
                  <StatusPill status={item.status} />
                </div>

                <p className="mt-4 text-sm leading-7 text-[#c5d1ce]">{item.description}</p>

                {item.asset_url ? (
                  <div className="mt-4 overflow-hidden rounded-[22px] border border-[#243034] bg-[#0d1316] p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={item.file_name ?? item.title}
                      className="max-h-[320px] w-full rounded-2xl object-cover"
                      src={item.asset_url}
                    />
                  </div>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#72f2a6] px-4 py-2.5 text-sm font-semibold text-[#0b0f12] disabled:opacity-60"
                    disabled={busyId === item.id || !["owner", "admin"].includes(sessionProfile.role)}
                    onClick={() => updateStatus(item.id, "approved")}
                    type="button"
                  >
                    {busyId === item.id ? <LoaderCircle className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                    Aprovar
                  </button>
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#563337] bg-[#231417] px-4 py-2.5 text-sm font-semibold text-[#ffb5ba] disabled:opacity-60"
                    disabled={busyId === item.id || !["owner", "admin"].includes(sessionProfile.role)}
                    onClick={() => updateStatus(item.id, "rejected")}
                    type="button"
                  >
                    <XCircle size={16} />
                    Pedir ajuste
                  </button>
                </div>
                {item.approved_by_name ? (
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#6f827d]">
                    Ultima decisao por {item.approved_by_name} - {item.approved_by_role ?? "sem papel"}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>

      <aside className="grid content-start gap-6">
        <article className="rounded-[28px] border border-[#243034] bg-[#11181b] p-6 shadow-xl shadow-black/15">
          <p className="text-sm font-medium text-[#72f2a6]">Leitura rapida</p>
          <div className="mt-4 grid gap-3">
            {[
              ["Pendentes", String(items.filter((item) => item.status === "pending").length)],
              ["Aprovadas", String(items.filter((item) => item.status === "approved").length)],
              ["Revisao", String(items.filter((item) => item.status === "rejected").length)],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-[#243034] bg-[#0d1316] p-4" key={label}>
                <p className="text-sm text-[#8fa39d]">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#2f3024] bg-[#17140f] p-6 shadow-xl shadow-black/15">
          <div className="flex items-center gap-2 text-sm font-medium text-[#f2c14e]">
            <Clock3 size={16} />
            Regra operacional
          </div>
          <p className="mt-4 text-sm leading-7 text-[#dfd4c2]">
            Idealmente a mesma pessoa que sobe a arte nao deve ser a pessoa final que aprova.
            Esse e o proximo refinamento que a gente pode ligar por perfil.
          </p>
        </article>
      </aside>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "approved"
      ? "border-[#28463b] bg-[#12231d] text-[#72f2a6]"
      : status === "rejected"
        ? "border-[#563337] bg-[#231417] text-[#ffb5ba]"
        : "border-[#4c4328] bg-[#1c1911] text-[#f2c14e]";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${styles}`}
    >
      {status}
    </span>
  );
}
