"use client";

import { Star } from "lucide-react";
import { useFavorites } from "@/lib/useFavorites";

/**
 * Steht als Geschwister-Element neben dem Link einer ToolCard, nie darin –
 * ein <button> in einem <a> ist ungültiges HTML. Position kommt vom
 * `relative`-Container in ToolCard.
 */
export function FavoriteButton({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const { favorites, toggleFavorite } = useFavorites();
  const active = favorites.includes(slug);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active ? `${name} aus Favoriten entfernen` : `${name} zu Favoriten hinzufügen`
      }
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(slug);
      }}
      className="absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-control text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
    >
      <Star
        className={`size-[18px] ${active ? "fill-accent text-accent" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}
