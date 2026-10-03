"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useFavorites } from "@/lib/useFavorites";

/**
 * Bekommt jede ToolCard fertig gerendert vom Server (`items`) – dadurch
 * braucht dieser Client-Baustein selbst nie die Tool-Registry zu importieren.
 * Die zöge über die Manifeste sämtliche Rechner-Components (und deren Logik)
 * ins Client-Bundle, nur um Slug, Name und Icon einer Karte zu kennen.
 * Gefiltert wird hier nur nach Slug, nicht nach den Karten-Inhalten selbst.
 */
export function FavoritesView({
  items,
}: {
  items: { slug: string; node: ReactNode }[];
}) {
  const { favorites } = useFavorites();

  // Zuletzt gemerkt zuerst – das ist meist der Rechner, den man gerade sucht.
  const ordered = [...favorites].reverse().flatMap((slug) => {
    const item = items.find((entry) => entry.slug === slug);
    return item ? [item] : [];
  });

  if (ordered.length === 0) {
    return (
      <div className="surface-soft flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Star className="size-8 text-muted" aria-hidden="true" />
        <p className="max-w-sm text-muted">
          Noch keine Favoriten. Auf einer Rechner-Karte oben rechts auf den
          Stern tippen, um sie hier zu merken.
        </p>
        <Link
          prefetch={false}
          href="/rechner/"
          className="mt-1 text-sm font-semibold text-accent underline decoration-(--link-line) underline-offset-2"
        >
          Rechner durchsuchen
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((item) => (
        <li key={item.slug} className="flex">
          {item.node}
        </li>
      ))}
    </ul>
  );
}
