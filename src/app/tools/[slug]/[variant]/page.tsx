import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/ToolPageShell";
import { ogImageUrl, toolSeo } from "@/lib/seo";
import { getTool, publicTools } from "@/tools/registry";

/**
 * Programmatische SEO-Seiten: alles, was `getVariants()` eines Tools liefert
 * (z. B. /tools/brueckentage/bayern-2026). Wird statisch vorgerendert.
 */
export function generateStaticParams() {
  return publicTools().flatMap((tool) =>
    (tool.getVariants?.() ?? []).map((variant) => ({
      slug: tool.slug,
      variant: variant.slug,
    })),
  );
}

export const revalidate = 86_400;
export const dynamicParams = false;

function resolve(slug: string, variantSlug: string) {
  const tool = getTool(slug);
  const variant = tool?.getVariants?.().find((v) => v.slug === variantSlug);
  return tool && variant ? { tool, variant } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; variant: string }>;
}): Promise<Metadata> {
  const { slug, variant: variantSlug } = await params;
  const found = resolve(slug, variantSlug);
  if (!found) return {};

  const { title, description, heading, path } = toolSeo(found.tool, found.variant);
  const image = ogImageUrl({ title: heading, subtitle: found.tool.name });

  return {
    title,
    description,
    keywords: found.tool.keywords,
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

export default async function ToolVariantPage({
  params,
}: {
  params: Promise<{ slug: string; variant: string }>;
}) {
  const { slug, variant: variantSlug } = await params;
  const found = resolve(slug, variantSlug);
  if (!found) notFound();

  return <ToolPageShell tool={found.tool} variant={found.variant} />;
}
