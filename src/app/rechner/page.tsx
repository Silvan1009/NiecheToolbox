import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/config/site";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { absoluteUrl, breadcrumbNode, jsonLdGraph, variantPath } from "@/lib/seo";
import { getTool, publicTools } from "@/tools/registry";
import { toolsWithIndexedVariants, toolGroups } from "@/tools/groups";

/**
 * Gruppierte Übersicht – Ergänzung zur flachen Liste auf der Startseite
 * (#tools), nicht deren Ersatz. Deshalb eigenes strukturiertes Datum
 * (CollectionPage statt ItemList) und eigene Gruppen-Hinweistexte, damit die
 * Seite nicht wie eine reine Umsortierung derselben Karten wirkt.
 */
export const metadata: Metadata = {
  title: "Rechner nach Thema",
  description:
    "Alle Rechner nach Thema sortiert: Geld & Finanzen, Wohnen & Verträge, Arbeit & Zeit, Essen & Feiern.",
  alternates: { canonical: "/rechner/" },
};

export default function RechnerPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <div className="tool-column">
        <h1 className="font-display text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight">
          Rechner nach Thema
        </h1>
        <p className="mt-3 text-lg text-muted">
          Dieselben Rechner wie auf der Startseite, sortiert nach dem, wofür du
          sie brauchst. Manche stehen bewusst in mehr als einer Gruppe.
        </p>
      </div>

      <nav
        aria-label="Sprung zu einer Gruppe"
        className="mt-8 flex flex-wrap gap-2"
      >
        {toolGroups.map((group) => (
          <a
            key={group.slug}
            href={`#${group.slug}`}
            className="rounded-pill bg-ink-soft px-3 py-1.5 text-sm font-medium text-muted transition-colors duration-(--dur-fast) hover:bg-accent-soft hover:text-accent"
          >
            {group.label}
          </a>
        ))}
      </nav>

      <div className="mt-12 flex flex-col gap-14">
        {toolGroups.map((group) => {
          const tools = group.tools
            .map((slug) => getTool(slug))
            .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

          return (
            <section
              key={group.slug}
              id={group.slug}
              aria-labelledby={`${group.slug}-heading`}
              className="scroll-mt-8"
            >
              <h2
                id={`${group.slug}-heading`}
                className="font-display text-xl font-semibold tracking-tight"
              >
                {group.label}
              </h2>
              <p className="mt-1.5 max-w-xl text-muted">{group.hint}</p>

              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => {
                  // Bei Tools, deren Unterseiten je ein eigenes Thema sind,
                  // stehen sie direkt unter der Karte – sonst wären sie nur
                  // über die Tool-Seite erreichbar.
                  const varianten = toolsWithIndexedVariants.includes(
                    tool.slug,
                  )
                    ? (tool.getVariants?.() ?? [])
                    : [];

                  return (
                  <li key={tool.slug} className="flex flex-col gap-3">
                    <ToolCard tool={tool} showCategory={false} />

                    {varianten.length > 0 && (
                      <ul className="flex flex-col gap-1 px-1">
                        {varianten.map((variant) => (
                          <li key={variant.slug}>
                            <Link
                              href={variantPath(tool.slug, variant.slug)}
                              className="group flex items-center gap-1.5 rounded-control px-2 py-1 text-sm text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
                            >
                              <ArrowRight
                                className="size-3.5 shrink-0 text-muted transition-transform duration-(--dur-fast) group-hover:translate-x-0.5"
                                aria-hidden="true"
                              />
                              {variant.heading ?? variant.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <JsonLd
        data={jsonLdGraph([
          {
            "@type": "CollectionPage",
            name: "Rechner nach Thema",
            url: absoluteUrl("/rechner/"),
            inLanguage: "de-DE",
            isPartOf: { "@type": "WebSite", name: site.name, url: site.url },
            hasPart: publicTools().map((tool) => ({
              "@type": "WebApplication",
              name: tool.name,
              url: absoluteUrl(`/tools/${tool.slug}/`),
            })),
          },
          breadcrumbNode([
            { name: site.name, path: "/" },
            { name: "Rechner nach Thema", path: "/rechner/" },
          ]),
        ])}
      />
    </div>
  );
}
