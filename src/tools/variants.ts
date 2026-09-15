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
 * Baut aus dem redaktionellen Inhalt fertige `ToolVariant`s – ohne
 * Vererbung: Jede Variante bekommt ausschließlich ihren eigenen Inhalt.
 *
 * Bis zur AdSense-Konsolidierung (siehe docs/adsense/etappe-0-ausgangslage.md)
 * hängte diese Funktion zusätzlich `about.slice(1)` der Elternseite und bis zu
 * vier geteilte FAQ an jede Variante an; das erzeugte laut
 * `scripts/content-audit.ts` auf den betroffenen Seiten durchschnittlich
 * 50 Prozent kopierten Elterntext. Ein Tool, dessen eigener Variantentext für
 * sich allein nicht trägt, bekommt keine Prosa-Prothese mehr – sondern mehr
 * eigenen Text in seiner `varianten.ts`.
 */
export function buildVariants(content: VariantContent[]): ToolVariant[] {
  return content.map((entry) => ({
    slug: entry.slug,
    title: entry.title,
    description: entry.description,
    heading: entry.heading,
    listLabel: entry.listLabel,
    listGroup: entry.listGroup,
    params: entry.params,
    about: entry.about,
    sections: entry.sections,
    faq: entry.faq,
  }));
}
