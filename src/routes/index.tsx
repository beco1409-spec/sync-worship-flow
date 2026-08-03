import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, FileText, MessageCircle, ChevronRight, Clock, MapPin, LogIn } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import {
  proximoCulto,
  avisos,
  agendaSemana,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ministério de louvor" },
      { name: "description", content: "Gerencie escalas, repertório e o Modo Culto ao vivo do seu ministério de louvor." },
      { property: "og:title", content: "Ministério de louvor" },
      { property: "og:description", content: "Gerencie escalas, repertório e o Modo Culto ao vivo do seu ministério de louvor." },
    ],
  }),
  component: Dashboard,
});

function Countdown() {
  return (
    <div className="flex gap-5">
      {[
        { v: "02", l: "Dias" },
        { v: "14", l: "Horas" },
        { v: "38", l: "Min" },
      ].map((c) => (
        <div key={c.l} className="text-center">
          <p className="font-serif text-3xl font-bold text-primary-foreground">{c.v}</p>
          <p className="text-[10px] uppercase tracking-widest text-primary-foreground/50">
            {c.l}
          </p>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const confirmados = proximoCulto.integrantes.filter((i) => i.status === "confirmado");
  const pendentes = proximoCulto.integrantes.filter((i) => i.status === "pendente");

  const iniciais = ((user?.user_metadata?.full_name as string) || user?.email || "GA")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s: string) => s[0]?.toUpperCase())
    .join("");

  return (
    <AppShell>
      <AppHeader
        eyebrow={user ? "Shalom" : "Bem-vindo"}
        title="Adoração & Vida"
        right={
          user ? (
            <Link
              to="/perfil"
              className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground font-semibold ring-2 ring-accent/20"
            >
              {iniciais}
            </Link>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
            >
              <LogIn className="size-3.5" /> Entrar
            </Link>
          )
        }
      />

      <main className="grid grid-cols-2 gap-3 px-4">
        {/* Hero: próximo culto */}
        <section className="col-span-2 relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-elegant">
          <div className="relative z-10">
            <span className="inline-block rounded-md bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
              Próximo Culto
            </span>
            <h2 className="mt-4 font-serif text-2xl leading-tight">{proximoCulto.nome}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-primary-foreground/60">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" /> {proximoCulto.data} • {proximoCulto.hora}
              </span>
            </div>
            <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary-foreground/50">
              <MapPin className="size-3" /> {proximoCulto.local}
            </p>

            <div className="mt-5">
              <Countdown />
            </div>
          </div>
          <div className="absolute -right-16 -bottom-16 size-56 rounded-full bg-accent/25 blur-3xl" />
        </section>

        {/* Escala resumo */}
        <Link
          to="/escala"
          className="col-span-1 flex flex-col justify-between rounded-3xl border border-border bg-surface p-4"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Escala
          </h3>
          <div className="my-3 flex -space-x-2">
            {proximoCulto.integrantes.slice(0, 4).map((i) => (
              <div
                key={i.id}
                className="grid size-8 place-items-center rounded-full border-2 border-surface bg-secondary text-[10px] font-semibold text-secondary-foreground"
              >
                {i.iniciais}
              </div>
            ))}
            <div className="grid size-8 place-items-center rounded-full border-2 border-surface bg-primary/10 text-[10px] font-bold text-primary">
              +{proximoCulto.integrantes.length - 4}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-emerald-600">{confirmados.length} confirmados</span>
            <br />
            {pendentes.length} pendentes
          </p>
        </Link>

        {/* Playlist preview */}
        <Link
          to="/repertorio"
          className="col-span-1 flex flex-col rounded-3xl border border-border bg-surface p-4"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Músicas
          </h3>
          <ul className="mt-3 space-y-1.5">
            {proximoCulto.playlist.slice(0, 3).map((m, idx) => (
              <li key={m.id} className="truncate text-[11px] font-medium text-foreground">
                {idx + 1}. {m.nome}{" "}
                <span className="text-muted-foreground">({m.tom})</span>
              </li>
            ))}
            <li className="truncate text-[11px] text-muted-foreground">
              + {proximoCulto.playlist.length - 3} outras
            </li>
          </ul>
        </Link>

        {/* Modo Culto Live */}
        <Link
          to="/culto"
          className="col-span-2 rounded-3xl border border-accent/25 bg-accent/10 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-tight text-accent">
                Modo Culto Live
              </h3>
            </div>
            <span className="rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent">
              {proximoCulto.playlist[0].bpm} BPM
            </span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase text-muted-foreground">
                Em execução
              </p>
              <p className="truncate font-serif text-xl italic text-foreground">
                {proximoCulto.playlist[0].nome}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Tom {proximoCulto.playlist[0].tom} • {proximoCulto.playlist[0].cantor}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-accent px-4 py-2 text-xs font-bold text-accent-foreground">
              ENTRAR
            </span>
          </div>
        </Link>

        {/* Atalhos */}
        <button className="col-span-1 flex items-center gap-3 rounded-3xl border border-border bg-surface p-4 text-left">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/5 text-primary">
            <FileText className="size-4" />
          </span>
          <span className="text-xs font-semibold">Cifras</span>
        </button>
        <button className="col-span-1 flex items-center gap-3 rounded-3xl border border-border bg-surface p-4 text-left">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/5 text-primary">
            <MessageCircle className="size-4" />
          </span>
          <span className="text-xs font-semibold">Avisos</span>
        </button>

        {/* Avisos */}
        <section className="col-span-2 rounded-3xl border border-border bg-surface p-5">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Avisos da Equipe
          </h3>
          <div className="space-y-4">
            {avisos.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/5 text-[10px] font-bold text-primary">
                  {a.autor
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-xs">
                    <span className="font-semibold text-foreground">{a.autor}</span>{" "}
                    <span className="text-muted-foreground">• {a.quando}</span>
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-foreground/80">
                    {a.mensagem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Agenda da semana */}
        <section className="col-span-2 rounded-3xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Agenda da Semana
            </h3>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-muted-foreground">
              Ver tudo <ChevronRight className="size-3" />
            </span>
          </div>
          <div className="space-y-4">
            {agendaSemana.map((e) => (
              <div key={e.id} className="flex items-center gap-4">
                <div
                  className={`w-11 shrink-0 rounded-xl px-2 py-1.5 text-center ${
                    e.destaque
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary/5 text-foreground"
                  }`}
                >
                  <p className="font-serif text-base font-bold leading-none">{e.dia}</p>
                  <p className="mt-0.5 text-[9px] uppercase tracking-wider opacity-80">
                    {e.diaSemana}
                  </p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{e.titulo}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {e.hora} • {e.local}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ação principal desktop-friendly (redundante ao FAB) */}
        <Link
          to="/culto"
          className="col-span-2 mt-2 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 py-4 text-sm font-bold uppercase tracking-wider text-accent"
        >
          <Play className="size-4" fill="currentColor" /> Iniciar Modo Culto
        </Link>
      </main>
    </AppShell>
  );
}
