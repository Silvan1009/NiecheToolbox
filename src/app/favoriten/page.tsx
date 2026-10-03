import type { Metadata } from "next";
import { FavoritesView } from "@/components/FavoritesView";
import { ToolCard } from "@/components/ToolCard";
import { pageMetadata, staticOgImagePath } from "@/lib/seo";
import { WegCard } from "@/components/WegCard";
import { publicTools } from "@/tools/registry";
import { publicWege } from "@/wege/registry";

/**
 * Rein clientseitiger Inhalt (Favoriten liegen im localStorage) – für
 * Suchmaschinen gibt es hier nie etwas Individuelles zu indexieren.
 */
export const metadata: Metadata = pageMetadata({
  title: "Favoriten",
  description:
    "Deine gemerkten Rechner auf einen Blick – gespeichert nur in diesem Browser, ohne Konto, ohne Synchronisierung und ohne dass etwas übertragen wird.",
  path: "/favoriten/",
  image: staticOgImagePath("start"),
  imageAlt: "Favoriten",
  index: false,
});

export default function FavoritenPage() {
  // Jede Karte fertig serverseitig gerendert, damit FavoritesView (Client)
  // nie die Tool- oder Wege-Registry importieren muss – nur nach Slug filtern.
  const items = [
    ...publicTools().map((tool) => ({
      slug: tool.slug,
      node: <ToolCard tool={tool} />,
    })),
    ...publicWege().map((weg) => ({
      slug: weg.slug,
      node: <WegCard weg={weg} />,
    })),
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <div className="tool-column">
        <h1 className="font-display text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight">
          Favoriten
        </h1>
        <p className="mt-3 text-lg text-muted">
          Rechner, die du dir mit dem Stern gemerkt hast. Das gilt nur für
          diesen Browser – kein Konto, keine Synchronisierung.
        </p>
      </div>

      <div className="mt-10">
        <FavoritesView items={items} />
      </div>
    </div>
  );
}
