export type Status = "confirmado" | "pendente" | "recusado";

export interface Integrante {
  id: string;
  nome: string;
  funcao: string;
  status: Status;
  iniciais: string;
}

export interface Musica {
  id: string;
  nome: string;
  autor: string;
  tom: string;
  bpm: number;
  duracao: string;
  cantor: string;
}

export interface Culto {
  id: string;
  nome: string;
  data: string;
  hora: string;
  local: string;
  responsavel: string;
  pregador: string;
  tema?: string;
  integrantes: Integrante[];
  playlist: Musica[];
}

export interface Aviso {
  id: string;
  autor: string;
  mensagem: string;
  quando: string;
}

export interface EventoAgenda {
  id: string;
  dia: string;
  diaSemana: string;
  titulo: string;
  hora: string;
  local: string;
  destaque?: boolean;
}

export const proximoCulto: Culto = {
  id: "c1",
  nome: "Culto de Celebração",
  data: "Domingo, 24 de Novembro",
  hora: "19:30",
  local: "Templo Principal",
  responsavel: "Gabriel Almeida",
  pregador: "Pr. Lucas Ferreira",
  tema: "A bondade que nos alcança",
  integrantes: [
    { id: "i1", nome: "Ana Beatriz", funcao: "Cantora Principal", status: "confirmado", iniciais: "AB" },
    { id: "i2", nome: "Rafael Souza", funcao: "Back Vocal", status: "confirmado", iniciais: "RS" },
    { id: "i3", nome: "Marcos Lima", funcao: "Violão", status: "confirmado", iniciais: "ML" },
    { id: "i4", nome: "João Pedro", funcao: "Guitarra", status: "pendente", iniciais: "JP" },
    { id: "i5", nome: "Camila Rocha", funcao: "Teclado", status: "confirmado", iniciais: "CR" },
    { id: "i6", nome: "Thiago Alves", funcao: "Baixo", status: "pendente", iniciais: "TA" },
    { id: "i7", nome: "Bruno Dias", funcao: "Bateria", status: "confirmado", iniciais: "BD" },
    { id: "i8", nome: "Letícia Nunes", funcao: "Back Vocal", status: "recusado", iniciais: "LN" },
  ],
  playlist: [
    { id: "m1", nome: "Bondade de Deus", autor: "Isaías Saad", tom: "G", bpm: 72, duracao: "5:12", cantor: "Ana Beatriz" },
    { id: "m2", nome: "Ousado Amor", autor: "Isaías Saad", tom: "E", bpm: 114, duracao: "6:04", cantor: "Ana Beatriz" },
    { id: "m3", nome: "Lugar Secreto", autor: "Gabriela Rocha", tom: "A", bpm: 76, duracao: "4:38", cantor: "Rafael Souza" },
    { id: "m4", nome: "Yeshua", autor: "Casa Worship", tom: "Am", bpm: 68, duracao: "5:45", cantor: "Ana Beatriz" },
    { id: "m5", nome: "Nada Além do Sangue", autor: "Fernandinho", tom: "D", bpm: 70, duracao: "4:20", cantor: "Rafael Souza" },
  ],
};

export const avisos: Aviso[] = [
  {
    id: "a1",
    autor: "Gabriel Almeida",
    mensagem: "Ensaio extra no sábado às 14h para trabalhar a transição da ponte de 'Ousado Amor'.",
    quando: "há 2h",
  },
  {
    id: "a2",
    autor: "Camila Rocha",
    mensagem: "Trazer fones de retorno para o soundcheck de domingo.",
    quando: "ontem",
  },
];

export const agendaSemana: EventoAgenda[] = [
  { id: "e1", dia: "22", diaSemana: "Ter", titulo: "Ensaio Vocal", hora: "19:30", local: "Auditório Principal" },
  { id: "e2", dia: "23", diaSemana: "Qua", titulo: "Reunião de Líderes", hora: "20:00", local: "Sala de Conferência" },
  { id: "e3", dia: "24", diaSemana: "Dom", titulo: "Culto de Celebração", hora: "19:30", local: "Templo Principal", destaque: true },
  { id: "e4", dia: "26", diaSemana: "Ter", titulo: "Ensaio Banda", hora: "20:00", local: "Auditório Principal" },
];

export const cultosFuturos: Culto[] = [
  proximoCulto,
  {
    id: "c2",
    nome: "Culto da Família",
    data: "Domingo, 1 de Dezembro",
    hora: "10:00",
    local: "Templo Principal",
    responsavel: "Camila Rocha",
    pregador: "Pr. Lucas Ferreira",
    integrantes: proximoCulto.integrantes.slice(0, 6).map((i) => ({ ...i, status: "pendente" as Status })),
    playlist: proximoCulto.playlist.slice(0, 3),
  },
  {
    id: "c3",
    nome: "Culto de Oração",
    data: "Quarta, 4 de Dezembro",
    hora: "19:30",
    local: "Salão de Oração",
    responsavel: "Rafael Souza",
    pregador: "Pr. André Melo",
    integrantes: proximoCulto.integrantes.slice(0, 4).map((i) => ({ ...i, status: "confirmado" as Status })),
    playlist: proximoCulto.playlist.slice(2, 5),
  },
];

export const bibliotecaMusicas: Musica[] = [
  ...proximoCulto.playlist,
  { id: "m6", nome: "Deus é Deus", autor: "Delino Marçal", tom: "C", bpm: 76, duracao: "5:22", cantor: "Ana Beatriz" },
  { id: "m7", nome: "Digno é o Cordeiro", autor: "Ministério Zoe", tom: "B", bpm: 68, duracao: "6:10", cantor: "Rafael Souza" },
  { id: "m8", nome: "Rei do Meu Coração", autor: "Nívea Soares", tom: "F", bpm: 82, duracao: "5:00", cantor: "Ana Beatriz" },
];

export function statusColor(status: Status) {
  if (status === "confirmado") return "bg-emerald-500";
  if (status === "pendente") return "bg-amber-500";
  return "bg-rose-500";
}

export function statusLabel(status: Status) {
  if (status === "confirmado") return "Confirmado";
  if (status === "pendente") return "Pendente";
  return "Recusado";
}
