import type { FaqEntry, ToolParams, ToolVariant } from "./types";

/**
 * Rohinhalt einer SEO-Variantenseite, wie ihn die `varianten.ts` jedes Tools
 * exportiert – vor der Zusammenführung mit dem allgemeinen Erklärtext und der
 * allgemeinen FAQ zu einem fertigen `ToolVariant`.
 */
export interface VariantContent {
  /** URL-Segment unter /tools/<slug>/ */
  slug: string;
  title: string;
  description: string;
  heading: string;
  /** Startwerte des Rechners auf dieser Seite. */
  params: ToolParams;
  /** Kurzform und Gruppe für die Variantenliste – siehe `ToolVariant`. */
  listLabel?: string;
  listGroup?: string;
  /** Drei eigene Absätze; der allgemeine Erklärtext folgt danach. */
  about: string[];
  faq: FaqEntry[];
}

/**
 * Baut aus dem redaktionellen Inhalt fertige `ToolVariant`s: drei eigene
 * Absätze, danach der allgemeine Erklärtext ab dem zweiten Absatz (der erste
 * entfällt, weil die eigenen Absätze dessen Rolle übernehmen).
 *
 * Fragen, die die Variante selbst schon beantwortet, dürfen nicht ein zweites
 * Mal aus dem allgemeinen Teil kommen: Der Besucher läse dieselbe Frage
 * zweimal, und `Faq.tsx` schlüsselt die Einträge nach ihrem Text – ein
 * Duplikat ist dort auch technisch ein Fehler.
 */
export function buildVariants(
  content: VariantContent[],
  about: string[],
  faq: FaqEntry[],
): ToolVariant[] {
  return content.map((entry) => {
    const own = new Set(entry.faq.map((item) => item.question));

    return {
      slug: entry.slug,
      title: entry.title,
      description: entry.description,
      heading: entry.heading,
      listLabel: entry.listLabel,
      listGroup: entry.listGroup,
      params: entry.params,
      about: [...entry.about, ...about.slice(1)],
      faq: [
        ...entry.faq,
        ...faq.filter((item) => !own.has(item.question)).slice(0, 4),
      ],
    };
  });
}
