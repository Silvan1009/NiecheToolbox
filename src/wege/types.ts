import type { LucideIcon } from "lucide-react";
import type { AdDensity } from "@/lib/adPlacement";
import type {
  AffiliateSlot,
  ContentSection,
  FaqEntry,
  SourceLink,
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

/**
 * Ein Rechner, den dieser Weg verkettet – in beide Richtungen mit eigenem
 * Text: einmal für den Verweis vom Weg zum Tool ("Im Detail weiterrechnen"),
 * einmal für den Rückverweis vom Tool zum Weg.
 */
export interface WegSourceTool {
  /** Slug aus tools/registry.ts – muss dort auflösen. */
  slug: string;
  /** Eyebrow über dem Tool-Namen auf der Weg-Seite, z. B. "Alle Angaben zur Immobilie". */
  detailEyebrow: string;
  /** Beschreibung auf der Weg-Seite, unter "Im Detail weiterrechnen". */
  detailDescription: string;
  /** Beschreibung auf der Tool-Seite, im Rückverweis zurück zu diesem Weg. */
  backlinkDescription: string;
}

export interface WegManifest {
  /** URL-Segment, /wege/<slug> */
  slug: string;
  /** Anzeigename */
  name: string;
  /** Ein Satz – für die Karte und als Einleitung unter der Überschrift. */
  tagline: string;
  /** Seitentitel im Suchergebnis, ohne Markennamen. Höchstens 60 Zeichen. */
  seoTitle: string;
  /** Beschreibung im Suchergebnis, 120 bis 160 Zeichen. */
  metaDescription: string;
  category: ToolCategory;
  icon: LucideIcon;
  /** Für die interne Suche. Landet nicht als Meta-Tag im HTML. */
  keywords: string[];
  status: "live" | "beta" | "draft";

  /** Die verketteten Rechner – für Rückverlinkung in beide Richtungen. */
  sourceTools: WegSourceTool[];

  /** Wie ToolManifest.getDefaultParams – Startwerte, die erst zur Laufzeit feststehen. */
  getDefaultParams?: () => ToolParams;

  /** Erklärtext nach dem Stepper. */
  about?: string[];
  /**
   * Der ausführliche Teil unter dem Einstieg – wie bei den Tools; siehe
   * `ContentSection` in tools/types.ts.
   */
  sections?: ContentSection[];
  /** Wird zu FAQPage-JSON-LD und einer Accordion-Liste. */
  faq?: FaqEntry[];
  /** Worauf sich der Weg stützt – wie ToolManifest.sources. */
  sources?: SourceLink[];

  /**
   * Programmatische SEO-Varianten – für diesen ersten Weg ungenutzt, aber
   * Teil des Typs, damit sitemap.ts/generate-og-images.tsx generisch mit
   * `weg.getVariants?.() ?? []` bleiben, wie bei den Tools.
   */
  getVariants?: () => ToolVariant[];

  monetization?: WegMonetization;
}
