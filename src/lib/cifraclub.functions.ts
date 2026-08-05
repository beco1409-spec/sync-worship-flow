import { createServerFn } from "@tanstack/react-start";
import { isCifraClubUrl, parseCifraClubHtml, type CifraClubImport } from "./cifraclub-parser";

export const importCifraClub = createServerFn({ method: "POST" })
  .inputValidator((data: { url: string }) => {
    if (!data || typeof data.url !== "string" || !isCifraClubUrl(data.url)) {
      throw new Error("Informe um link válido do Cifra Club.");
    }
    return { url: data.url.trim() };
  })
  .handler(async ({ data }): Promise<CifraClubImport> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(data.url, {
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "pt-BR,pt;q=0.9",
        },
      });
      if (!res.ok) throw new Error(`Página não encontrada (HTTP ${res.status}).`);
      const html = await res.text();
      const parsed = parseCifraClubHtml(html);
      if (!parsed.cifra && !parsed.nome) {
        throw new Error("Não foi possível identificar a cifra nesta página.");
      }
      return parsed;
    } finally {
      clearTimeout(timer);
    }
  });
