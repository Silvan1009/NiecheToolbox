import { site } from "@/config/site";
import type { FaqEntry, ToolManifest, ToolVariant } from "@/tools/types";

/** Absolute URL aus einem Pfad – für canonical, OG und Sitemap. */
export function absoluteUrl(path: string): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export const toolPath = (slug: string) => `/tools/${slug}`;
export const variantPath = (slug: string, variant: string) =>
  `/tools/${slug}/${variant}`;

/** URL zum dynamisch gerenderten Open-Graph-Bild. */
export function ogImageUrl({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}): string {
  const search = new URLSearchParams({ title });
  if (subtitle) search.set("subtitle", subtitle);
  return `/api/og?${search.toString()}`;
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
  { name, description, path }: { name: string; description: string; path: string },
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
