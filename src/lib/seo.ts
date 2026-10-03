import type { Metadata } from "next";
import { legal, site } from "@/config/site";
import type { FaqEntry, ToolManifest, ToolVariant } from "@/tools/types";
import type { WegManifest } from "@/wege/types";

/* --- Grenzen ----------------------------------------------------------------
 *
 * Google schneidet Titel nach Pixelbreite ab, in der Praxis bei rund 60
 * Zeichen, Beschreibungen bei rund 160. Darunter fehlt der Beschreibung die
 * Substanz, und Google ersetzt sie durch einen selbst gewählten Ausschnitt.
 * seo.test.ts und scripts/seo-audit.ts setzen diese Grenzen durch – für jede
 * Seite, bei jedem Build.
 */
export const TITLE_MAX = 60;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;

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

/**
 * Seiten ohne Manifest – Startseite, Übersichten, Über uns, Rechtliches.
 * Jede bekommt ein eigenes Vorschaubild; der Präfix hält sie von den
 * Tool-Slugs getrennt (seo.test.ts prüft, dass kein Slug so beginnt).
 */
export const STATIC_OG_PREFIX = "seite-";
export type StaticPageKey =
  "start" | "rechner" | "wege" | "ueber" | "rechtliches";

export function staticOgImagePath(key: StaticPageKey): string {
  return `/og/${STATIC_OG_PREFIX}${key}.png`;
}

/* --- Titel und Metadata ---------------------------------------------------- */

/**
 * Hängt den Seitennamen an, solange der Titel dabei unter der Grenze bleibt.
 *
 * Ein fester Suffix für alle Seiten hat 50 von 67 Titeln über 60 Zeichen
 * getrieben – abgeschnitten wurde dann der Teil, der die Seite beschreibt,
 * nicht der Markenname. Der Inhalt hat Vorrang; die Marke steht zusätzlich in
 * `og:site_name` und im strukturierten Datum.
 */
export function pageTitle(title: string): string {
  const withBrand = `${title} | ${site.name}`;
  return withBrand.length <= TITLE_MAX ? withBrand : title;
}

export interface PageSeo {
  /** Ohne Markennamen – pageTitle() entscheidet, ob er noch passt. */
  title: string;
  description: string;
  /** Pfad mit führendem und abschließendem Schrägstrich. */
  path: string;
  /** Pfad zum Vorschaubild, 1200 × 630. */
  image: string;
  imageAlt: string;
  /** `false` nimmt die Seite aus dem Index, lässt ihre Links aber gelten. */
  index?: boolean;
}

/**
 * Das komplette Metadata-Objekt einer Seite – die einzige Stelle, die es baut.
 *
 * Vollständig statt ergänzend: Next verschmilzt `openGraph` nicht feldweise
 * mit dem des Layouts, sondern ersetzt es als Ganzes. Was hier fehlt, fehlt
 * auf der Seite. Vorher verloren die Rechnerseiten so `og:site_name` und
 * `og:locale`, und acht Seiten ohne eigenes `openGraph` erbten Titel, URL und
 * Canonical der Startseite.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  index = true,
}: PageSeo): Metadata {
  return {
    title: { absolute: pageTitle(title) },
    description,
    alternates: { canonical: path },
    robots: { index, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: site.name,
      title,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Titel, Überschrift und Beschreibungen einer Tool- oder Variantenseite. */
export function toolSeo(tool: ToolManifest, variant?: ToolVariant) {
  const title = variant?.title ?? tool.seoTitle;
  const heading = variant?.heading ?? variant?.title ?? tool.name;
  /** Für Suchergebnis und Vorschau. */
  const description = variant?.description ?? tool.metaDescription;
  /** Der sichtbare Satz unter der Überschrift. */
  const lead = variant?.description ?? tool.tagline;
  const path = variant
    ? variantPath(tool.slug, variant.slug)
    : toolPath(tool.slug);

  return { title, heading, description, lead, path };
}

