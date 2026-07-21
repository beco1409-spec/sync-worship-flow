import { createFileRoute } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, User, ChevronRight } from "lucide-react";
import { useState } from "react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { cultosFuturos, statusColor, statusLabel, type Status } from "@/lib/mock-data";

export const Route = createFileRoute("/escala")({
  head: () => ({
    meta: [
      { title: "Escala — Portal Adoração" },
      { name: "description", content: "Escala dos cultos: integrantes confirmados, pendentes, funções e substituições." },
    ],
  }),
  component: EscalaPage,
});

function EscalaPage() {
  const [selectedId, setSelectedId] = useState(cultosFuturos[0].id);
  const culto = cultosFuturos.find((c) => c.id === selectedId) ?? cultosFuturos[0];

  const grupos: Record<string, typeof culto.integrantes> = {};
  for (const i of culto.integrantes) {
    (grupos[i.funcao] ??= []).push(i);
  }

  return (
    <AppShell>
      <AppHeader
        eyebrow="Escala"
        title="Cultos & Equipe"
        subtitle="Confirme presença ou solicite substituição"
      />

      {/* Selector de cultos */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {cultosFuturos.map((c) => {
            const active = c.id === selectedId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground"
                }`}
              >
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${active ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {c.data.split(",")[0]}
                </p>
                <p className="mt-0.5 font-serif text-sm">{c.nome}</p>
              </button>
            );
          })}
        </div>
      </div>

      <main className="space-y-4 px-4">
        {/* Info do culto */}
        <section className="rounded-3xl border border-border bg-surface p-5">
          <h2 className="font-serif text-xl">{culto.nome}</h2>
          {culto.tema && (
            <p className="mt-1 text-sm italic text-muted-foreground">"{culto.tema}"</p>
          )}
          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <Info icon={Calendar} label="Data" value={culto.data} />
            <Info icon={Clock} label="Horário" value={culto.hora} />
            <Info icon={MapPin} label="Local" value={culto.local} />
            <Info icon={User} label="Pregador" value={culto.pregador} />
          </dl>
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Responsável pela escala
            </p>
            <p className="mt-1 text-sm font-medium">{culto.responsavel}</p>
          </div>
        </section>

        {/* Status geral */}
        <section className="grid grid-cols-3 gap-2">
          {(["confirmado", "pendente", "recusado"] as Status[]).map((s) => {
            const count = culto.integrantes.filter((i) => i.status === s).length;
            return (
              <div key={s} className="rounded-2xl border border-border bg-surface p-3 text-center">
                <div className={`mx-auto mb-1.5 size-2 rounded-full ${statusColor(s)}`} />
                <p className="font-serif text-xl font-bold">{count}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {statusLabel(s)}
                </p>
              </div>
            );
          })}
        </section>

        {/* Integrantes por função */}
        <section className="rounded-3xl border border-border bg-surface p-5">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Integrantes
          </h3>
          <div className="space-y-5">
            {Object.entries(grupos).map(([funcao, membros]) => (
              <div key={funcao}>
                <p className="mb-2 font-serif text-sm italic text-muted-foreground">{funcao}</p>
                <div className="space-y-2">
                  {membros.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl bg-secondary/40 p-2.5"
                    >
                      <div className="grid size-9 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {m.iniciais}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.nome}</p>
                        <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span className={`size-1.5 rounded-full ${statusColor(m.status)}`} />
                          {statusLabel(m.status)}
                        </p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ações do usuário */}
        <section className="rounded-3xl border border-accent/25 bg-accent/5 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
            Sua presença
          </p>
          <p className="mt-1 text-sm text-foreground">
            Confirme ou avise sobre indisponibilidade
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground">
              Confirmar
            </button>
            <button className="rounded-xl border border-border bg-surface py-3 text-xs font-bold uppercase tracking-wider text-foreground">
              Solicitar troca
            </button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-secondary/40 p-3">
      <Icon className="mb-1.5 size-3.5 text-muted-foreground" />
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-medium text-foreground">{value}</p>
    </div>
  );
}
