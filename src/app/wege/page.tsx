import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WegCard } from "@/components/WegCard";
import { lastModified, lastModifiedKey } from "@/lib/lastModified";
import {
  absoluteUrl,
  breadcrumbNode,
  jsonLdGraph,
  pageMetadata,
  siteNodes,
  staticOgImagePath,
  webPageNode,
  wegPath,
} from "@/lib/seo";
import { publicWege } from "@/wege/registry";

/**
 * Übersicht aller Wege – Gegenstück zu /rechner für Wege statt Tools. Heute
 * nur über den Abschnitt auf der Startseite erreichbar; diese Seite macht
 * /wege/ selbst verlinkbar und indexierbar.
 */
const TITLE = "Wege: mehrere Rechner zu einem Urteil";
const DESCRIPTION =
  "Ein Weg verkettet mehrere Rechner zu einem Urteil statt einer einzelnen Zahl: Hauskauf, Autokauf, Gehaltserhöhung, Nachwuchs und früherer Ruhestand.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/wege/",
  image: staticOgImagePath("wege"),
  imageAlt: "Wege – mehrere Rechner zu einem Urteil",
});

export default function WegePage() {
  const wege = publicWege();

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <div className="tool-column">
        <h1 className="font-display text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight">
          Wege
        </h1>
        <p className="mt-3 text-lg text-muted">
          Ein Weg kombiniert mehrere Rechner zu einem Urteil: komfortabel,
          tragbar oder eng – statt einer Zahl allein.
        </p>
      </div>

      {/* Die Karten tragen <h3>. Ohne diese Zwischenstufe folgte <h3> direkt
          auf <h1> – für Screenreader eine fehlende Gliederungsebene. */}
      <h2 className="sr-only">Alle Wege</h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wege.map((weg) => (
          <li key={weg.slug} className="flex">
            <WegCard weg={weg} />
          </li>
        ))}
      </ul>

      {/* data-prose: scripts/content-audit.ts misst genau diesen Bereich. */}
      <div className="tool-column mt-14 pb-4">
        <section data-prose aria-labelledby="unterschied-heading">
          <h2 id="unterschied-heading" className="section-title">
            Was einen Weg von einem Rechner unterscheidet
          </h2>
          <div className="mt-4 flex flex-col gap-4 text-[17px] leading-relaxed text-muted">
            <p>
              Ein einzelner Rechner beantwortet eine Frage: Wie hoch ist die
              Grunderwerbsteuer, wie viel Netto bleibt von einer
              Gehaltserhöhung, wie stark sinkt die Rente bei vorzeitigem
              Ruhestand. Ein Weg verkettet mehrere dieser Rechner zu einem
              Urteil, das keiner von ihnen allein liefern kann – etwa, ob sich
              ein Immobilienkauf beim eigenen Einkommen überhaupt trägt. Dafür
              übergibt ein Weg die Ergebnisse eines Schritts als Startwerte an
              den nächsten, statt sie erneut abzufragen.
            </p>
            <p>
              Jeder Schritt bleibt trotzdem ein vollständiger, einzeln nutzbarer
              Rechner: Ein Weg führt zu ihm hin und zurück, ersetzt ihn aber
              nicht. Wer nur eine der Teilfragen hat, findet den passenden
              Rechner auch direkt über die{" "}
              <Link
                prefetch={false}
                href="/rechner/"
                className="text-link"
              >
                Übersicht nach Thema
              </Link>
              .
            </p>
          </div>
        </section>
      </div>

      <JsonLd
        data={jsonLdGraph([
          ...siteNodes(),
          {
            ...webPageNode({
              type: "CollectionPage",
              name: TITLE,
              description: DESCRIPTION,
              path: "/wege/",
              image: staticOgImagePath("wege"),
              dateModified: lastModified(lastModifiedKey.page("wege")),
            }),
            hasPart: wege.map((weg) => ({
              "@type": "WebApplication",
              name: weg.name,
              url: absoluteUrl(wegPath(weg.slug)),
            })),
          },
          breadcrumbNode([
            { name: "Start", path: "/" },
            { name: "Wege", path: "/wege/" },
          ]),
        ])}
      />
    </div>
  );
}
