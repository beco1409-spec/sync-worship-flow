# Harmony Hub

Sua ideia é excelente, mas o prompt está descrevendo funcionalidades. Para uma IA gerar um aplicativo de alto nível, o ideal é definir o produto completo, as regras de negócio, a experiência do usuário e os diferenciais. Também acrescentaria funcionalidades que realmente resolvem os problemas de um ministério de louvor.

Eu reescreveria assim:

Planejamento do aplicativo para Ministério de Louvor

Atue como um Engenheiro de Software Full Stack, UX/UI Designer Sênior e Arquiteto de Sistemas.

Crie um aplicativo moderno para gerenciamento completo de Ministérios de Louvor, com foco em organização de escalas, repertório, comunicação e preparação dos músicos.

O aplicativo deve possuir design moderno, intuitivo, responsivo e com modo claro e escuro.

Módulos do aplicativo

1. Dashboard

Ao entrar no aplicativo, o usuário deve visualizar:

Próximo culto;

Quantidade de integrantes confirmados;

Integrantes pendentes de confirmação;

Músicas do próximo culto;

Avisos da equipe;

Agenda da semana;

Atalhos rápidos.

2. Escala

Criar uma aba exclusiva para gerenciamento das escalas.

Cada culto deve possuir:

Nome do culto;

Data;

Horário;

Local;

Responsável pela escala;

Tema da mensagem (opcional);

Pregador;

Observações.

Dentro do culto permitir selecionar:

Cantores

Cantor principal

Back vocal

Participações especiais

Instrumentistas

Violão

Guitarra

Baixo

Teclado

Piano

Bateria

Percussão

Violino

Sax

Outros

Cada integrante poderá:

Confirmar presença;

Recusar;

Informar motivo;

Solicitar substituição.

Mostrar visualmente:

🟢 Confirmado

🟡 Pendente

🔴 Recusado

3. Repertório do Culto

Cada culto possui uma playlist.

Ao adicionar uma música:

escolher cantor principal;

automaticamente carregar o tom cadastrado daquele cantor;

permitir alterar o tom apenas para aquele culto;

informar BPM;

tonalidade;

ordem das músicas.

Cada música deve conter:

Nome;

Autor;

Ministério;

Tempo;

Duração;

Link Spotify;

Link YouTube;

Playback;

Multitrack.

4. Cantores

Cada cantor terá um perfil.

Campos:

Nome;

Foto;

Telefone;

E-mail;

Classificação vocal;

Extensão vocal;

Ministério;

Disponibilidade.

Cada cantor possui um repertório pessoal.

Para cada música armazenar:

Tom preferido;

Última vez cantada;

Nível de dificuldade.

5. Instrumentistas

Cada instrumentista possui:

Perfil;

Instrumentos que toca;

Nível (iniciante/intermediário/avançado);

Disponibilidade.

Ao abrir um culto ele verá:

playlist;

cifras;

tom correto;

BPM;

metrônomo;

mapa da música;

observações.

6. Letras e Cifras Inteligentes

Cada música deve possuir:

Letra completa;

Cifra;

Transposição automática;

Rolagem automática;

Zoom;

Modo apresentação.

Permitir marcações coloridas.

🔴 Solo

🔵 Back vocal

🟢 Entrada dos instrumentos

🟣 Ponte

🟡 Finalização

Também permitir inserir comentários em qualquer trecho.

7. Biblioteca de Músicas

Cadastro completo.

Campos:

Nome;

Autor;

Ministério;

Ano;

Tom original;

BPM;

Compasso;

Tempo;

Estilo;

Dificuldade.

Anexos:

PDF

Cifra

Playback

MP3

Multitrack

Vídeo de referência

8. Agenda

Calendário mensal.

Mostrar:

Cultos;

Ensaios;

Congressos;

Eventos.

Enviar lembretes automáticos.

9. Comunicação

Chat interno.

Permitir:

avisos;

enquetes;

pedidos de oração;

arquivos;

fotos;

áudios.

10. Notificações

Enviar notificações quando:

houver nova escala;

alterar repertório;

trocar tom;

alterar horário;

alguém confirmar presença;

faltar menos de 24 horas para o culto.

11. Administração

Controle de permissões.

Administrador.

Líder.

Ministro.

Instrumentista.

Back vocal.

Visitante.

Cada perfil possui permissões diferentes.

12. Diferencial Inteligente

O sistema deve identificar automaticamente:

músicas repetidas nas últimas semanas;

músicas mais utilizadas;

tom ideal para cada cantor;

integrantes que mais faltam;

estatísticas do ministério;

histórico completo dos cultos.

Regras de negócio

Um mesmo cantor pode possuir tons diferentes para músicas diferentes.

Ao trocar o cantor principal, todas as cifras devem ser transpostas automaticamente.

Todos os instrumentistas recebem imediatamente o novo tom.

O histórico nunca deve ser perdido.

Todo culto fica arquivado.

Todo integrante pode consultar escalas antigas.

Design

Quero um aplicativo premium, semelhante ao Spotify, Notion e Apple Music, utilizando:

Material Design 3;

animações suaves;

ícones modernos;

interface limpa;

cores elegantes;

excelente experiência do usuário.

O aplicativo deve ser pensado para Android, iPhone e Web.

Na minha opinião, ainda falta um recurso que seria o grande diferencial: um Modo Culto. Nele, ao iniciar o culto, todos os músicos entram automaticamente na mesma playlist, e quando o ministro avança para a próxima música, todos os celulares acompanham em tempo real, já exibindo a cifra no tom correto, letra, BPM, metrônomo e observações. Isso elimina a necessidade de procurar músicas durante o culto e deixa toda a equipe sincronizada. Esse recurso faria o aplicativo se destacar em relação à maioria dos apps existentes para ministérios de louvor.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sync-worship-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/57b37c34-7a73-43b7-94e6-46b878b13b33).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
