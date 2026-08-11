import type { LucideIcon } from "lucide-react";
import type { AffiliateKey } from "@/config/site";
import type { AdDensity } from "@/lib/adPlacement";

export type ToolCategory =
  | "zeit"
  | "geld"
  | "familie"
  | "text"
  | "wohnen"
  | "essen"
  | "alltag"
  | "gesundheit";

export const categoryLabels: Record<ToolCategory, string> = {
  zeit: "Zeit & Urlaub",
  geld: "Geld",
  familie: "Familie",
  text: "Text",
  wohnen: "Wohnen & Verträge",
  essen: "Essen & Feiern",
  alltag: "Alltag",
  gesundheit: "Gesundheit",
};

/** Startparameter, die eine Tool-Component von URL oder SEO-Variante bekommt. */
export type ToolParams = Record<string, string | number>;

export interface ToolVariant {
  /** z. B. "bayern-2026" – URL-Segment unter /tools/<slug>/ */
  slug: string;
  /** SEO-Titel dieser Variante */
  title: string;
  description: string;
  /** Überschrift auf der Variantenseite (H1), falls abweichend vom Titel. */
  heading?: string;
  /** Wird an Component/Logik übergeben. */
  params: ToolParams;

  /**
   * Eigener Erklärtext statt dem des Tools.
   *
   * Ohne das unterscheiden sich viele Variantenseiten nur in der Überschrift –
   * und genau daran scheitern AdSense-Prüfungen mit "low value content". Wer
   * Varianten erzeugt, die inhaltlich etwas Eigenes zu sagen haben, sagt es
   * hier.
   */
  about?: string[];
  /** Eigene FAQ statt der des Tools. Wird auch zu FAQPage-JSON-LD. */
  faq?: FaqEntry[];
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Kontextuelle Empfehlung unter dem Ergebnis.
 *
 * `when` bekommt das Ergebnisobjekt des Tools als `unknown` – das Tool selbst
 * kennt seinen Typ und engt ihn ein. Dadurch bleibt der Kern generisch.
 */
export interface AffiliateSlot {
  when?: (result: unknown) => boolean;
  /** "Diese 9 Tage clever nutzen" */
  headline: string;
  /** Ein Satz Kontext, warum das hier passt. */
  body?: string;
  /** Schlüssel aus config/site.ts – kein hartkodierter Link im Tool. */
  partner: AffiliateKey;
  /** Button-Text, z. B. "Kurzreisen ansehen" */
  label: string;
}

export interface ToolMonetization {
  /** Default: "low" (ein Slot unter dem Ergebnis). Siehe lib/adPlacement.ts. */
  adDensity?: AdDensity;
  affiliate?: AffiliateSlot[];
}

export interface ToolManifest {
  /** URL-Segment, /tools/<slug> */
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

  /**
   * Startwerte, die erst zur Laufzeit feststehen (z. B. das aktuelle Jahr).
   * Wird serverseitig aufgerufen und in die Component gegeben – so ist der
   * erste Client-Render identisch zum SSR-HTML.
   */
  getDefaultParams?: () => ToolParams;

  /**
   * Erklärtext unter dem Tool. Zahlt auf SEO und auf die AdSense-Anforderung
   * "echter Inhalt" ein. Absätze als einzelne Strings.
   */
  about?: string[];
  /** Wird zu FAQPage-JSON-LD und einer Accordion-Liste. */
  faq?: FaqEntry[];

  /** Programmatische SEO: erzeugt statische Unterseiten (Bundesland/Jahr etc.). */
  getVariants?: () => ToolVariant[];

  /** Monetarisierung pro Tool steuerbar. */
  monetization?: ToolMonetization;
}
