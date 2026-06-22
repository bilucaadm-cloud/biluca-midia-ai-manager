"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Sparkles, UserPlus, Users2 } from "lucide-react";
import {
  getDefaultSessionProfile,
  readSessionProfile,
  saveSessionProfile,
  type SessionProfile,
} from "@/lib/session-profile";

const initialMembers = [
  {
    name: "Biluca Administrador",
    email: "biluca.adm@gmail.com",
    role: "owner",
    focus: "Aprova campanha, define direcao e libera publicacao",
  },
  {
    name: "Designer",
    email: "designer@biluca.local",
    role: "designer",
    focus: "Sobe arte, mockup, capa e material visual",
  },
  {
    name: "Social Media",
    email: "social@biluca.local",
    role: "social",
    focus: "Organiza calendario, copy e operacao do agente",
  },
];

export default function EquipePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("designer");
  const [activeProfile, setActiveProfile] = useState<SessionProfile>(
    getDefaultSessionProfile(),
  );
  const [statusMessage, setStatusMessage] = useState(
    "Esta tela organiza papeis. O proximo passo e ligar isso no Auth e nas permissoes reais.",
  );

  useEffect(() => {
    queueMicrotask(() => {
      setActiveProfile(readSessionProfile());
    });
  }, []);

  function criar() {
    if (!email.trim()) {
      setStatusMessage("Informe um email para preparar o convite.");
      return;
    }

    setStatusMessage(
      `Convite preparado para ${email.trim()} como ${role}. Depois a gente conecta isso no fluxo real de acesso.`,
    );
    setEmail("");
    setRole("designer");
  }

  function assumirPerfil(nextRole: SessionProfile["role"]) {
    const nextProfile = {
      email:
        nextRole === "owner"
          ? "biluca.adm@gmail.com"
          : `${nextRole}@biluca.local`,
      name:
        nextRole === "owner"
          ? "Biluca Administrador"
          : nextRole === "admin"
            ? "Administrador"
            : nextRole === "designer"
              ? "Designer"
              : "Social Media",
      role: nextRole,
    } satisfies SessionProfile;

    saveSessionProfile(nextProfile);
    setActiveProfile(nextProfile);
    setStatusMessage(`Perfil ativo trocado para ${nextRole}.`);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="space-y-6">
        <article className="rounded-[28px] border border-[#243034] bg-[#10171a] p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-2 text-sm font-medium text-[#72f2a6]">
            <Users2 size={17} />
            Equipe e permissoes
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
            Cada pessoa com sua funcao certa dentro da operacao criativa.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[#b8c4c0]">
            O objetivo aqui e deixar nitido quem cria, quem aprova e quem opera o
            agente para publicacao.
          </p>
          <div className="mt-5 inline-flex rounded-full border border-[#28463b] bg-[#12231d] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#72f2a6]">
            Perfil ativo: {activeProfile.role}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#243034] bg-[#11181b] p-6 shadow-xl shadow-black/15">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <label className="grid gap-2 text-sm font-semibold text-[#dce6e2]">
              Email da pessoa
              <input
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nome@empresa.com"
                value={email}
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-[#dce6e2]">
              Papel
              <select onChange={(event) => setRole(event.target.value)} value={role}>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="designer">Designer</option>
                <option value="social">Social media</option>
              </select>
            </label>

            <button
              className="inline-flex items-center justify-center gap-2 self-end rounded-2xl bg-[#72f2a6] px-4 py-3 text-sm font-semibold text-[#0b0f12]"
              onClick={criar}
              type="button"
            >
              <UserPlus size={17} />
              Preparar convite
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-[#243034] bg-[#0d1316] p-4 text-sm leading-7 text-[#b8c4c0]">
            {statusMessage}
          </div>
        </article>

        <section className="grid gap-4">
          <article className="rounded-[28px] border border-[#243034] bg-[#11181b] p-5 shadow-lg shadow-black/10">
            <h2 className="text-xl font-semibold text-white">Trocar perfil da sessao</h2>
            <p className="mt-2 text-sm leading-7 text-[#b8c4c0]">
              Isso ajuda a testar o fluxo certo: quem cria demanda nao precisa ser quem aprova.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {(["owner", "admin", "designer", "social"] as const).map((item) => (
                <button
                  className={`rounded-2xl px-4 py-2.5 text-sm font-semibold ${
                    activeProfile.role === item
                      ? "bg-[#72f2a6] text-[#0b0f12]"
                      : "border border-[#243034] bg-[#0d1316] text-[#d7e0dc]"
                  }`}
                  key={item}
                  onClick={() => assumirPerfil(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </article>

          {initialMembers.map((member) => (
            <article
              className="rounded-[28px] border border-[#243034] bg-[#11181b] p-5 shadow-lg shadow-black/10"
              key={member.email}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">{member.name}</h2>
                  <p className="mt-2 text-sm text-[#9db0ab]">{member.email}</p>
                </div>
                <span className="rounded-full border border-[#28463b] bg-[#12231d] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#72f2a6]">
                  {member.role}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#c5d1ce]">{member.focus}</p>
            </article>
          ))}
        </section>
      </section>

      <aside className="grid content-start gap-6">
        <article className="rounded-[28px] border border-[#243034] bg-[#11181b] p-6 shadow-xl shadow-black/15">
          <div className="flex items-center gap-2 text-sm font-medium text-[#72f2a6]">
            <ShieldCheck size={16} />
            Estrutura ideal
          </div>
          <div className="mt-4 grid gap-3">
            {[
              "Owner ou admin aprova o que pode publicar.",
              "Designer cria e sobe material visual.",
              "Social media cuida da copy, fila e calendario.",
            ].map((item) => (
              <div className="rounded-2xl border border-[#243034] bg-[#0d1316] p-4 text-sm text-[#c5d1ce]" key={item}>
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#2f3024] bg-[#17140f] p-6 shadow-xl shadow-black/15">
          <div className="flex items-center gap-2 text-sm font-medium text-[#f2c14e]">
            <Sparkles size={16} />
            Proximo nivel
          </div>
          <p className="mt-4 text-sm leading-7 text-[#dfd4c2]">
            Depois daqui, a gente pode ligar perfis reais por usuario no Supabase Auth e
            esconder ou liberar telas conforme o papel.
          </p>
        </article>
      </aside>
    </div>
  );
}
