import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/ToolPageShell";
import { ogImageUrl, toolSeo } from "@/lib/seo";
import { getTool, publicTools } from "@/tools/registry";

/** Statisch erzeugt aus der Registry – ein neues Tool braucht keine neue Route. */
export function generateStaticParams() {
  return publicTools().map((tool) => ({ slug: tool.slug }));
}

/** Neu erzeugen, damit Laufzeit-Defaults wie das aktuelle Jahr nicht veralten. */
export const revalidate = 86_400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const { title, description, heading, path } = toolSeo(tool);
  const image = ogImageUrl({ title: heading, subtitle: tool.tagline });

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

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return <ToolPageShell tool={tool} />;
}
