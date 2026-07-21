import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Radio,
  ChevronDown,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { proximoCulto } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/culto")({
  head: () => ({
    meta: [
      { title: "Modo Culto Ao Vivo — Portal Adoração" },
      { name: "description", content: "Modo Culto sincronizado: toda a equipe na mesma música, cifra, tom e BPM em tempo real." },
    ],
  }),
  component: ModoCultoPage,
});

const cifraSample = `[Intro] G  D/F#  Em  C

[Verso 1]
     G                D/F#
Eu te amo, Deus
   Em                  C
Tua bondade é melhor que a vida
     G                D/F#
Eu te amo, Deus
       Em            C
Abre os meus olhos para ver

[Refrão]
    G           D
Bondade de Deus
   Em                C
Eu canto a Sua bondade
    G          D
Do meu despertar
    Em              C
Ao meu descansar
       G
Eu canto a Sua bondade

[Ponte]
Com toda a minha vida entregue em Tuas mãos
Eu canto a Sua bondade, Deus`;

function ModoCultoPage() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [beat, setBeat] = useState(0);

  const musica = proximoCulto.playlist[idx];

  // Metrônomo visual
  useEffect(() => {
    if (!playing) return;
    const ms = 60000 / musica.bpm;
    const t = setInterval(() => setBeat((b) => (b + 1) % 4), ms);
    return () => clearInterval(t);
  }, [playing, musica.bpm]);

  return (
    <AppShell>
      <div className="bg-primary text-primary-foreground">
        {/* Header live */}
        <header className="flex items-center justify-between px-5 pt-8 pb-4">
          <button className="grid size-9 place-items-center rounded-full bg-primary-foreground/10">
            <ChevronDown className="size-4" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
              Modo Culto Ao Vivo
            </span>
          </div>
          <button className="grid size-9 place-items-center rounded-full bg-primary-foreground/10">
            <Users className="size-4" />
          </button>
        </header>

        {/* Now playing */}
        <div className="px-5 pt-2 pb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/50">
            Música {idx + 1} de {proximoCulto.playlist.length}
          </p>
          <h1 className="mt-2 font-serif text-3xl italic leading-tight">
            {musica.nome}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/60">{musica.autor}</p>

          <div className="mt-5 flex items-center justify-center gap-4">
            <Badge label="Tom" value={musica.tom} />
            <Badge label="BPM" value={String(musica.bpm)} />
            <Badge label="Cantor" value={musica.cantor.split(" ")[0]} />
          </div>

          {/* Metrônomo */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((b) => (
              <span
                key={b}
                className={`size-2 rounded-full transition-all duration-100 ${
                  beat === b && playing ? "bg-accent scale-150" : "bg-primary-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center gap-8 pb-6">
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            className="text-primary-foreground/80"
          >
            <SkipBack className="size-6" fill="currentColor" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="grid size-16 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow"
          >
            {playing ? (
              <Pause className="size-7" fill="currentColor" />
            ) : (
              <Play className="size-7 ml-0.5" fill="currentColor" />
            )}
          </button>
          <button
            onClick={() =>
              setIdx((i) => Math.min(proximoCulto.playlist.length - 1, i + 1))
            }
            className="text-primary-foreground/80"
          >
            <SkipForward className="size-6" fill="currentColor" />
          </button>
        </div>

        {/* Sync status */}
        <div className="mx-5 mb-5 flex items-center gap-3 rounded-2xl bg-primary-foreground/5 p-3 text-xs">
          <Radio className="size-4 text-accent" />
          <p className="min-w-0 flex-1">
            <span className="font-semibold">7 músicos sincronizados</span>
            <span className="block text-primary-foreground/50">
              Todos vendo cifra em {musica.tom} • {musica.bpm} BPM
            </span>
          </p>
          <Volume2 className="size-4 text-primary-foreground/60" />
        </div>
      </div>

      {/* Cifra */}
      <section className="rounded-t-3xl bg-background px-5 pt-6 pb-8 -mt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg italic">Cifra & Letra</h2>
          <div className="flex gap-1">
            <button className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold">
              −
            </button>
            <button className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-mono font-semibold text-accent">
              {musica.tom}
            </button>
            <button className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold">
              +
            </button>
          </div>
        </div>

        <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-foreground">
          {cifraSample}
        </pre>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Próxima
          </p>
          {proximoCulto.playlist[idx + 1] ? (
            <p className="mt-1 font-serif text-lg italic">
              {proximoCulto.playlist[idx + 1].nome}
              <span className="ml-2 font-mono text-sm text-accent">
                {proximoCulto.playlist[idx + 1].tom}
              </span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Última música do culto</p>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-primary-foreground/5 px-3 py-2 text-center min-w-[64px]">
      <p className="text-[9px] uppercase tracking-widest text-primary-foreground/50">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm font-bold text-accent">{value}</p>
    </div>
  );
}
