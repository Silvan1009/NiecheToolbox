import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toolPath } from "@/lib/seo";
import { categoryLabels, type ToolManifest } from "@/tools/types";

export function ToolCard({
  tool,
  showCategory = true,
}: {
  tool: ToolManifest;
  /**
   * Auf /rechner/ steht die Karte schon unter einer thematischen Gruppe –
   * ein zusätzlicher Kategorie-Pill mit abweichendem Wort (z. B. "Geld"
   * unter der Überschrift "Wohnen & Verträge") würde dort zwei Taxonomien
   * gegeneinander ausspielen.
   */
  showCategory?: boolean;
}) {
  const Icon = tool.icon;

  return (
    <Link
      href={toolPath(tool.slug)}
      className="group surface-soft flex w-full flex-col p-6 transition-[box-shadow,transform] duration-(--dur-base) ease-(--ease-out) hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-control bg-accent-soft text-accent transition-colors duration-(--dur-fast) group-hover:bg-accent group-hover:text-white">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        {showCategory && (
          <span className="rounded-pill bg-ink-soft px-2.5 py-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
            {categoryLabels[tool.category]}
          </span>
        )}
        {tool.status === "beta" && (
          <span className="rounded-pill bg-accent-soft px-2.5 py-1 text-[11px] font-semibold tracking-wide text-accent uppercase">
            Beta
          </span>
        )}
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
        {tool.name}
      </h3>
      <p className="mt-1.5 flex-1 text-[15px] text-muted">{tool.tagline}</p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Öffnen
        <ArrowRight
          className="size-4 transition-transform duration-(--dur-fast) group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
