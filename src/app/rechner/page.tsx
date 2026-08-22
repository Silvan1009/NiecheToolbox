import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { site } from "@/config/site";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import {
  absoluteUrl,
  breadcrumbNode,
  jsonLdGraph,
  variantPath,
} from "@/lib/seo";
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
                  // stehen sie unter der Karte – sonst wären sie nur über die
                  // Tool-Seite erreichbar.
                  //
                  // Früher stand die Liste in einem Hover-Flyout (opacity-0,
                  // erst bei Mauskontakt sichtbar). Auf dem Telefon bekam sie
                  // damit niemand zu Gesicht, und ein Link, den nur der
                  // Crawler sieht, ist genau das Muster, das eine
                  // AdSense-Prüfung als Doorway-Verlinkung liest. Jetzt ein
                  // aufklappbares <details>: sichtbar, tastaturbedienbar,
                  // ohne JavaScript – und die Karten bleiben gleich groß,
                  // weil zugeklappt nur eine Zeile dazukommt.
                  const varianten = toolsWithIndexedVariants.includes(tool.slug)
                    ? (tool.getVariants?.() ?? [])
                    : [];

                  return (
                    <li key={tool.slug} className="flex flex-col">
                      <ToolCard tool={tool} showCategory={false} />

                      {varianten.length > 0 && (
                        <details className="group mt-2">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 rounded-control px-2 py-1.5 text-sm text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink">
                            {varianten.length} fertige Fälle
                            <ChevronDown
                              className="chevron-rotate"
                              aria-hidden="true"
                            />
                          </summary>
                          <ul className="mt-1 flex flex-col gap-1 pb-1">
                            {varianten.map((variant) => (
                              <li key={variant.slug}>
                                <Link
                                  href={variantPath(tool.slug, variant.slug)}
                                  className="group/link flex items-center gap-1.5 rounded-control px-2 py-1 text-sm text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
                                >
                                  <ArrowRight
                                    className="size-3.5 shrink-0 text-muted transition-transform duration-(--dur-fast) group-hover/link:translate-x-0.5"
                                    aria-hidden="true"
                                  />
                                  {variant.listLabel ??
                                    variant.heading ??
                                    variant.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {/* data-prose: scripts/content-audit.ts misst genau diesen Bereich. */}
      <div className="tool-column mt-14 pb-4">
        <section data-prose aria-labelledby="einordnung-heading">
          <h2 id="einordnung-heading" className="section-title">
            Wie die Gruppen zustande kommen
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-[17px] leading-relaxed text-muted">
            <p>
              Jeder Rechner hat in der Registry genau eine feste Kategorie –
              für die Suche, die Meta-Beschreibung und die Karte auf der
              Startseite. Diese Seite sortiert zusätzlich nach Anlass, und ein
              Anlass kennt keine Fachgrenzen: Der Immobilienrechner steht
              deshalb sowohl unter „Geld & Finanzen“ als auch unter „Wohnen &
              Verträge“, weil eine Kaufentscheidung beides zugleich ist. Das
              ist Absicht und kein Fehler in der Zuordnung.
            </p>
            <p>
              Innerhalb einer Gruppe stehen die Rechner nicht alphabetisch,
              sondern in der Reihenfolge, in der eine Frage typischerweise auf
              die nächste folgt – bei „Familie & Kinder“ etwa vom errechneten
              Geburtstermin über Kindergeld und Elterngeld bis zur Elternzeit.
              Wer stattdessen schon weiß, welcher Rechner es sein soll, findet
              ihn über die Suche oben schneller als über diese Liste.
            </p>
          </div>
        </section>
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
