import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bell, Music2, Settings, LogOut, ChevronRight, Star, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell, AppHeader } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useMyRoles } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { title: "Perfil — Portal Adoração" },
      { name: "description", content: "Seu perfil, tom preferido por música e configurações do ministério." },
    ],
  }),
  component: PerfilPage,
});

const roleLabels: Record<string, string> = {
  lider: "Líder",
  cantor: "Cantor",
  instrumentista: "Instrumentista",
  membro: "Membro",
};

function PerfilPage() {
  const { user } = useAuth();
  const roles = useMyRoles(user);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [nome, setNome] = useState<string>("");
  const [funcao, setFuncao] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("nome_completo, funcao_vocal")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setNome(data?.nome_completo ?? "");
        setFuncao(data?.funcao_vocal ?? "");
      });
  }, [user]);

  const iniciais = (nome || user?.email || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const rolesLabel = roles.length
    ? roles.map((r) => roleLabels[r] ?? r).join(" • ")
    : "Membro do ministério";

  async function onSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    toast.success("Você saiu da sua conta");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell>
      <AppHeader
        eyebrow="Perfil"
        title={nome || "Seu perfil"}
        subtitle={rolesLabel}
      />

      <main className="space-y-4 px-4">
        <section className="rounded-3xl border border-border bg-surface p-5">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-full bg-primary font-serif text-2xl italic text-primary-foreground">
              {iniciais}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Classificação vocal
              </p>
              <p className="font-serif text-lg italic">{funcao || "Não definida"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          {roles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {roles.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent"
                >
                  <Shield className="size-3" />
                  {roleLabels[r] ?? r}
                </span>
              ))}
            </div>
          )}
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
            { icon: Bell, label: "Notificações", hint: "Ativadas", onClick: undefined },
            { icon: Star, label: "Favoritos", hint: "12 músicas", onClick: undefined },
            { icon: Settings, label: "Configurações", hint: "", onClick: undefined },
            { icon: LogOut, label: "Sair", hint: "", onClick: onSignOut },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.label}
                onClick={r.onClick}
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
