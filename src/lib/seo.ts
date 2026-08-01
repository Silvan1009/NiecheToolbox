import type { Metadata } from "next";
import { site } from "@/config/site";
import type { FaqEntry, ToolManifest, ToolVariant } from "@/tools/types";

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
 * Gilt nur für Seiten. Dateien mit Endung (/sitemap.xml, /ads.txt) und die
 * Bilder unter /og/ bleiben unverändert.
 */
export function pagePath(path: string): string {
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

export const toolPath = (slug: string) => `/tools/${slug}/`;
export const variantPath = (slug: string, variant: string) =>
  `/tools/${slug}/${variant}/`;

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
