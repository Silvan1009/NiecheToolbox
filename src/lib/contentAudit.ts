/**
 * Textextraktion und Ähnlichkeitsmaß für die Inhaltsprüfung.
 *
 * Die reine Logik liegt hier, weil sie sich nur so testen lässt – dasselbe
 * Verhältnis wie zwischen lib/securityHeaders.ts und
 * scripts/generate-htaccess.ts. Das Skript selbst
 * (scripts/content-audit.ts) macht nur noch Dateizugriff und Ausgabe.
 *
 * Warum das nicht nebensächlich ist: Die erste Fassung las ab der Markierung
 * bis zum ersten `</section>` und meldete für das Impressum 12 statt 223
 * Wörter, weil dort verschachtelte `<section>` stehen. Ein Messfehler dieser
 * Art fällt nicht auf – die Zahl sieht ja plausibel aus. Deshalb hängen an
 * diesen Funktionen Tests.
 */

/**
 * Länge der verglichenen Wortfolgen. Vier ist lang genug, dass zufällige
 * Übereinstimmungen ("in diesem Fall ist") selten sind, und kurz genug, dass
 * ein umformulierter Satz trotzdem als Wiederholung auffällt.
 */
export const SHINGLE_SIZE = 4;

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
  "&auml;": "ä",
  "&ouml;": "ö",
  "&uuml;": "ü",
  "&Auml;": "Ä",
  "&Ouml;": "Ö",
  "&Uuml;": "Ü",
  "&szlig;": "ß",
  "&euro;": "€",
  "&ndash;": "–",
  "&mdash;": "—",
  "&hellip;": "…",
};

export function decodeEntities(text: string): string {
  return text.replace(/&[a-zA-Z]+;|&#x?[0-9a-fA-F]+;/g, (match) => {
    if (ENTITIES[match]) return ENTITIES[match];
    const numeric = /^&#(x?)([0-9a-fA-F]+);$/.exec(match);
    if (!numeric) return " ";
    const code = Number.parseInt(numeric[2], numeric[1] ? 16 : 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : " ";
  });
}

/**
 * Der Text aller `[data-prose]`-Abschnitte eines HTML-Dokuments.
 *
 * Zählt `<section>` mit, um das passende Ende zu finden. Markierungen
 * innerhalb eines bereits erfassten Bereichs werden übersprungen, damit
 * verschachtelte Auszeichnung nicht doppelt zählt.
 */
export function extractProse(html: string): string {
  const parts: string[] = [];
  const opener = /<section[^>]*\sdata-prose[^>]*>/g;
  const tag = /<section\b[^>]*>|<\/section>/g;
  let capturedUntil = -1;

  let match: RegExpExecArray | null;
  while ((match = opener.exec(html)) !== null) {
    if (match.index < capturedUntil) continue;

    const start = match.index + match[0].length;
    let depth = 1;
    let end = -1;

    tag.lastIndex = start;
    let inner: RegExpExecArray | null;
    while ((inner = tag.exec(html)) !== null) {
      depth += inner[0] === "</section>" ? -1 : 1;
      if (depth === 0) {
        end = inner.index;
        break;
      }
    }

    if (end === -1) continue;
    capturedUntil = end;
    parts.push(html.slice(start, end));
  }

  return (
    decodeEntities(
      // Tags durch ein Leerzeichen ersetzen, nicht durch nichts: Sonst klebt
      // das letzte Wort eines Absatzes am ersten des nächsten und ergäbe eine
      // Wortfolge, die so nirgends dasteht.
      parts.join(" ").replace(/<[^>]+>/g, " "),
    )
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.split(" ").filter(Boolean).length;
}

/**
 * Kleingeschrieben und ohne Satzzeichen – sonst gälte "Euro." als anderes
 * Wort als "Euro", und bloß andere Zeichensetzung sähe wie neuer Text aus.
 */
export function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function shinglesOf(text: string): Set<string> {
  const tokens = normalizeWords(text);
  const set = new Set<string>();
  for (let i = 0; i + SHINGLE_SIZE <= tokens.length; i += 1) {
    set.add(tokens.slice(i, i + SHINGLE_SIZE).join(" "));
  }
  return set;
}

/** Schnittmenge geteilt durch Vereinigung: 0 = nichts gemeinsam, 1 = gleich. */
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let shared = 0;
  for (const item of small) if (large.has(item)) shared += 1;
  return shared / (a.size + b.size - shared);
}
