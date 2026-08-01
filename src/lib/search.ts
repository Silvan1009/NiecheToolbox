/**
 * Kern der Seitensuche – rein, ohne React, ohne Registry-Import.
 *
 * Bewusst ohne Bibliothek: der Index hat gut zwanzig Einträge. Fuzzy-Matching
 * würde hier mehr falsche Treffer erzeugen als richtige – wer "kgv" tippt,
 * will nicht "Umzug" angeboten bekommen, nur weil zwei Buchstaben passen.
 */

export interface SearchEntry {
  /** Immer mit Trailing Slash – wie alle Pfade hier, siehe lib/seo.ts. */
  href: string;
  name: string;
  /** Kurzhinweis unter dem Namen. Taglines sind zu lang fürs Dropdown. */
  hint: string;
  /** Redaktionelle Suchbegriffe: das, was jemand tatsächlich tippt. */
  tags: string[];
  /** Bei kuratierten Unterseiten der Name des übergeordneten Rechners. */
  parentName?: string;
}

/**
 * Vereinheitlicht Schreibweisen, damit "Kündigung" und "kuendigung" dieselbe
 * Zeichenkette ergeben.
 *
 * Die Reihenfolge ist nicht beliebig: Die Umlaute müssen expandiert werden,
 * *bevor* NFD die Kombinationszeichen abtrennt – sonst wird aus "ä" ein "a"
 * und "kaendigung" träfe nichts mehr.
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Zweite Schreibweise: Umlaut ohne Punkte statt ausgeschrieben.
 *
 * Deutsche tippen beides – "kuendigung" auf einer Tastatur ohne Umlaute,
 * "kundigung", wenn es schnell gehen muss. Ein einziges Faltungsschema
 * erwischt immer nur eine der beiden Gruppen, also indizieren wir beide.
 */
function stripDiacritics(input: string): string {
  return input
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Beide Normalformen eines Textes – Treffer in einer reicht. */
function forms(input: string): [string, string] {
  return [normalize(input), stripDiacritics(input)];
}

const SCORE = {
  namePrefix: 100,
  nameWordStart: 60,
  nameSubstring: 40,
  tagExact: 50,
  tagPrefix: 30,
  hint: 15,
  parent: 10,
  /** Ein Rechner steht bei Gleichstand vor seinen eigenen Unterseiten. */
  variantPenalty: 5,
} as const;

/** Trifft `token` den Anfang eines Wortes in `haystack`? */
function hasWordStart(haystack: string, token: string): boolean {
  return haystack === token || haystack.startsWith(`${token}`)
    ? true
    : haystack.includes(` ${token}`);
}

interface PreparedEntry {
  entry: SearchEntry;
  position: number;
  names: [string, string];
  hints: [string, string];
  parents: [string, string];
  /** Je Tag beide Normalformen. */
  tags: [string, string][];
}

function prepare(index: readonly SearchEntry[]): PreparedEntry[] {
  return index.map((entry, position) => ({
    entry,
    position,
    names: forms(entry.name),
    hints: forms(entry.hint),
    parents: forms(entry.parentName ?? ""),
    tags: entry.tags.map(forms),
  }));
}

/** Punkte eines einzelnen Suchtokens gegen einen Eintrag. 0 = kein Treffer. */
function scoreToken(prepared: PreparedEntry, token: string): number {
  let score = 0;

  for (const name of prepared.names) {
    if (name.startsWith(token)) {
      score = Math.max(score, SCORE.namePrefix);
    } else if (hasWordStart(name, token)) {
      score = Math.max(score, SCORE.nameWordStart);
    } else if (name.includes(token)) {
      score = Math.max(score, SCORE.nameSubstring);
    }
  }

  for (const tag of prepared.tags) {
    for (const form of tag) {
      if (form === token) {
        score = Math.max(score, SCORE.tagExact);
      } else if (form.startsWith(token) || hasWordStart(form, token)) {
        score = Math.max(score, SCORE.tagPrefix);
      }
    }
  }

  if (score === 0) {
    for (const hint of prepared.hints) {
      if (hint.includes(token)) {
        score = Math.max(score, SCORE.hint);
      }
    }
    for (const parent of prepared.parents) {
      if (parent && parent.includes(token)) {
        score = Math.max(score, SCORE.parent);
      }
    }
  }

  return score;
}

/**
 * Filtert und sortiert den Index.
 *
 * Mehrere Wörter werden UND-verknüpft: "strom kosten" trifft, "strom bayern"
 * nicht. Wer zwei Begriffe tippt, meint beide.
 */
export function filterEntries(
  index: readonly SearchEntry[],
  query: string,
  limit = 8,
): SearchEntry[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];

  const scored: { entry: SearchEntry; score: number; position: number }[] = [];

  for (const prepared of prepare(index)) {
    let total = 0;

    for (const token of tokens) {
      const score = scoreToken(prepared, token);
      if (score === 0) {
        total = 0;
        break;
      }
      total += score;
    }

    if (total === 0) continue;
    if (prepared.entry.parentName) total -= SCORE.variantPenalty;

    scored.push({
      entry: prepared.entry,
      score: total,
      position: prepared.position,
    });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.position - b.position)
    .slice(0, limit)
    .map((hit) => hit.entry);
}
