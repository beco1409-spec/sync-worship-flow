const SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const INDEX: Record<string, number> = {
  C: 0, "B#": 0,
  "C#": 1, Db: 1,
  D: 2,
  "D#": 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, "E#": 5,
  "F#": 6, Gb: 6,
  G: 7,
  "G#": 8, Ab: 8,
  A: 9,
  "A#": 10, Bb: 10,
  B: 11, Cb: 11,
};

// Sufixos válidos de cifra: m, maj, min, dim, aug, sus, add, números, °, ø, parênteses
const SUFFIX_RE = /^([mM]|[mM]aj|[mM]in|dim|aug|sus|add|no|°|ø|\+|-)?[0-9]*([sS]us[24]?|[aA]dd[0-9]+)?(\([0-9#b+,°ø\s-]*\))?$/;

function isChordToken(token: string): boolean {
  if (!/^[A-G](#|b)?/.test(token)) return false;
  // Divide baixo invertido: Am/C
  const [main, ...bassParts] = token.split("/");
  const m = main.match(/^([A-G](#|b)?)(.*)$/);
  if (!m) return false;
  if (!SUFFIX_RE.test(m[2])) return false;
  for (const bass of bassParts) {
    const b = bass.match(/^([A-G](#|b)?)(.*)$/);
    if (!b) return false;
    if (!SUFFIX_RE.test(b[2])) return false;
  }
  return true;
}

function transposeRoot(root: string, semitones: number): string {
  const idx = INDEX[root];
  if (idx === undefined) return root;
  const next = (((idx + semitones) % 12) + 12) % 12;
  return (root.includes("b") ? FLAT : SHARP)[next];
}

export function transposeChord(token: string, semitones: number): string {
  if (!isChordToken(token)) return token;
  return token
    .split("/")
    .map((part) => {
      const m = part.match(/^([A-G](#|b)?)(.*)$/)!;
      return transposeRoot(m[1], semitones) + m[2];
    })
    .join("/");
}

export function transposeTom(tom: string, semitones: number): string {
  return transposeChord(tom.trim(), semitones);
}

export function transposeCifra(text: string, semitones: number): string {
  if (!semitones) return text;
  return text
    .split("\n")
    .map((line) =>
      line
        .split(/(\s+)/)
        .map((tok) => (isChordToken(tok) ? transposeChord(tok, semitones) : tok))
        .join(""),
    )
    .join("\n");
}
