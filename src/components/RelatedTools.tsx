import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toolPath } from "@/lib/seo";
import { relatedTools } from "@/tools/registry";

/** Interne Verlinkung zwischen thematisch nahen Tools. */
export function RelatedTools({ slug }: { slug: string }) {
  const related = relatedTools(slug);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="font-display text-xl font-semibold tracking-tight"
      >
        Passt dazu
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((tool) => {
          const Icon = tool.icon;
          return (
            <li key={tool.slug}>
              <Link
                href={toolPath(tool.slug)}
                className="group surface-soft flex items-center gap-3 p-4 transition-shadow duration-(--dur-base) hover:shadow-lift"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-control bg-accent-soft text-accent">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{tool.name}</span>
                  <span className="block text-[13px] text-muted">
                    {tool.tagline}
                  </span>
                </span>
                <ArrowRight
                  className="size-4 shrink-0 text-muted transition-transform duration-(--dur-fast) group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
