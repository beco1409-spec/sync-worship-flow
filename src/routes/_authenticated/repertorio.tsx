import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Music2, Clock, GripVertical } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { proximoCulto, bibliotecaMusicas } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/repertorio")({
  head: () => ({
    meta: [
      { title: "Repertório — Portal Adoração" },
      { name: "description", content: "Playlist do culto e biblioteca de músicas com tom, BPM e cifras." },
    ],
  }),
  component: RepertorioPage,
});

function RepertorioPage() {
  const [tab, setTab] = useState<"culto" | "biblioteca">("culto");
  const [q, setQ] = useState("");

  const lista =
    tab === "culto"
      ? proximoCulto.playlist
      : bibliotecaMusicas.filter((m) =>
          `${m.nome} ${m.autor}`.toLowerCase().includes(q.toLowerCase()),
        );

  return (
    <AppShell>
      <AppHeader
        eyebrow="Repertório"
        title="Playlist do Culto"
        subtitle={proximoCulto.nome}
      />

      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 rounded-xl bg-secondary p-1">
          {(["culto", "biblioteca"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg py-2 text-xs font-semibold capitalize transition ${
                tab === t
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {t === "culto" ? "Este Culto" : "Biblioteca"}
            </button>
          ))}
        </div>
      </div>

      {tab === "biblioteca" && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome ou autor…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      <main className="space-y-3 px-4">
        {tab === "culto" && (
          <div className="rounded-3xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Duração estimada
                </p>
                <p className="font-serif text-xl">
                  {proximoCulto.playlist.length} músicas • 25 min
                </p>
              </div>
              <button className="rounded-full bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Iniciar
              </button>
            </div>
          </div>
        )}

        <ul className="space-y-2">
          {lista.map((m, idx) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
            >
              {tab === "culto" ? (
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/5 font-serif text-sm font-bold text-primary">
                  {idx + 1}
                </div>
              ) : (
                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                  <Music2 className="size-4" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{m.nome}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {m.autor} • {m.cantor}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-xs font-bold text-accent">{m.tom}</p>
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="size-2.5" />
                  {m.bpm} BPM
                </p>
              </div>
              {tab === "culto" && (
                <GripVertical className="size-4 shrink-0 text-muted-foreground" />
              )}
            </li>
          ))}
        </ul>

        {tab === "culto" && (
          <button className="w-full rounded-2xl border-2 border-dashed border-border py-4 text-sm font-semibold text-muted-foreground">
            + Adicionar música
          </button>
        )}
      </main>
    </AppShell>
  );
}
