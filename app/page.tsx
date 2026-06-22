import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Radio,
  Sparkles,
  Users2,
  Wand2,
} from "lucide-react";

const quickStats = [
  { label: "Fluxos ativos", value: "03", detail: "Demandas, aprovacoes e equipe" },
  { label: "Estilos cobertos", value: "51", detail: "Base musical brasileira" },
  { label: "Modo do agente", value: "RAG", detail: "Contexto + operacao criativa" },
];

const hubs = [
  {
    href: "/demandas",
    title: "Central de Demandas",
    description: "Receba briefing, anexo, plataforma, tipo de arte e contexto da campanha.",
    Icon: ClipboardList,
    accent: "from-[#72f2a6]/20 to-transparent",
  },
  {
    href: "/aprovacoes",
    title: "Fila de Aprovacoes",
    description: "Veja o que esta pendente, aprove conteudos e libere o agente para publicar.",
    Icon: CheckCircle2,
    accent: "from-[#f2c14e]/20 to-transparent",
  },
  {
    href: "/equipe",
    title: "Equipe e Papeis",
    description: "Organize administrador, designer e social media com clareza operacional.",
    Icon: Users2,
    accent: "from-[#7fd1ff]/20 to-transparent",
  },
];

export default function Home() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="overflow-hidden rounded-[28px] border border-[#243034] bg-[#10171a] p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="flex items-center gap-2 text-sm font-medium text-[#f2c14e]">
            <Radio size={16} />
            Central musical brasileira
          </div>
          <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            O agente volta a ter cara de produto, fluxo e comando visual de verdade.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#b8c4c0]">
            Agora a base principal fica organizada em tres frentes: criar demanda,
            aprovar o que o designer subiu e controlar quem faz o que dentro da
            operacao.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {quickStats.map((item) => (
              <div
                className="rounded-3xl border border-[#243034] bg-[#121b1f] p-4"
                key={item.label}
              >
                <p className="text-sm text-[#8fa39d]">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-[#b8c4c0]">{item.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#243034] bg-[#11181b] p-6 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#72f2a6]">Studio signal</p>
            <span className="flex items-center gap-1 text-sm text-[#72f2a6]">
              <CheckCircle2 size={15} />
              online
            </span>
          </div>
          <div className="mt-5 flex h-24 items-end gap-2 rounded-3xl bg-[#0b0f12] px-4 py-4">
            {[26, 54, 34, 62, 44, 74, 38, 58, 32, 68].map((height, index) => (
              <span
                className="w-full rounded-t-full bg-[#72f2a6]"
                key={`${height}-${index}`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-[#243034] bg-[#0d1316] p-4">
            <p className="text-sm text-[#dce6e2]">
              Base pronta para arte, campanha, aprovacao e contexto de publicacao.
            </p>
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {hubs.map(({ href, title, description, Icon, accent }) => (
          <Link
            className={`group overflow-hidden rounded-[28px] border border-[#243034] bg-[linear-gradient(180deg,rgba(17,24,27,0.96),rgba(10,14,16,0.98))] p-6 shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:border-[#72f2a6]/40 ${accent}`}
            href={href}
            key={href}
          >
            <div className="flex items-center justify-between">
              <div className="grid size-12 place-items-center rounded-2xl bg-[#72f2a6] text-[#0b0f12]">
                <Icon size={22} />
              </div>
              <ArrowRight
                className="text-[#6e827c] transition group-hover:translate-x-1 group-hover:text-[#72f2a6]"
                size={18}
              />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#b8c4c0]">{description}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <article className="rounded-[28px] border border-[#243034] bg-[#11181b] p-6 shadow-xl shadow-black/15">
          <div className="flex items-center gap-2 text-sm font-medium text-[#72f2a6]">
            <Wand2 size={16} />
            Fluxo sugerido
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ["1. Criar demanda", "Designer ou atendimento sobe briefing, anexo e observacoes."],
              ["2. Revisar e aprovar", "Administrador valida a arte e libera para publicacao."],
              ["3. Agente publica", "Depois da aprovacao, o agente sabe o que postar e em qual canal."],
            ].map(([title, description]) => (
              <div
                className="rounded-3xl border border-[#243034] bg-[#0d1316] p-5"
                key={title}
              >
                <h4 className="text-lg font-semibold text-white">{title}</h4>
                <p className="mt-3 text-sm leading-6 text-[#b8c4c0]">{description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-[#2f3024] bg-[#17140f] p-6 shadow-xl shadow-black/15">
          <div className="flex items-center gap-2 text-sm font-medium text-[#f2c14e]">
            <Sparkles size={16} />
            Proximo passo
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            Deixar o upload ir para o Storage real do Supabase.
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#dfd4c2]">
            O visual e o fluxo ja estao voltando ao lugar certo. Depois disso, a
            gente liga o envio de arte no bucket oficial e amarra a aprovacao com a
            publicacao automatica.
          </p>
        </article>
      </section>
    </div>
  );
}
