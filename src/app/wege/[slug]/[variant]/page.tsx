import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WegPageShell } from "@/components/WegPageShell";
import { wegMetadata } from "@/lib/seo";
import { getWeg, publicWege } from "@/wege/registry";

/**
 * Programmatische SEO-Seiten: alles, was `getVariants()` eines Wegs liefert
 * (z. B. /wege/gehalt/5-prozent). Wird statisch vorgerendert. Spiegel von
 * app/tools/[slug]/[variant]/page.tsx für den Weg-Pfadraum.
 */
export function generateStaticParams() {
  return publicWege().flatMap((weg) =>
    (weg.getVariants?.() ?? []).map((variant) => ({
      slug: weg.slug,
      variant: variant.slug,
    })),
  );
}

export const dynamicParams = false;

function resolve(slug: string, variantSlug: string) {
  const weg = getWeg(slug);
  const variant = weg?.getVariants?.().find((v) => v.slug === variantSlug);
  return weg && variant ? { weg, variant } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; variant: string }>;
}): Promise<Metadata> {
  const { slug, variant: variantSlug } = await params;
  const found = resolve(slug, variantSlug);
  if (!found) return {};

  return wegMetadata(found.weg, found.variant);
}

export default async function WegVariantPage({
  params,
}: {
  params: Promise<{ slug: string; variant: string }>;
}) {
  const { slug, variant: variantSlug } = await params;
  const found = resolve(slug, variantSlug);
  if (!found) notFound();

  return <WegPageShell weg={found.weg} variant={found.variant} />;
}
