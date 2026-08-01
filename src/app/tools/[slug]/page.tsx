import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageShell } from "@/components/ToolPageShell";
import { toolMetadata } from "@/lib/seo";
import { getTool, publicTools } from "@/tools/registry";

/** Statisch erzeugt aus der Registry – ein neues Tool braucht keine neue Route. */
export function generateStaticParams() {
  return publicTools().map((tool) => ({ slug: tool.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return toolMetadata(tool);
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
