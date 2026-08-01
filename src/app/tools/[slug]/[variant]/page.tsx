import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/ToolPageShell";
import { toolMetadata } from "@/lib/seo";
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

  return toolMetadata(found.tool, found.variant);
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
