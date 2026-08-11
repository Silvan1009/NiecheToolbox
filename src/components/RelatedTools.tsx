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
      <h2 id="related-heading" className="section-title">
        Passt dazu
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {related.map((tool) => {
          const Icon = tool.icon;
          return (
            <li key={tool.slug}>
              <Link
                href={toolPath(tool.slug)}
                className="group surface-soft related-tool-link"
              >
                <span className="related-tool-icon">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold">{tool.name}</span>
                  <span className="block field-hint">{tool.tagline}</span>
                </span>
                <ArrowRight className="related-tool-arrow" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
