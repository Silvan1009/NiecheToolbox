import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { wegPath } from "@/lib/seo";
import type { WegManifest } from "@/wege/types";

/**
 * Wie ToolCard.tsx, mit einem "Weg"-Badge statt der Kategorie – ein Weg führt
 * zu einer mehrstufigen Strecke, kein einzelnes Eingabefeld, das soll auf der
 * Karte schon erkennbar sein, bevor jemand klickt.
 */
export function WegCard({ weg }: { weg: WegManifest }) {
  const Icon = weg.icon;

  return (
    <div className="relative w-full">
      <FavoriteButton slug={weg.slug} name={weg.name} />
      <Link
        prefetch={false}
        href={wegPath(weg.slug)}
        className="group surface-soft flex h-full w-full flex-col p-6 transition-[box-shadow,transform] duration-(--dur-base) ease-(--ease-out) hover:-translate-y-0.5 hover:shadow-lift"
      >
        <div className="flex items-center gap-3 pr-9">
          <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent transition-colors duration-(--dur-fast) group-hover:bg-accent group-hover:text-white">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <span className="rounded-pill bg-ink-soft px-2.5 py-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
            Weg
          </span>
        </div>

        <h3 className="mt-4 pr-9 card-title">{weg.name}</h3>
        <p className="mt-1.5 flex-1 text-[15px] text-muted">{weg.tagline}</p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          Loslegen
          <ArrowRight
            className="size-4 transition-transform duration-(--dur-fast) group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>
    </div>
  );
}
