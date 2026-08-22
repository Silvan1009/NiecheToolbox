import type { ContentSection, FaqEntry, ToolParams, ToolVariant } from "./types";

/**
 * Rohinhalt einer SEO-Variantenseite, wie ihn die `varianten.ts` jedes Tools
 * exportiert – vor der Umwandlung in ein fertiges `ToolVariant`.
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
  /** Eigene Absätze dieser Variante. */
  about: string[];
  faq: FaqEntry[];
  /** Eigener ausführlicher Teil dieser Variante, z. B. eine Beispielrechnung. */
  sections?: ContentSection[];
}

/**
 * Baut aus dem redaktionellen Inhalt fertige `ToolVariant`s.
 *
 * `about` und `faq` sind absichtlich optional und ohne Vererbung: Ein Aufruf
 * ohne beide Argumente – `buildVariants(variantenTexte)` – gibt jede Variante
 * ausschließlich mit ihrem eigenen Inhalt weiter. Bis Etappe 3 hängte diese
 * Funktion `about.slice(1)` und bis zu vier geteilte FAQ an jede Variante an;
 * das erzeugte laut `scripts/content-audit.ts` auf den 174 betroffenen Seiten
 * durchschnittlich 50 Prozent kopierten Elterntext. Ein Tool, dessen eigener
 * Variantentext für sich allein nicht trägt, bekommt keine Prosa-Prothese
 * mehr – sondern mehr eigenen Text in seiner `varianten.ts`.
 *
 * Die beiden Parameter bleiben nur so lange bestehen, bis auch das letzte
 * Tool umgestellt ist; siehe die Migrationsliste im Plan zu dieser Etappe.
 */
export function buildVariants(
  content: VariantContent[],
  about: string[] = [],
  faq: FaqEntry[] = [],
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
      sections: entry.sections,
      faq: [
        ...entry.faq,
        ...faq.filter((item) => !own.has(item.question)).slice(0, 4),
      ],
    };
  });
}
