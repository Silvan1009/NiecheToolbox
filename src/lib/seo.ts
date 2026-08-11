import type { Metadata } from "next";
import { site } from "@/config/site";
import type { FaqEntry, ToolManifest, ToolVariant } from "@/tools/types";
import type { WegManifest } from "@/wege/types";

/** Absolute URL aus einem Pfad – für canonical, OG und Sitemap. */
export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Seitenpfade enden auf "/" – so und nicht anders exportiert Next sie
 * (`trailingSlash: true` in next.config.ts) und so liefert Apache sie aus.
 * Canonical, Sitemap und tatsächliche URL müssen dieselbe Schreibweise haben,
 * sonst crawlt Google zwei Fassungen derselben Seite.
 *
 * Dateien mit Endung (/sitemap.xml, /ads.txt) und die Bilder unter /og/ haben
 * deshalb keinen Schrägstrich am Ende – siehe ogImagePath().
 */
export const toolPath = (slug: string) => `/tools/${slug}/`;
export const variantPath = (slug: string, variant: string) =>
  `/tools/${slug}/${variant}/`;

export const wegPath = (slug: string) => `/wege/${slug}/`;
export const wegVariantPath = (slug: string, variant: string) =>
  `/wege/${slug}/${variant}/`;

/**
 * Pfad zum vorgerenderten Open-Graph-Bild (erzeugt von
 * scripts/generate-og-images.tsx beim Build, siehe public/og/).
 */
export function ogImagePath(slug: string, variantSlug?: string): string {
  return variantSlug ? `/og/${slug}--${variantSlug}.png` : `/og/${slug}.png`;
}

interface JsonLdNode {
  "@type": string;
  [key: string]: unknown;
}

/** Ein einzelnes @graph-Objekt statt vieler Script-Tags. */
export function jsonLdGraph(nodes: JsonLdNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function breadcrumbNode(
  items: { name: string; path: string }[],
): JsonLdNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqNode(entries: FaqEntry[]): JsonLdNode {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export function toolNode(
  tool: ToolManifest,
  {
    name,
    description,
    path,
  }: { name: string; description: string; path: string },
): JsonLdNode {
  return {
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    inLanguage: "de-DE",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    keywords: tool.keywords.join(", "),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

/** Wie toolNode, aber für einen Weg – dieselbe Struktur, ein anderer Pfadraum. */
export function wegNode(
  weg: WegManifest,
  {
    name,
    description,
    path,
  }: { name: string; description: string; path: string },
): JsonLdNode {
  return {
    "@type": "WebApplication",
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    inLanguage: "de-DE",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    keywords: weg.keywords.join(", "),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "de-DE",
    description: site.description,
  };
}

/** Titel und Beschreibung einer Tool- oder Variantenseite an einer Stelle. */
export function toolSeo(tool: ToolManifest, variant?: ToolVariant) {
  const title = variant?.title ?? `${tool.name} – kostenlos & ohne Anmeldung`;
  const heading = variant?.heading ?? variant?.title ?? tool.name;
  const description = variant?.description ?? tool.tagline;
  const path = variant
    ? variantPath(tool.slug, variant.slug)
    : toolPath(tool.slug);

  return { title, heading, description, path };
}

/**
 * Das komplette Metadata-Objekt für Tool- und Variantenseiten. Beide Routen
 * müssen exakt dieselben Werte liefern – der einzige Unterschied ist, ob eine
 * Variante mitkommt.
 */
export function toolMetadata(
  tool: ToolManifest,
  variant?: ToolVariant,
): Metadata {
  const { title, heading, description, path } = toolSeo(tool, variant);
  const image = ogImagePath(tool.slug, variant?.slug);

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: heading }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

/** Titel und Beschreibung einer Weg-Seite – Gegenstück zu toolSeo(). */
export function wegSeo(weg: WegManifest, variant?: ToolVariant) {
  const title = variant?.title ?? `${weg.name} – kostenlos & ohne Anmeldung`;
  const heading = variant?.heading ?? variant?.title ?? weg.name;
  const description = variant?.description ?? weg.tagline;
  const path = variant
    ? wegVariantPath(weg.slug, variant.slug)
    : wegPath(weg.slug);

  return { title, heading, description, path };
}

/** Das komplette Metadata-Objekt für Weg-Seiten – Gegenstück zu toolMetadata(). */
export function wegMetadata(weg: WegManifest, variant?: ToolVariant): Metadata {
  const { title, heading, description, path } = wegSeo(weg, variant);
  const image = ogImagePath(weg.slug, variant?.slug);

  return {
    title,
    description,
    keywords: weg.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: heading }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}
