import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Culto = Database["public"]["Tables"]["cultos"]["Row"];
export type CultoInsert = Database["public"]["Tables"]["cultos"]["Insert"];
export type CultoUpdate = Database["public"]["Tables"]["cultos"]["Update"];

export type Cantor = Database["public"]["Tables"]["cantores"]["Row"];
export type CantorInsert = Database["public"]["Tables"]["cantores"]["Insert"];

export type Instrumentista = Database["public"]["Tables"]["instrumentistas"]["Row"];
export type InstrumentistaInsert = Database["public"]["Tables"]["instrumentistas"]["Insert"];

export type Musica = Database["public"]["Tables"]["musicas"]["Row"];
export type MusicaInsert = Database["public"]["Tables"]["musicas"]["Insert"];
export type MusicaUpdate = Database["public"]["Tables"]["musicas"]["Update"];

export type IntegranteRow = Database["public"]["Tables"]["integrantes_culto"]["Row"];
export type IntegranteInsert = Database["public"]["Tables"]["integrantes_culto"]["Insert"];

export type RepertorioRow = Database["public"]["Tables"]["repertorio_culto"]["Row"];
export type CantorTom = Database["public"]["Tables"]["cantor_tons"]["Row"];

export type IntegranteFull = IntegranteRow & {
  cantor: Pick<Cantor, "id" | "nome" | "voz"> | null;
  instrumentista: Pick<Instrumentista, "id" | "nome" | "instrumento"> | null;
};

export type CultoWithIntegrantes = Culto & {
  integrantes_culto: IntegranteFull[];
};

function toIniciais(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function iniciaisDe(nome?: string | null) {
  if (!nome) return "?";
  return toIniciais(nome) || "?";
}

// ----- Cultos
export async function listCultos() {
  const { data, error } = await supabase
    .from("cultos")
    .select("*")
    .order("data", { ascending: true })
    .order("hora", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getCultoFull(id: string): Promise<CultoWithIntegrantes | null> {
  const { data, error } = await supabase
    .from("cultos")
    .select(
      `*, integrantes_culto(*, cantor:cantores(id,nome,voz), instrumentista:instrumentistas(id,nome,instrumento))`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as CultoWithIntegrantes | null;
}

export async function createCulto(input: CultoInsert) {
  const { data, error } = await supabase.from("cultos").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateCulto(id: string, patch: CultoUpdate) {
  const { data, error } = await supabase
    .from("cultos")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCulto(id: string) {
  const { error } = await supabase.from("cultos").delete().eq("id", id);
  if (error) throw error;
}

// ----- Integrantes do culto
export async function addIntegrante(input: IntegranteInsert) {
  const { data, error } = await supabase
    .from("integrantes_culto")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateIntegrante(
  id: string,
  patch: Database["public"]["Tables"]["integrantes_culto"]["Update"],
) {
  const { error } = await supabase.from("integrantes_culto").update(patch).eq("id", id);
  if (error) throw error;
}

export async function removeIntegrante(id: string) {
  const { error } = await supabase.from("integrantes_culto").delete().eq("id", id);
  if (error) throw error;
}

// ----- Cantores / instrumentistas
export async function listCantores() {
  const { data, error } = await supabase.from("cantores").select("*").order("nome");
  if (error) throw error;
  return data ?? [];
}

export async function createCantor(input: CantorInsert) {
  const { data, error } = await supabase.from("cantores").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateCantor(id: string, patch: Partial<CantorInsert>) {
  const { error } = await supabase.from("cantores").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteCantor(id: string) {
  const { error } = await supabase.from("cantores").delete().eq("id", id);
  if (error) throw error;
}

export async function listInstrumentistas() {
  const { data, error } = await supabase.from("instrumentistas").select("*").order("nome");
  if (error) throw error;
  return data ?? [];
}

export async function createInstrumentista(input: InstrumentistaInsert) {
  const { data, error } = await supabase
    .from("instrumentistas")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateInstrumentista(id: string, patch: Partial<InstrumentistaInsert>) {
  const { error } = await supabase.from("instrumentistas").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteInstrumentista(id: string) {
  const { error } = await supabase.from("instrumentistas").delete().eq("id", id);
  if (error) throw error;
}

// ----- Formatação
export function formatCultoData(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function formatCultoDataCurta(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
}

export function formatHora(hora: string): string {
  return hora.slice(0, 5);
}
