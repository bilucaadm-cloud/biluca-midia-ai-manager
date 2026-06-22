import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  Layers3,
  Music2,
  Users2,
} from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biluca Midia AI Manager",
  description: "Agente RAG para gestao musical, lancamentos e operacao criativa.",
};

const navItems = [
  { href: "/", label: "Central", Icon: Layers3 },
  { href: "/demandas", label: "Demandas", Icon: ClipboardList },
  { href: "/aprovacoes", label: "Aprovacoes", Icon: CheckCircle2 },
  { href: "/equipe", label: "Equipe", Icon: Users2 },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(114,242,166,0.10),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(242,193,78,0.12),_transparent_24%),#0b0f12] text-[#e7efed]">
          <div className="mx-auto flex min-h-screen max-w-[1600px]">
            <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 border-r border-[#1f2a2f] bg-[#0d1316]/95 px-6 py-7 lg:flex lg:flex-col">
              <div>
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-[#72f2a6] text-[#0b0f12] shadow-lg shadow-[#72f2a6]/15">
                    <Music2 size={26} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p className="text-sm text-[#8fa39d]">Biluca Midia</p>
                    <h1 className="text-2xl font-semibold tracking-tight text-white">
                      AI Manager
                    </h1>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl border border-[#1f2a2f] bg-[#11181b] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#72f2a6]">
                    Operacao musical
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#b8c4c0]">
                    Central para briefing, arte, aprovacao e publicacao de artistas e
                    campanhas.
                  </p>
                </div>

                <nav className="mt-8 grid gap-2">
                  {navItems.map(({ href, label, Icon }) => (
                    <Link
                      className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-[#d7e0dc] transition hover:border-[#243034] hover:bg-[#121b1f] hover:text-white"
                      href={href}
                      key={href}
                    >
                      <Icon size={18} className="text-[#72f2a6]" />
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="mt-auto rounded-2xl border border-[#243034] bg-[#11181b] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f2c14e]">
                  Cobertura
                </p>
                <p className="mt-3 text-sm leading-6 text-[#c7d2cf]">
                  Sertanejo, funk, trap, gospel, pagode, piseiro, pop brasileiro e
                  outras frentes da musica nacional.
                </p>
              </div>
            </aside>

            <div className="flex min-h-screen flex-1 flex-col">
              <header className="border-b border-[#1c2429] bg-[#0b0f12]/85 px-5 py-4 backdrop-blur lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-[#72f2a6] text-[#0b0f12]">
                    <Music2 size={22} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p className="text-xs text-[#8fa39d]">Biluca Midia</p>
                    <h1 className="text-lg font-semibold text-white">AI Manager</h1>
                  </div>
                </div>
                <nav className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {navItems.map(({ href, label, Icon }) => (
                    <Link
                      className="flex items-center gap-2 rounded-2xl border border-[#243034] bg-[#11181b] px-3 py-2.5 text-sm text-[#d7e0dc]"
                      href={href}
                      key={href}
                    >
                      <Icon size={16} className="text-[#72f2a6]" />
                      {label}
                    </Link>
                  ))}
                </nav>
              </header>

              <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
