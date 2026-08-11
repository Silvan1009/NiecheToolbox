import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WegPageShell } from "@/components/WegPageShell";
import { wegMetadata } from "@/lib/seo";
import { getWeg, publicWege } from "@/wege/registry";

/** Statisch erzeugt aus der Registry – ein neuer Weg braucht keine neue Route. */
export function generateStaticParams() {
  return publicWege().map((weg) => ({ slug: weg.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const weg = getWeg(slug);
  if (!weg) return {};

  return wegMetadata(weg);
}

export default async function WegPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const weg = getWeg(slug);
  if (!weg) notFound();

  return <WegPageShell weg={weg} />;
}