export function toolMetadata(
  tool: ToolManifest,
  variant?: ToolVariant,
): Metadata {
  const { title, heading, description, path } = toolSeo(tool, variant);
  return pageMetadata({
    title,
    description,
    path,
    image: ogImagePath(tool.slug, variant?.slug),
    imageAlt: heading,
  });
}

/** Gegenstück zu toolSeo() für einen Weg. */
export function wegSeo(weg: WegManifest, variant?: ToolVariant) {
  const title = variant?.title ?? weg.seoTitle;
  const heading = variant?.heading ?? variant?.title ?? weg.name;
  const description = variant?.description ?? weg.metaDescription;
  const lead = variant?.description ?? weg.tagline;
  const path = variant
    ? wegVariantPath(weg.slug, variant.slug)
    : wegPath(weg.slug);

  return { title, heading, description, lead, path };
}

export function wegMetadata(weg: WegManifest, variant?: ToolVariant): Metadata {
  const { title, heading, description, path } = wegSeo(weg, variant);
  return pageMetadata({
    title,
    description,
    path,
    image: ogImagePath(weg.slug, variant?.slug),
    imageAlt: heading,
  });
}

/* --- Strukturierte Daten --------------------------------------------------- */

interface JsonLdNode {
  "@type": string | string[];
  [key: string]: unknown;
}

/** Ein einzelnes @graph-Objekt statt vieler Script-Tags. */
export function jsonLdGraph(nodes: JsonLdNode[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

/**
 * Feste Kennungen für die drei Knoten, die auf jeder Seite dieselben sind.
 * Über sie verweisen die Seitenknoten auf Betreiber und Website, statt deren
 * Angaben jedes Mal zu wiederholen.
 */
const organizationId = `${site.url}/#organisation`;
const personId = `${site.url}/#betreiber`;
const websiteId = `${site.url}/#website`;

export function personNode(): JsonLdNode {
  return {
    "@type": "Person",
    "@id": personId,
    name: legal.operator.name,
    url: absoluteUrl("/ueber/"),
  };
}

export function organizationNode(): JsonLdNode {
  const { operator } = legal;
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: site.name,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.png"),
      width: 512,
      height: 512,
    },
    email: operator.email,
    founder: { "@id": personId },
    address: {
      "@type": "PostalAddress",
      streetAddress: operator.street,
      postalCode: operator.zip,
      addressLocality: operator.city,
      addressCountry: "DE",
    },
  };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: site.name,
    url: site.url,
    inLanguage: "de-DE",
    description: site.description,
    publisher: { "@id": organizationId },
  };
}

/** Betreiber, Person und Website – gehört in den Graph jeder Seite. */
export function siteNodes(): JsonLdNode[] {
  return [organizationNode(), personNode(), websiteNode()];
}

/**
 * Die Seite selbst. `dateModified` nennt den Tag der letzten Änderung an
 * Rechner oder Text (siehe lib/lastModified.ts) – fehlt er, bleibt das Feld
 * weg, statt ein erfundenes Datum zu tragen.
 */
export function webPageNode({
  type = "WebPage",
  name,
  description,
  path,
  image,
  dateModified,
}: {
  type?: "WebPage" | "CollectionPage" | "AboutPage";
  name: string;
  description: string;
  path: string;
  image?: string;
  dateModified?: string;
}): JsonLdNode {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#seite`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "de-DE",
    isPartOf: { "@id": websiteId },
    author: { "@id": personId },
    publisher: { "@id": organizationId },
    ...(image ? { primaryImageOfPage: absoluteUrl(image) } : {}),
    ...(dateModified ? { dateModified } : {}),
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

/** Der Rechner als Anwendung – für Tools und Wege dieselbe Struktur. */
export function applicationNode({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): JsonLdNode {
  return {
    "@type": "WebApplication",
    "@id": `${absoluteUrl(path)}#rechner`,
    name,
    description,
    url: absoluteUrl(path),
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    browserRequirements: "Erfordert JavaScript",
    inLanguage: "de-DE",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    mainEntityOfPage: { "@id": `${absoluteUrl(path)}#seite` },
    publisher: { "@id": organizationId },
  };
}
