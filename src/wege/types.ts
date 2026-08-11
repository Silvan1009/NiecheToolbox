import type { LucideIcon } from "lucide-react";
import type { AdDensity } from "@/lib/adPlacement";
import type {
  AffiliateSlot,
  FaqEntry,
  ToolCategory,
  ToolParams,
  ToolVariant,
} from "@/tools/types";

/**
 * Manifest eines "Wegs" – einer geführten Strecke, die mehrere vorhandene
 * Tools zu einem Urteil verkettet, statt eine isolierte Zahl zu liefern.
 *
 * Strukturell deckungsgleich mit `ToolManifest`, wo es passt: Karte,
 * Meta-Description und Kategorie funktionieren identisch. Der Unterschied
 * steckt nicht in der Datenform, sondern darin, welche Registry/Route/
 * Pfad-Helfer ein Weg durchläuft (`/wege/` statt `/tools/`) – deshalb ein
 * eigener Typ statt einer Wiederverwendung von `ToolManifest`.
 */
export interface WegMonetization {
  adDensity?: AdDensity;
  affiliate?: AffiliateSlot[];
}

export interface WegManifest {
  /** URL-Segment, /wege/<slug> */
  slug: string;
  /** Anzeigename */
  name: string;
  /** Ein Satz – für Karte und Meta-Description. */
  tagline: string;
  category: ToolCategory;
  icon: LucideIcon;
  /** Interne Suche + SEO. */
  keywords: string[];
  status: "live" | "beta" | "draft";

  /** Slugs der verketteten Rechner aus tools/registry.ts – für Rückverlinkung. */
  sourceTools: string[];

  /** Wie ToolManifest.getDefaultParams – Startwerte, die erst zur Laufzeit feststehen. */
  getDefaultParams?: () => ToolParams;

  /** Erklärtext nach dem Stepper. */
  about?: string[];
  /** Wird zu FAQPage-JSON-LD und einer Accordion-Liste. */
  faq?: FaqEntry[];

  /**
   * Programmatische SEO-Varianten – für diesen ersten Weg ungenutzt, aber
   * Teil des Typs, damit sitemap.ts/generate-og-images.tsx generisch mit
   * `weg.getVariants?.() ?? []` bleiben, wie bei den Tools.
   */
  getVariants?: () => ToolVariant[];

  monetization?: WegMonetization;
}
