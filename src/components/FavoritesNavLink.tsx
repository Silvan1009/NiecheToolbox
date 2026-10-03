"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useFavorites } from "@/lib/useFavorites";

/** Sternsymbol im Header, verlinkt auf /favoriten/. Zählt live mit. */
export function FavoritesNavLink() {
  const { favorites } = useFavorites();
  const count = favorites.length;

  return (
    <Link
      prefetch={false}
      href="/favoriten/"
      aria-label={count > 0 ? `Favoriten (${count})` : "Favoriten"}
      className="header-icon-btn"
    >
      <Star
        className={`size-[18px] ${count > 0 ? "fill-accent text-accent" : ""}`}
        aria-hidden="true"
      />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 grid size-3.5 place-items-center rounded-full bg-accent text-[9px] font-semibold text-white"
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
