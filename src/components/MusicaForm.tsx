import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createMusica, updateMusica, type Musica } from "@/lib/db";
import { importCifraClub } from "@/lib/cifraclub.functions";
import { isCifraClubUrl } from "@/lib/cifraclub-parser";

const TONS = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "Cm", "C#m", "Dm", "D#m", "Ebm", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bbm", "Bm"];

export function MusicaForm({
  musica,
  onClose,
  onSaved,
}: {
  musica?: Musica | null;
  onClose: () => void;
  onSaved?: (id: string) => void;
}) {
  const qc = useQueryClient();
  const editing = !!musica;

  const [form, setForm] = useState({
    nome: musica?.nome ?? "",
    autor: musica?.autor ?? "",
    ministerio: musica?.ministerio ?? "",
    tom_original: musica?.tom_original ?? "",
    bpm: musica?.bpm ? String(musica.bpm) : "",
    duracao: musica?.duracao ?? "",
    youtube_url: musica?.youtube_url ?? "",
    cifraclub_url: musica?.cifraclub_url ?? "",
    letra: musica?.letra ?? "",
    cifra: musica?.cifra ?? "",
    observacoes: musica?.observacoes ?? "",
  });
  const [importing, setImporting] = useState(false);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        nome: form.nome.trim(),
        autor: form.autor.trim() || null,
        ministerio: form.ministerio.trim() || null,
        tom_original: form.tom_original || null,
        bpm: form.bpm ? parseInt(form.bpm, 10) : null,
        duracao: form.duracao.trim() || null,
        youtube_url: form.youtube_url.trim() || null,
        cifraclub_url: form.cifraclub_url.trim() || null,
        letra: form.letra.trim() || null,
        cifra: form.cifra.trim() || null,
        observacoes: form.observacoes.trim() || null,
      };
      if (editing) {
        await updateMusica(musica!.id, payload);
        return musica!.id;
      }
      const row = await createMusica(payload);
      return row.id;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["musicas"] });
      toast.success(editing ? "Música atualizada" : "Música cadastrada com sucesso");
      onSaved?.(id);
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleImportar() {
    const url = form.cifraclub_url.trim();
    if (!isCifraClubUrl(url)) {
      toast.error("Não foi possível importar esta música do Cifra Club.", {
        description: "Verifique se o link é válido (ex.: https://www.cifraclub.com.br/artista/musica/).",
      });
      return;
    }
    setImporting(true);
    try {
      const data = await importCifraClub({ data: { url } });
      setForm((f) => ({
        ...f,
        nome: data.nome ?? f.nome,
        autor: data.autor ?? f.autor,
        tom_original: data.tom ?? f.tom_original,
        cifra: data.cifra ?? f.cifra,
      }));
      toast.success("Cifra importada do Cifra Club", {
        description: "Revise os campos e salve a música.",
      });
    } catch {
      toast.error("Não foi possível importar esta música do Cifra Club.");
    } finally {
      setImporting(false);
    }
  }

  const valid = form.nome.trim().length > 0 && (!form.bpm || /^\d{2,3}$/.test(form.bpm));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background pb-8 pt-4 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-center justify-between px-5 pb-3">
          <h3 className="font-serif text-lg italic">
            {editing ? "Editar música" : "Nova música"}
          </h3>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-secondary"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!valid) return;
            save.mutate();
          }}
          className="space-y-3 px-5"
        >
          <Field label="Link do Cifra Club">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://www.cifraclub.com.br/..."
                value={form.cifraclub_url}
                onChange={(e) => setForm({ ...form, cifraclub_url: e.target.value })}
                className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleImportar}
                disabled={importing || !form.cifraclub_url.trim()}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-accent px-3 py-2.5 text-[11px] font-bold uppercase tracking-wider text-accent-foreground disabled:opacity-60"
              >
                {importing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4" />
                )}
                {importing ? "Importando…" : "Importar"}
              </button>
            </div>
          </Field>
          <Field label="Nome *">
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Autor / Artista">
              <input
                value={form.autor}
                onChange={(e) => setForm({ ...form, autor: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </Field>
            <Field label="Ministério">
              <input
                value={form.ministerio}
                onChange={(e) => setForm({ ...form, ministerio: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Tom">
              <select
                value={form.tom_original}
                onChange={(e) => setForm({ ...form, tom_original: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface px-2 py-2.5 text-sm outline-none focus:border-accent"
              >
                <option value="">—</option>
                {TONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="BPM">
              <input
                inputMode="numeric"
                placeholder="72"
                value={form.bpm}
                onChange={(e) => setForm({ ...form, bpm: e.target.value.replace(/\D/g, "") })}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </Field>
            <Field label="Duração">
              <input
                placeholder="5:12"
                value={form.duracao}
                onChange={(e) => setForm({ ...form, duracao: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </Field>
          </div>
          <Field label="YouTube">
            <input
              type="url"
              placeholder="https://youtube.com/…"
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </Field>
          <Field label="Cifra">
            <textarea
              rows={4}
              placeholder={"[Verso]\n     G          D\nEu te amo, Deus"}
              value={form.cifra}
              onChange={(e) => setForm({ ...form, cifra: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 font-mono text-xs outline-none focus:border-accent"
            />
          </Field>
          <Field label="Letra">
            <textarea
              rows={3}
              value={form.letra}
              onChange={(e) => setForm({ ...form, letra: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </Field>
          <Field label="Observações">
            <input
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </Field>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-surface py-3 text-xs font-bold uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!valid || save.isPending}
              className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground disabled:opacity-60"
            >
              {save.isPending ? "Salvando…" : "Salvar Música"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
