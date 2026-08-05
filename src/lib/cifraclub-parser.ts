export interface CifraClubImport {
  nome: string | null;
  autor: string | null;
  tom: string | null;
  cifra: string | null;
}

export function isCifraClubUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?cifraclub\.com\.br\/[\w-]+\/[\w-]+\/?$/i.test(url.trim());
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&amp;/g, "&");
}

function extractJsonLd(html: string): { nome: string | null; autor: string | null } {
  let nome: string | null = null;
  let autor: string | null = null;
  const blocks = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const types = Array.isArray(item?.["@type"]) ? item["@type"] : [item?.["@type"]];
        if (types.includes("MusicComposition") && typeof item.name === "string") {
          nome = item.name;
        }
        if (types.includes("MusicRecording")) {
          const artist = item?.byArtist?.name;
          if (typeof artist === "string") autor = artist;
          if (!nome && typeof item.name === "string" && autor && item.name.startsWith(autor)) {
            nome = item.name.slice(autor.length).replace(/^\s*-\s*/, "");
          }
        }
      }
    } catch {
      // bloco inválido — ignora
    }
  }
  return { nome, autor };
}

function extractTom(html: string): string | null {
  const m = html.match(/aria-label="Diminuir tom"[\s\S]{0,800}?<p[^>]*>\s*([A-G][#b]?(?:m|maj|min)?)\s*<\/p>/);
  return m ? m[1] : null;
}

function extractCifra(html: string): string | null {
  const pre = html.match(/<pre[^>]*data-chord-content="true"[^>]*>([\s\S]*?)<\/pre>/);
  if (!pre) return null;
  let inner = pre[1];
  // Remove blocos de tablatura (mantemos apenas cifra + letra)
  inner = inner.replace(/<div class="tabs">[\s\S]*?<\/div>/g, "");
  inner = inner
    .replace(/<b\b[^>]*>([\s\S]*?)<\/b>/g, "$1")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/div>/g, "\n")
    .replace(/<[^>]+>/g, "");
  const text = decodeEntities(inner)
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return text.length > 0 ? text : null;
}

export function parseCifraClubHtml(html: string): CifraClubImport {
  const { nome, autor } = extractJsonLd(html);
  return {
    nome,
    autor,
    tom: extractTom(html),
    cifra: extractCifra(html),
  };
}
