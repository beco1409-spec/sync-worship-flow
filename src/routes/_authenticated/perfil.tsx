import { createFileRoute } from "@tanstack/react-router";
import { Bell, Music2, Settings, LogOut, ChevronRight, Star } from "lucide-react";
import { AppShell, AppHeader } from "@/components/AppShell";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Portal Adoração" },
      { name: "description", content: "Seu perfil, tom preferido por música e configurações do ministério." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  return (
    <AppShell>
      <AppHeader eyebrow="Perfil" title="Gabriel Almeida" subtitle="Líder de Louvor • Cantor" />

      <main className="space-y-4 px-4">
        <section className="rounded-3xl border border-border bg-surface p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full bg-primary font-serif text-2xl italic text-primary-foreground">
              GA
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Classificação vocal
              </p>
              <p className="font-serif text-lg italic">Tenor</p>
              <p className="text-xs text-muted-foreground">Extensão C3 – A4</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[
              { l: "Cultos", v: "48" },
              { l: "Músicas", v: "32" },
              { l: "Presença", v: "96%" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-secondary/50 p-3">
                <p className="font-serif text-xl font-bold">{s.v}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.l}
                </p>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-5">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Meus tons preferidos
          </h3>
          <ul className="space-y-2">
            {[
              { m: "Bondade de Deus", t: "G", u: "há 2 sem" },
              { m: "Ousado Amor", t: "E", u: "há 3 sem" },
              { m: "Yeshua", t: "A", u: "há 1 sem" },
            ].map((i) => (
              <li key={i.m} className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3">
                <Music2 className="size-4 text-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{i.m}</p>
                  <p className="text-[10px] text-muted-foreground">Cantada {i.u}</p>
                </div>
                <span className="rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs font-bold text-accent">
                  {i.t}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-surface p-2">
          {[
            { icon: Bell, label: "Notificações", hint: "Ativadas" },
            { icon: Star, label: "Favoritos", hint: "12 músicas" },
            { icon: Settings, label: "Configurações", hint: "" },
            { icon: LogOut, label: "Sair", hint: "" },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.label}
                className="flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-secondary/50"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-primary/5 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 text-sm font-medium">{r.label}</span>
                {r.hint && (
                  <span className="text-xs text-muted-foreground">{r.hint}</span>
                )}
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            );
          })}
        </section>
      </main>
    </AppShell>
  );
}
